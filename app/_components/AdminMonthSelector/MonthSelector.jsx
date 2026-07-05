'use client'

import Styles from "./MonthSelector.module.css";
import { useRouter, useSearchParams } from 'next/navigation';

const MONTHS = [
    { label: "January", value: "01" }, 
    { label: "February", value: "02" },
    { label: "March", value: "03" }, 
    { label: "April", value: "04" },
    { label: "May", value: "05" },
    { label: "June", value: "06" },
    { label: "July", value: "07" }, 
    { label: "August", value: "08" },
    { label: "September", value: "09" }, 
    { label: "October", value: "10" },
    { label: "November", value: "11" }, 
    { label: "December", value: "12" },
];

export default function MonthSelector({ currentMonth, currentYear }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentYearNum = Number(currentYear);
    const yearOptions = Array.from({ length: 6 }, (_, i) => currentYearNum - 3 + i); // 3 years back, 2 forward

    const handleChange = (e) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(e.target.name, e.target.value);
        router.push(`?${params.toString()}`);
    };

    return (
        <div className={Styles.selectorRow}>
            <select name="month" value={currentMonth} onChange={handleChange} className={Styles.dropdown}>
                {MONTHS.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                ))}
            </select>

            <select name="year" value={currentYear} onChange={handleChange} className={Styles.dropdown}>
                {yearOptions.map((y) => (
                    <option key={y} value={y}>{y}</option>
                ))}
            </select>
        </div>
    );
}