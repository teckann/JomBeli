'use client';

import { useState, useEffect, useCallback } from 'react';
import Styles from '../../MonthlyYearly.module.css';
import { DownloadReportButton } from '@/app/_components/AdminGeneratePlatformReports/AdminGeneratePlatformReports';
import { formatDateTime } from "@/app/_lib/useful-func";
import BackButton from '@/app/_components/AdminBackButton/AdminBackButton';

const MONTHS = ["01","02","03","04","05","06","07","08","09","10","11","12"];

export default function MonthlyYearlyReportPage(){
    const [month, setMonth] = useState("06");    
    const [year, setYear] = useState(2026);    
    const [yearOnly, setYearOnly] = useState(false);    
    const [loading, setLoading] = useState(false);    
    const [reportData, setReportData] = useState(null);
    const [error, setError] = useState("");
    
    const fetchReport = useCallback(async () => {
        setLoading(true);
        setError("");
        setReportData(null);

        try{
            const params = new URLSearchParams({ year, yearOnly: String(yearOnly) });
            if (!yearOnly) params.set("month", month);

            const res = await fetch(`/api/adminReports/periodTransactions?${params}`);
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();

            if (data.length === 0) {
                setError("No transactions found for this period.");
                setLoading(false);
                return;
            }
            setReportData(data);
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

    const handleGenerate = async () => {
        setLoading(true);
        setError("");

        try{
            const params = new URLSearchParams({ year, yearOnly: String(yearOnly) })
            if (!yearOnly) params.set("month", month);

            const res = await fetch(`/api/adminReports/periodTransactions?${params}`);
            if(!res.ok) throw new Error("Failed to fetch")
            const data = await res.json();

                if (data.length === 0) {
                    setError("No transactions found for this period.");
                    setReportData(null);
                }else{
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

        const periodLabel = yearOnly ? `${year}` : `${month} ${year}`;

        return (
            <div className={Styles.formPage}>
                <BackButton/>
                <h1>Financial Report</h1>
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
                            columns={["#", "Transaction ID", "Transaction Type", "Amount", "User ID", "Created Time"]}
                            rows={reportData.map((row, i) => [
                                i + 1,
                                row.wallet_transaction_id,
                                row.direction,
                                `RM${Number(row.amount || 0).toFixed(2)}`,
                                row.user_id,
                                formatDateTime(row.created_at),
                            ])}
                            filename={`financial-report-${periodLabel}.pdf`}
                        />
                    )}
                </div>
            </div>
    );
}