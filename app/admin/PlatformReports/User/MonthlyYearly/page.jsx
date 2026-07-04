'use client';

import { useState, useEffect, useCallback } from 'react';
import Styles from '../../MonthlyYearly.module.css';
import { DownloadReportButton } from '@/app/_components/AdminGeneratePlatformReports/AdminGeneratePlatformReports';
import BackButton from '@/app/_components/AdminBackButton/AdminBackButton';

const MONTHS = ["01","02","03","04","05","06","07","08","09","10","11","12"];

export default function UserMonthlyYearlyReportPage(){
    const [month, setMonth] = useState("06");
    const [year, setYear] = useState(2026);
    const [yearOnly, setYearOnly] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState(null);
    const [error, setError] = useState("");

    const fetchReport = useCallback(async () => {
        setLoading(true);
        setError("");
        
        try {
            const params = new URLSearchParams({ year, yearOnly: String(yearOnly) });
            if (!yearOnly) params.set("month", month);
            const res = await fetch(`/api/adminReports/periodUsers?${params}`);
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            
            const hasNoData = 
                data.totalNewUsers === 0 &&
                data.totalReportedSellers === 0 &&
                data.totalApprovedRefunds === 0 &&
                (!data.topItems || data.topItems.length === 0)

            if (hasNoData){
                setError("No data found for this period.");
                setReportData(null);
            }else {
                setReportData(data);
            }
        
        } catch (err) {
            console.error(err);
            setError("Something went wrong generating the report.");
        } finally {
            setLoading(false);
        }
    }, [month, year, yearOnly]);

    useEffect(() => {
        fetchReport();
    }, [fetchReport]);

    const periodLabel = yearOnly ? `${year}` : `${month} ${year}`;

    return (
        <div className={Styles.formPage}>
            <BackButton/>
            <h1>User Report</h1>
            <div className={Styles.formBox}>
                <select value={month} onChange={(e) => setMonth(e.target.value)} disabled={yearOnly}>
                    {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>

                <select value={year} onChange={(e) => setYear(e.target.value)}>
                    {[2024, 2025, 2026, 2027].map((y) => <option key={y} value={y}>{y}</option>)}
                </select>

                <label>
                    <input type="checkbox" checked={yearOnly} onChange={(e) => setYearOnly(e.target.checked)} />
                    Year only?
                </label>

                {loading && <p>Loading...</p>}
                {error && <div className={Styles.errorText}>{error}</div>}

                {reportData && (
                    <DownloadReportButton
                        companyName="JomBeli Company"
                        reportTitle="Platform User Report"
                        reportSubtitle={`Report for ${periodLabel}`}
                        summaryItems={[
                            { label: "Total New Users", value: reportData.totalNewUsers },
                            { label: "Reported Sellers", value: reportData.totalReportedSellers },
                            { label: "Approved Buyer Refunds", value: reportData.totalApprovedRefunds },
                        ]}
                        tableTitle="Top 5 Items Bought"
                        columns={["#", "Product Name", "Category", "Total Sold"]}
                        rows={reportData.topItems.map((item, i) => [
                            i + 1,
                            item.product_name,
                            item.category,
                            item.total_sold,
                        ])}
                        filename={`user-report-${periodLabel}.pdf`}
                    />
                )}
            </div>
        </div>
    );
}