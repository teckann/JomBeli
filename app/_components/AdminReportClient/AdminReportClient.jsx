"use client";

import AdminTable from '@/app/_components/AdminTable/AdminTable';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import Styles from './AdminReportClient.module.css';

export default function AdminReportClient({month, year, total, monthlyProducts, mostCategory, titles, fields}) {

    const router = useRouter();
    const reportRef = useRef(null);

    const monthLists = ["January", "February", "March", "April", "May", "June", "July", "August",
        "September", "October", "November", "December"
    ];

    const downloadPdf = async () => {
        // cannot import html2pdf at top, because have no self
        const html2pdf = (await import("html2pdf.js")).default;

        await html2pdf(reportRef.current);

        // redirect to manage product page
        router.push("/admin/ManageProducts");
    }

    downloadPdf();
    
    return(
    <div ref={reportRef} className={ Styles.reportFrame }>
            <div className={ Styles.companyInfo }>
                <h1><span className={ Styles.logo }>JomBeli</span> Company</h1>
                <h3>Platform Product Review</h3>
                <h3>Report for {monthLists[month]}, {year}</h3>
            </div>
            <div className={ Styles.moreInsights }>
                <table className={ Styles.tableWithInfo }>
                    <tbody>
                        <tr>
                            <td className={ Styles.firstCol }><strong>Total Product</strong></td>
                            <td className={ Styles.secCol }><strong>{(total || 0)}</strong></td>
                        </tr>
                        <tr>
                            <td className={ Styles.firstCol }><strong>New Product</strong></td>
                            <td className={ Styles.secCol }><strong>{monthlyProducts.length}</strong></td>
                        </tr>
                        <tr>
                            <td className={ Styles.firstCol }><strong>Most Popular New Product Category</strong></td>
                            <td className={ Styles.secCol }><strong>{mostCategory}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className={ Styles.adminTable}>
                <AdminTable titles={titles} fields={fields} datas={monthlyProducts} slice={false} dataIdFormat="product_id" />
            </div>
        </div>)
}