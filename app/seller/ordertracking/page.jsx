'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/app/_lib/supabase';
import SellerOrderTrackingTable from "@/app/_components/SellerOrderTrackingTable/SellerOrderTrackingTable";
import SellerOrders from "@/app/_components/SellerOrderProgressBar/SellerOrderProgressBar.jsx";
import styles from './ordertracking.module.css';

export default function OrderTrackingPage() { 
    const searchParams = useSearchParams();
    const [sellerId, setSellerId] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);


    const orderstatus_final = searchParams.get('status') ?? "New Order";

    const allOrders = [
        { id: 'O001', userId: 'U001', productName: 'Product A', variant: 'White * 128GB', amount: 2, date: '4-6-2026', status: 'New Order' },
        { id: 'O002', userId: 'U002', productName: 'Product B', variant: 'Black * 256GB', amount: 1, date: '4-6-2026', status: 'New Order' },
        { id: 'O003', userId: 'U003', productName: 'Product C', variant: 'Gold * 512GB', amount: 1, date: '4-6-2026', status: 'Packed by Seller' },
        { id: 'O004', userId: 'U004', productName: 'Product D', variant: 'Silver * 1TB', amount: 4, date: '4-6-2026', status: 'Completed' }
    ];

    useEffect(() => {
        async function getSellerSession() {
            try {
                setAuthLoading(true);
                const { data: { user }, error } = await supabase.auth.getUser();
                if (error) throw error;
                if (user) {
                    setSellerId(user.id);
                }
            } catch (err) {
                console.error("Authentication check failed:", err);
            } finally {
                setAuthLoading(false);
            }
        }
        getSellerSession();
    }, []);

    if (authLoading) {
        return <div className={styles.loading}>Verifying profile credentials...</div>;
    }

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <div className={styles.topPartWrapper}>
                    <div className={styles.topLeftColumn}>
                        <h1 className={styles.productTitle}>ORDERS</h1>
                    </div>
                </div>
                <hr className={styles.divider} />

                <SellerOrders sellerId={sellerId} />

                <div style={{ paddingTop: '24px' }}>
                    <SellerOrderTrackingTable 
                        status={orderstatus_final} 
                        orders={allOrders}
                    />
                </div>
            </main>
        </div>
    );
}