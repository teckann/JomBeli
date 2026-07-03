"use client"
import React from 'react';
import styles from './SellerOrderTrackingTable.module.css';
import { useRouter } from 'next/navigation';

export default function SellerOrderTrackingTable({ status, orders, onUpdateClick }) {
    const router = useRouter();
    const handleMoreClick = (orderId) => {
        router.push(`/seller/ordertracking/details?order_id=${orderId}`);
    };
    return (
        <section className={styles.orderTable}> 
            <div className={styles.status}>
                <h2>{status}</h2>
            </div>
            <table>
                <thead>
                    <tr className={styles.tableHeader}>
                        <th>Order ID</th>
                        <th>User ID</th>
                        <th>Product Name</th>
                        <th>Product Variant</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th style={{ textAlign: 'center' }}>Order Details</th>
                    </tr>
                </thead>
                <tbody className={styles.tableBody}>
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.userId}</td>
                                <td>{order.productName}</td>
                                <td>{order.variant}</td>
                                <td>{order.amount}</td>
                                <td>{order.date}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <button 
                                        className={styles.updateStatusButton}
                                        onClick={() => handleMoreClick(order.id)}
                                    >
                                        More
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>
                                No orders found for "{status}"
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </section>
    );
}