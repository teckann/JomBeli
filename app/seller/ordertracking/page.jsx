'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/app/_lib/supabase';
import SellerOrderTrackingTable from "@/app/_components/SellerOrderTrackingTable/SellerOrderTrackingTable";
import SellerOrders from "@/app/_components/SellerOrderProgressBar/SellerOrderProgressBar.jsx";
import styles from './ordertracking.module.css';

export default function OrderTrackingPage() { 
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const [sellerId, setSellerId] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [ordersList, setOrdersList] = useState([]);
    const [tableLoading, setTableLoading] = useState(true);

    const activeStatus = searchParams.get('status') ?? "ordered";

    const getDisplayStatus = (status) => {
        if (status === 'ordered') return 'New Order';
        if (status === 'packed') return 'Packed Order';
        return 'Shipped Order';
    };

    useEffect(() => {
        async function getSellerSession() {
            try {
                setAuthLoading(true);
                const { data: { user }, error } = await supabase.auth.getUser();
                if (error) throw error;
                if (user) setSellerId(user.id);
            } catch (err) {
                console.error("Authentication check failed:", err);
            } finally {
                setAuthLoading(false);
            }
        }
        getSellerSession();
    }, []);

   useEffect(() => {
        async function fetchFilteredOrders() {
            if (!sellerId) return; 

            try {
                setTableLoading(true);
                
                const dbStatus = activeStatus === 'ordered' ? 'Ordered' 
                               : activeStatus === 'packed' ? 'Packed' 
                               : 'Shipped';

                const { data: orders, error } = await supabase
                    .from('ORDERS_T')
                    .select(`
                        order_id, 
                        buyer_id, 
                        order_status, 
                        created_at,
                        ORDER_ITEMS_T (
                            quantity,
                            PRODUCT_VARIANTS_T (
                                sku,
                                PRODUCTS_T (
                                    product_name
                                )
                            )
                        )
                    `) 
                    .eq('seller_id', sellerId) 
                    .eq('order_status', dbStatus)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                const formattedOrders = (orders || []).map(order => {
                    const firstItem = order.ORDER_ITEMS_T?.[0];
                    const variantData = firstItem?.PRODUCT_VARIANTS_T;
                    const productData = variantData?.PRODUCTS_T;

                    return {
                        id: order.order_id,
                        userId: order.buyer_id, 
                        productName: productData?.product_name || 'Unknown Product', 
                        variant: variantData?.sku || 'Standard', 
                        amount: firstItem?.quantity || 0, 
                        date: new Date(order.created_at).toLocaleDateString('en-GB'), // DD-MM-YYYY
                        status: getDisplayStatus(order.order_status)
                    };
                });

                setOrdersList(formattedOrders);
            } catch (err) {
                console.error("Error fetching live table orders:", err);
            } finally {
                setTableLoading(false);
            }
        }

        fetchFilteredOrders();
    }, [sellerId, activeStatus]);

    const handleStatusChange = (newStatus) => {
        router.push(`/seller/ordertracking?status=${newStatus}`);
    };

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

                <SellerOrders 
                    activeStatus={activeStatus} 
                    onStatusChange={handleStatusChange} 
                />

                <div style={{ paddingTop: '24px' }}>
                    {tableLoading ? (
                        <div className={styles.loading}>Updating order list...</div>
                    ) : (
                        <SellerOrderTrackingTable 
                            status={getDisplayStatus(activeStatus)} 
                            orders={ordersList}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}