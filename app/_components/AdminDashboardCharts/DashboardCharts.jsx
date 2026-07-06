'use client';

import { Bar } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement);

export function AdminOrderStatusChart({ counts }) {
    const labels = Object.keys(counts);
    const values = Object.values(counts);

    if (values.length === 0) {
        return <p>No orders recorded today.</p>;
    }

    const data = {
        labels,
        datasets: [{
            label: "Orders",
            data: values,
            backgroundColor: "#df3b3c",
        }],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: "Order Status Distribution (Today)" },
        },
        scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 } },
        },
    };

    return <Bar data={data} options={options} />;
}

export function AdminTopSellingProductsChart({ products }) {
    if (products.length === 0) {
        return <p>No sales data available.</p>;
    }

    const data = {
        labels: products.map(p => p.product_name),
        datasets: [{
            label: "Quantity Sold",
            data: products.map(p => p.total_sold),
            backgroundColor: "#902D41",
        }],
    };

    const options = {
        indexAxis: 'y', // horizontal bars — reads better with product names
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: "Platform Top Selling Products" },
        },
        scales: {
            x: { beginAtZero: true, ticks: { stepSize: 2 } },
            y: { 
                ticks: {
                    autoSkip: false,
                    crossAlign: 'far'
                },
            },
        },
    };

    return <Bar data={data} options={options} />;
}

export function AdminOrderTrendChart({ trendData }) {
    const data = {
        labels: trendData.map(d => d.date.substring(5)), // MM-DD
        datasets: [{
            label: "Orders",
            data: trendData.map(d => d.count),
            borderColor: "#df3b3c",
            backgroundColor: "#f5abab",
            tension: 0.3,
        }],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: true, text: "Order Trend (Last 30 Days)" },
        },
        scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 } },
        },
    };

    return <Line data={data} options={options} />;
}