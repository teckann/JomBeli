'use client';

import { useState } from 'react';
import Styles from './AdminGenerateUserReport.module.css';
import { DownloadReportButton } from '@/app/_components/AdminGeneratePlatformReports/AdminGeneratePlatformReports';

const MONTHS = ["01","02","03","04","05","06","07","08","09","10","11","12"];
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function GenerateUserReport() {
    const [expand, setExpand] = useState(false);
    const handleClick = () => setExpand(!expand);

    return (
        <div>
            {!expand
                ? <UserReportButton handleClick={handleClick} />
                : <ExpandedUserReport handleClick={handleClick} />
            }
        </div>
    );
}

export function UserReportButton({ handleClick }) {
    return (
        <button className="btn btn-primary" onClick={handleClick}>
            Generate User Report
        </button>
    );
}

export function ExpandedUserReport({ handleClick }) {
    const [month, setMonth] = useState("06");
    const [year, setYear] = useState(2026);
    const [yearOnly, setYearOnly] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState(null);
    const [error, setError] = useState("");

    const handleGenerate = async () => {
        setLoading(true);
        setError("");
        setReportData(null);

        try {
            const params = new URLSearchParams({ year, yearOnly: String(yearOnly) });
            if (!yearOnly) params.set("month", month);

            const res = await fetch(`/api/adminReports/periodUsers?${params}`);
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();

            if (!data.topItems || (data.totalNewUsers === 0 && data.topItems.length === 0)) {
                setError("No data found for this period.");
            } else {
                setReportData(data);
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong generating the report.");
        } finally {
            setLoading(false);
        }
    };

    const periodLabel = yearOnly ? `${year}` : `${MONTH_NAMES[Number(month) - 1]} ${year}`;
    const CURRENT_YEAR = new Date().getFullYear();
    const START_YEAR = 2024; 
    const AVAILABLE_YEARS = Array.from(
        { length: CURRENT_YEAR - START_YEAR + 1 },
        (_, i) => START_YEAR + i
    );

    return (
        <div className={Styles.complete}>
            <div>
                <h4 className={Styles.reportText}>User Report Generate Form</h4>
            </div>
            <div className={Styles.inputsContainer}>
                <button className={`${Styles.backButton} btn btn-primary`} onClick={handleClick}>
                    Cancel
                </button>

                <div className={Styles.eachInputs}>
                    <label htmlFor="reportMonthSelect">Month:</label>
                    <select
                        className={Styles.selectBox}
                        id="reportMonthSelect"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        disabled={yearOnly}
                    >
                        {MONTHS.map((m, i) => <option key={m} value={m}>{MONTH_NAMES[i]}</option>)}
                    </select>
                </div>

                <div className={Styles.eachInputs}>
                    <label htmlFor="reportYearSelect">Year:</label>
                    <select
                        className={Styles.selectBox}
                        id="reportYearSelect"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                    >
                        {AVAILABLE_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>

                <label className={Styles.eachInputs}>
                    <input type="checkbox" checked={yearOnly} onChange={(e) => setYearOnly(e.target.checked)} />
                    Year only?
                </label>

                

                
            </div>
            <button
                    className={`${Styles.generateButton} btn btn-primary`}
                    onClick={handleGenerate}
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Generate User Report"}
                </button>

                {error && <div className={Styles.errorText}>{error}</div>}
                
            {reportData && (
                    <DownloadReportButton
                        companyName="JomBeli Company"
                        reportTitle="Platform User Report"
                        reportSubtitle={`Report for ${periodLabel}`}
                        summaryItems={[
                            { label: "Total New Users", value: reportData.totalNewUsers },
                            { label: "Total Reported Sellers", value: reportData.totalReportedSellers },
                            { label: "Total Approved Refunds", value: reportData.totalApprovedRefunds },
                        ]}
                        tableTitle="Top Selling Products"
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
    );
}