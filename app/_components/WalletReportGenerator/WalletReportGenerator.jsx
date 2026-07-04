"use client";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useEffect, useState } from "react";
import styles from "../WalletFilterBar/WalletFilterBar.module.css";

export default function WalletReportGenerator({
  transactions,
  userInfo,
  currentMonth,
  currentType
}) {
  const [logoBase64, setLogoBase64] = useState(null);

  // Preload logo as Base64 on component mount
  useEffect(() => {
    const loadLogo = async () => {
      try {
        const response = await fetch("/logo.png");
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoBase64(reader.result);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.log("Logo not found or failed to load:", error);
      }
    };
    loadLogo();
  }, []);

  const generateReport = () => {
    const doc = new jsPDF();

    // Add Logo
    if (logoBase64) {
      try {
        doc.addImage(logoBase64, "PNG", 14, 14, 30, 30);
      } catch (error) {
        console.log("Failed to add logo, using placeholder:", error);
        drawPlaceholderLogo(doc);
      }
    } else {
      drawPlaceholderLogo(doc);
    }

    // Continue with the rest of the PDF
    addContent(doc);

    // Helper function to draw placeholder logo
    function drawPlaceholderLogo(docInstance) {
      docInstance.setFillColor(223, 59, 60);
      docInstance.roundedRect(14, 14, 30, 30, 5, 5, "F");
      docInstance.setTextColor(255, 255, 255);
      docInstance.setFontSize(16);
      docInstance.setFont("helvetica", "bold");
      docInstance.text("JB", 24, 34);
    }

    // Define the function that adds all the content
    function addContent(docInstance) {
      // Header - System Name
      docInstance.setTextColor(223, 59, 60);
      docInstance.setFontSize(24);
      docInstance.setFont("helvetica", "bold");
      docInstance.text("JomBeli", 50, 25);

      // Header - Report Title
      docInstance.setTextColor(51, 51, 51);
      docInstance.setFontSize(18);
      docInstance.text("Transaction Report", 50, 35);

      // Header - Date
      docInstance.setFontSize(10);
      docInstance.setTextColor(150, 150, 150);
      docInstance.text(
        `Generated on: ${new Date().toLocaleDateString("en-MY", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}`,
        50,
        42
      );

      // Line separator
      docInstance.setDrawColor(220, 220, 220);
      docInstance.line(14, 50, 195, 50);

      // User Information Section
      docInstance.setTextColor(51, 51, 51);
      docInstance.setFontSize(12);
      docInstance.setFont("helvetica", "bold");
      docInstance.text("User Information", 14, 62);

      docInstance.setFont("helvetica", "normal");
      docInstance.setFontSize(10);
      docInstance.text(`Name: ${userInfo?.username || "N/A"}`, 14, 70);
      docInstance.text(
        `Current Balance: RM ${userInfo?.balances?.toFixed(2) || "0.00"}`,
        14,
        77
      );

      // Filter Information
      docInstance.setFont("helvetica", "bold");
      docInstance.text("Filter Applied", 14, 89);

      docInstance.setFont("helvetica", "normal");
      let filterText = "All Transactions";
      if (currentMonth !== "all" || currentType !== "all") {
        const parts = [];
        if (currentMonth !== "all") parts.push(`Month: ${currentMonth}`);
        if (currentType !== "all") parts.push(`Type: ${currentType}`);
        filterText = parts.join(" | ");
      }
      docInstance.text(filterText, 14, 96);

      // Transactions Table
      const tableData = (transactions || []).map((tx) => [
        new Date(tx.created_at).toLocaleDateString("en-MY", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        tx.transaction_type || "N/A",
        tx.direction || "N/A",
        `RM ${tx.amount?.toFixed(2) || "0.00"}`,
      ]);

      let finalY = 105;

      // Add table using jspdf-autotable v5
      autoTable(docInstance, {
        head: [["Date & Time", "Description", "Type", "Amount"]],
        body: tableData,
        startY: 105,
        theme: "grid",
        headStyles: {
          fillColor: [223, 59, 60],
          textColor: 255,
          fontSize: 10,
          fontStyle: "bold",
        },
        bodyStyles: {
          fontSize: 9,
        },
        alternateRowStyles: {
          fillColor: [248, 248, 248],
        },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: "auto" },
          2: { cellWidth: 25 },
          3: { cellWidth: 30, halign: "right" },
        },
        willDrawCell: (data) => {
          // Skip header
          if (data.row.section === "head") return;

          // Only modify Type (column 2) and Amount (column 3)
          if (data.column.index === 2 || data.column.index === 3) {
            const transactionType = (transactions || [])[data.row.index]?.direction;

            if (transactionType === "Debit") {
              // Red color for Debit
              data.cell.textColor = [220, 53, 69];
            } else if (transactionType === "Credit") {
              // Teal/Cyan color for Credit
              data.cell.textColor = [32, 201, 151];
            }
          }
        },
        didDrawPage: (data) => {
          finalY = data.cursor.y;
        },
      });

      // Calculate totals
      finalY = finalY + 10;
      const totalCredit = (transactions || [])
        .filter((tx) => tx.direction === "Credit")
        .reduce((sum, tx) => sum + (tx.amount || 0), 0);
      const totalDebit = (transactions || [])
        .filter((tx) => tx.direction === "Debit")
        .reduce((sum, tx) => sum + (tx.amount || 0), 0);

      docInstance.setFont("helvetica", "bold");
      docInstance.setFontSize(10);
      // Total Credit - Teal color
      docInstance.setTextColor(32, 201, 151);
      docInstance.text(`Total Credit: RM ${totalCredit.toFixed(2)}`, 14, finalY);
      // Total Debit - Red color
      docInstance.setTextColor(220, 53, 69);
      docInstance.text(`Total Debit: RM ${totalDebit.toFixed(2)}`, 14, finalY + 7);

      // Footer
      const pageCount = docInstance.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        docInstance.setPage(i);
        docInstance.setFontSize(8);
        docInstance.setTextColor(150, 150, 150);
        docInstance.text(
          `Copyright 2026 © JomBeli. All rights reserved.`,
          14,
          docInstance.internal.pageSize.height - 10
        );
        docInstance.text(
          `Page ${i} of ${pageCount}`,
          docInstance.internal.pageSize.width - 30,
          docInstance.internal.pageSize.height - 10,
          { align: "right" }
        );
      }

      // Download the PDF
      const fileName = `JomBeli_Transaction_Report_${new Date()
        .toISOString()
        .split("T")[0]}.pdf`;
      docInstance.save(fileName);
    }
  };

  return (
    <button
      className={styles.button}
      onClick={generateReport}
      disabled={!transactions || transactions.length === 0}
      type="button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
        width="24"
        height="24"
      >
        <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6zm7 1.5L18.5 9H13V3.5zM8 13h8v2H8v-2zm0 4h8v2H8v-2zm0-8h5v2H8V9z" />
      </svg>
      <p>Generate Report</p>
    </button>
  );
}
