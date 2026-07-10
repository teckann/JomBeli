"use client";

import { useRouter } from 'next/navigation';
import { DownloadReportButton } from '@/app/_components/AdminGeneratePlatformReports/AdminGeneratePlatformReports';
import { formatDateTime } from "@/app/_lib/useful-func";
import Styles from '../../admin/PlatformReports/MonthlyYearly.module.css';
import BackButton from '@/app/_components/AdminBackButton/AdminBackButton';

export default function AdminReportClient({ month, year, total, monthlyProducts, mostCategory, titles, fields }) {

    const monthLists = ["January", "February", "March", "April", "May", "June", "July", "August",
        "September", "October", "November", "December"
    ];

    const periodLabel = `${monthLists[month]} ${year}`;

    // Prepare the table data
    const tableColumns = ["#", "Product ID", "Product Name", "Category", "Seller Name", "Created Date"];

    const tableRows = monthlyProducts.map((product, index) => [
        index + 1,
        product.product_id,
        product.product_name,
        product.category,
        product.USERS_T.username ?? "-",
        formatDateTime(product.created_at)
    ]);

    const summaryItems = [
        { label: "Total Products", value: total },
        { label: "New Products", value: monthlyProducts.length },
        { label: "Most Popular Category", value: mostCategory },
    ];

    return (
        <div className={Styles.formPage}>
            <BackButton />
            <h1>Product Report</h1>
            <div className={Styles.formBox}>
                {monthlyProducts.length === 0 ? (
                    <div className={Styles.errorText}>No products found for this period.</div>
                ) : (
                    <DownloadReportButton
                        companyName="JomBeli Company"
                        reportTitle="Platform Product Report"
                        reportSubtitle={`Report for ${periodLabel}`}
                        summaryItems={summaryItems}
                        tableTitle="Products"
                        columns={tableColumns}
                        rows={tableRows}
                        filename={`product-report-${periodLabel}.pdf`}
                    />
                )}
            </div>
        </div>
    );
}
