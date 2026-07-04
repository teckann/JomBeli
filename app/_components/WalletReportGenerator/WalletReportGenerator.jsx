"use client";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useEffect, useState } from "react";
import styles from "../WalletFilterBar/WalletFilterBar.module.css";

export default function WalletReportGenerator({
  transactions,
  userInfo,
  currentMonth,
  currentType,
}) {
  const [logoBase64, setLogoBase64] = useState(null);

  // logo
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

    // add logo
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

    // reset pdf
    addContent(doc);

    function drawPlaceholderLogo(docInstance) {
      docInstance.setFillColor(223, 59, 60);
      docInstance.roundedRect(14, 14, 30, 30, 5, 5, "F");
      docInstance.setTextColor(255, 255, 255);
      docInstance.setFontSize(16);
      docInstance.setFont("helvetica", "bold");
      docInstance.text("JB", 24, 34);
    }

    function addContent(docInstance) {
      docInstance.setTextColor(223, 59, 60);
      docInstance.setFontSize(24);
      docInstance.setFont("helvetica", "bold");
      docInstance.text("JomBeli", 50, 25);

      docInstance.setTextColor(51, 51, 51);
      docInstance.setFontSize(18);
      docInstance.text("Transaction Report", 50, 35);

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
        42,
      );

      docInstance.setDrawColor(220, 220, 220);
      docInstance.line(14, 50, 195, 50);

      // user info
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
        77,
      );

      // filter info
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

      // trans table
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
          // skip header
          if (data.row.section === "head") return;

          // edit type and amount column
          if (data.column.index === 2 || data.column.index === 3) {
            const transactionType = (transactions || [])[data.row.index]
              ?.direction;

            if (transactionType === "Debit") {
              // red
              data.cell.textColor = [220, 53, 69];
            } else if (transactionType === "Credit") {
              // green
              data.cell.textColor = [32, 201, 151];
            }
          }
        },
        didDrawPage: (data) => {
          finalY = data.cursor.y;
        },
      });

      // calc total
      finalY = finalY + 10;
      const totalCredit = (transactions || [])
        .filter((tx) => tx.direction === "Credit")
        .reduce((sum, tx) => sum + (tx.amount || 0), 0);
      const totalDebit = (transactions || [])
        .filter((tx) => tx.direction === "Debit")
        .reduce((sum, tx) => sum + (tx.amount || 0), 0);

      docInstance.setFont("helvetica", "bold");
      docInstance.setFontSize(10);
      // total credit
      docInstance.setTextColor(32, 201, 151);
      docInstance.text(
        `Total Credit: RM ${totalCredit.toFixed(2)}`,
        14,
        finalY,
      );
      // total debit
      docInstance.setTextColor(220, 53, 69);
      docInstance.text(
        `Total Debit: RM ${totalDebit.toFixed(2)}`,
        14,
        finalY + 7,
      );

      // footer
      const pageCount = docInstance.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        docInstance.setPage(i);
        docInstance.setFontSize(8);
        docInstance.setTextColor(150, 150, 150);
        docInstance.text(
          `Copyright 2026 © JomBeli. All rights reserved.`,
          14,
          docInstance.internal.pageSize.height - 10,
        );
        docInstance.text(
          `Page ${i} of ${pageCount}`,
          docInstance.internal.pageSize.width - 30,
          docInstance.internal.pageSize.height - 10,
          { align: "right" },
        );
      }

      // download
      const fileName = `JomBeli_Transaction_Report_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
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
