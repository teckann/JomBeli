// app/_components/AdminGenerateFinancialReport/AdminGenerateFinancialReport.jsx
'use client';
import { useState } from 'react';
import Styles from './AdminGenerateFinancialReport.module.css';
import { DownloadReportButton } from '@/app/_components/AdminGeneratePlatformReports/AdminGeneratePlatformReports';
import { formatDateTime } from '@/app/_lib/useful-func';

const MONTHS = ["01","02","03","04","05","06","07","08","09","10","11","12"];
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function GenerateFinancialReport() {
    const [expand, setExpand] = useState(false);
    const handleClick = () => setExpand(!expand);

    return (
        <div>
            {!expand
                ? <FinancialReportButton handleClick={handleClick} />
                : <ExpandedFinancialReport handleClick={handleClick} />
            }
        </div>
    );
}

export function FinancialReportButton({ handleClick }) {
    return (
        <button className="btn btn-primary" onClick={handleClick}>
            Generate Financial Report
        </button>
    );
}

export function ExpandedFinancialReport({ handleClick }) {
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

            const res = await fetch(`/api/adminReports/periodTransactions?${params}`);
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();

            if (data.length === 0) {
                setError("No transactions found for this period.");
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

    const totalCredit = reportData?.filter(t => t.direction === "Credit").reduce((sum, t) => sum + Number(t.amount || 0), 0) ?? 0;
    const totalDebit = reportData?.filter(t => t.direction === "Debit").reduce((sum, t) => sum + Number(t.amount || 0), 0) ?? 0;
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
                <h4 className={Styles.reportText}>Financial Report Generate Form</h4>
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
                    {loading ? "Loading..." : "Generate Financial Report"}
                </button>

                {error && <div className={Styles.errorText}>{error}</div>}

                {reportData && (
                    <DownloadReportButton
                        companyName="JomBeli Company"
                        reportTitle="Platform Financial Report"
                        reportSubtitle={`Report for ${periodLabel}`}
                        summaryItems={[
                            { label: "Total Credit", value: `RM${totalCredit.toFixed(2)}` },
                            { label: "Total Debit", value: `RM${totalDebit.toFixed(2)}` },
                            { label: "Total Transactions Made", value: reportData.length },
                        ]}
                        tableTitle="Transactions"
                        columns={["#", "Transaction ID", "Transaction Type", "Amount", "Username", "Created Time"]}
                        rows={reportData.map((row, i) => [
                            i + 1,
                            row.wallet_transaction_id,
                            row.direction,
                            `RM${Number(row.amount || 0).toFixed(2)}`,
                            row.USERS_T?.username ?? row.user_id,
                            formatDateTime(row.created_at),
                        ])}
                        filename={`financial-report-${periodLabel}.pdf`}
                    />
                )}
        </div>
    );
}