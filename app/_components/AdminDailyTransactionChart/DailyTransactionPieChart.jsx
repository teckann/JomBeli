'use client';

import { Pie } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend,Title);

export default function AdminDailyTransactionPieChart({ counts }) {
    const labels = Object.keys(counts);
    const values = Object.values(counts);

    const data = {
        labels,
        datasets: [
            {
                data: values,
                backgroundColor: [
                    "#df3b3c", // Top Up
                    "#e86364", // Payment
                    "#f5abab", // Refund
                    "#902D41", // Withdrawal
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "bottom" },
            title: { display: true, text: "Daily Transaction Types" },
        },
    };

    if (values.length === 0) {
        return <p>No transactions recorded today.</p>;
    }

    return <Pie data={data} options={options} />;
}