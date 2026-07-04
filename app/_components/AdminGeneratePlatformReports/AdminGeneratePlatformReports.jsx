'use client'
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function DownloadReportButton({
    companyName="JomBeli Company",
    reportTitle,
    reportSubtitle,
    summaryItems = [],
    tableTitle,
    columns,
    rows,
    filename = "report.pdf"
}){

    const handleDownload = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        let cursorY = 20;

        doc.setFont("helvetica","bold");
        doc.setFontSize(18);
        doc.setTextColor(144, 45, 65);
        doc.text(companyName, pageWidth / 2, cursorY, {align:"center"});
        cursorY += 10;

        doc.setFont("helvetica","normal");
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(reportTitle, pageWidth / 2, cursorY, {align:"center"});
        cursorY += 10;

        if (reportSubtitle){
            doc.setFontSize(13);
            doc.text(reportSubtitle, pageWidth / 2, cursorY, {align:"center"});
            cursorY += 8;
        }

        //summary box can skip if empty
        if (summaryItems.length > 0){
            const boxX = 14;
            const boxY = cursorY + 6;
            const boxWidth = pageWidth - 28;
            const rowHeight = 12;
            const boxHeight = summaryItems.length * rowHeight + 8;

            doc.setFillColor(247, 225, 215);
            doc.rect(boxX, boxY, boxWidth, boxHeight, "F");

            doc.setFontSize(11);
            doc.setTestColor(0, 0, 0);

            summaryItems.forEach((item,index) => {
                const lineY = boxY + 12 + index + rowHeight;
                doc.text(item.label, boxX + 8, lineY);
                doc.text(String(item.value), boxX + boxWidth - 8, lineY, {align:"right"});
            });

            cursorY = boxY + boxHeight + 12;
        } else {
            cursorY += 6;
        }
        
        //section title

        if (tableTitle){
            doc.setFontSize(13);
            doc.setTextColor(0, 0, 0);
            doc.text(tableTitle, pageWidth / 2, cursorY, {align: "center"});
            cursorY += 8;
        }

        //table section
        autoTable(doc, {
            startY: cursorY,
            head: [columns],
            body: rows,
            styles: {fontSize: 9, halign: "center"},
            headStyles: { fillColor: [144, 45, 65], textColor: 255 },
            alternateRowStyles: {fillColor: [232, 232, 232]},
            didDrawPage: (data) => {
                doc.setFontSize(8);
                doc.setTextColor(213, 161, 142);
                doc.text(
                    `Page ${data.pageNumber}`,
                    pageWidth / 2,
                    doc.internal.pageSize.getHeight() - 10,
                    {align: "center"}
                );
            },
        }); 

        doc.save(filename);
    };

    return(
        <button onlick={handleDownload} className="btn btn-primary">
            Download Report
        </button>
    )
}