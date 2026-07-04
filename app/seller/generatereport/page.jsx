'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/_lib/supabase';
import styles from './generatereport.module.css';

export default function SellerGenerateReport() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState({
        totalProducts: 0,
        totalOrders: 0,
        pendingOrders: 0,
        totalVouchers: 0,
        totalRevenue: '0.00',
        totalReviews: 0,
        topTrendingProducts: [],
        inventoryList: []
    });

    useEffect(() => {
        async function fetchTodayReport() {
            try {
                setLoading(true);

                const { data: { user }, error: authError } = await supabase.auth.getUser();
                if (authError || !user) {
                    alert('Session expired. Please log in again.');
                    router.push('/login');
                    return;
                }

                const startOfToday = new Date();
                startOfToday.setHours(0, 0, 0, 0);
                const endOfToday = new Date();
                endOfToday.setHours(23, 59, 59, 999);

                const startISO = startOfToday.toISOString();
                const endISO = endOfToday.toISOString();

                const { data: products, error: prodErr } = await supabase
                    .from('PRODUCTS_T')
                    .select(`
                        product_id,
                        product_name,
                        PRODUCT_VARIANTS_T (
                            product_variant_id,
                            sku,
                            product_variant_stock
                        )
                    `)
                    .eq('user_id', user.id); 

                if (prodErr) throw prodErr;

                let totalProductsCount = products?.length || 0;
                let inventoryStreams = [];

                products?.forEach(p => {
                    p.PRODUCT_VARIANTS_T?.forEach(v => {
                        inventoryStreams.push({
                            name: `${p.product_name} (${v.sku || 'Default'})`,
                            stock: v.product_variant_stock || 0
                        });
                    });
                });
                inventoryStreams.sort((a, b) => a.stock - b.stock);

                const { data: orders, error: orderErr } = await supabase
                    .from('ORDERS_T')
                    .select('order_id, order_status, created_at')
                    .gte('created_at', startISO)
                    .lte('created_at', endISO);

                if (orderErr) throw orderErr;

                const todayOrdersCount = orders?.length || 0;
                const todayPendingCount = orders?.filter(o => o.order_status === 'Ordered' || o.order_status === 'Pending').length || 0;

                let todayRevenueSum = 0;
                if (orders && orders.length > 0) {
                    const orderIds = orders.map(o => o.order_id);
                    const { data: transactions, error: transErr } = await supabase
                        .from('ORDER_TRANSACTIONS_T')
                        .select('amount, order_transaction_status')
                        .in('order_id', orderIds)
                        .eq('order_transaction_status', 'Success');

                    if (!transErr && transactions) {
                        todayRevenueSum = transactions.reduce((acc, curr) => acc + (curr.amount || 0), 0);
                    }
                }

                let trendingList = [];
                if (orders && orders.length > 0) {
                    const orderIds = orders.map(o => o.order_id);
                    const { data: items, error: itemsErr } = await supabase
                        .from('ORDER_ITEMS_T')
                        .select(`
                            quantity,
                            PRODUCT_VARIANTS_T (
                                PRODUCTS_T (product_name)
                            )
                        `)
                        .in('order_id', orderIds);

                    if (!itemsErr && items) {
                        const counts = {};
                        items.forEach(it => {
                            const pName = it.PRODUCT_VARIANTS_T?.PRODUCTS_T?.product_name || 'Unknown Product';
                            counts[pName] = (counts[pName] || 0) + (it.quantity || 0);
                        });
                        trendingList = Object.keys(counts).map(name => ({
                            name,
                            sold: counts[name]
                        })).sort((a, b) => b.sold - a.sold).slice(0, 5); 
                    }
                }

                const { count: reviewCount } = await supabase
                    .from('REVIEWS_T')
                    .select('*', { count: 'exact', head: true })
                    .gte('created_at', startISO)
                    .lte('created_at', endISO);

                const { count: voucherCount } = await supabase
                    .from('VOUCHERS_T')
                    .select('*', { count: 'exact', head: true });

                setReportData({
                    totalProducts: totalProductsCount,
                    totalOrders: todayOrdersCount,
                    pendingOrders: todayPendingCount,
                    totalVouchers: voucherCount || 0,
                    totalRevenue: todayRevenueSum.toFixed(2),
                    totalReviews: reviewCount || 0,
                    topTrendingProducts: trendingList,
                    inventoryList: inventoryStreams.slice(0, 8)
                });

            } catch (err) {
                console.error('Error fetching live data streams:', err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchTodayReport();
    }, [router]);

    if (loading) {
        return <div className={styles.loadingState}>Connecting to live database stream context...</div>;
    }

    return (
        <div className={styles.container}>
            <button className={styles.backLink} onClick={() => router.back()}>
                ← Back
            </button>

            <div className={styles.printActionHeader}>
                <button className={styles.printActionBtn} onClick={() => window.print()}>
                    Print Document / Save PDF
                </button>
            </div>

            <div className={styles.reportSheet}>
                <div className={styles.headerBlock}>
                    <img 
                        src="/logo.png" 
                        alt="Store Logo" 
                        className={styles.logoImage} 
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className={styles.companyMeta}>
                        <h1 className={styles.companyName}>JomBeli E-commerce</h1>
                        <p>45 Jalan Mawar, 50000 Kuala Lumpur, Malaysia</p>
                        <p>Tel: 012345678</p>
                        <p>Email: jombeli@gmail.com</p>
                    </div>
                </div>

                <p className={styles.summaryParagraph}>
                    This report provides an overview of your store's sales performance, revenue, orders, and customer engagement during the selected period.
                </p>

                <div className={styles.dataRow}>
                    <span className={styles.fieldLabel}>Total Products</span>
                    <span className={styles.fieldValue}>{reportData.totalProducts}</span>
                </div>

                <div className={styles.dataRow}>
                    <span className={styles.fieldLabel}>Total Orders</span>
                    <span className={styles.fieldValue}>{reportData.totalOrders}</span>
                </div>

                <div className={styles.dataRow}>
                    <span className={styles.fieldLabel}>Pending Orders</span>
                    <span className={styles.fieldValue}>{reportData.pendingOrders}</span>
                </div>

                <div className={styles.dataRow}>
                    <span className={styles.fieldLabel}>Total Vouchers</span>
                    <span className={styles.fieldValue}>{reportData.totalVouchers}</span>
                </div>

                <div className={styles.dataRow}>
                    <span className={styles.fieldLabel}>Total Revenue</span>
                    <span className={styles.fieldValue}>RM {reportData.totalRevenue}</span>
                </div>

                <div className={styles.dataRow}>
                    <span className={styles.fieldLabel}>Review</span>
                    <span className={styles.fieldValue}>{reportData.totalReviews}</span>
                </div>

                <div className={styles.dataBlockRow}>
                    <span className={styles.fieldLabel}>Top Trending Products</span>
                    <div className={styles.alignedStackList}>
                        {reportData.topTrendingProducts.length > 0 ? (
                            reportData.topTrendingProducts.map((item, idx) => (
                                <div key={idx} className={styles.stackItem}>
                                    {item.name} ({item.sold} sold)
                                </div>
                            ))
                        ) : (
                            <div className={styles.stackItem}>No sales recorded today</div>
                        )}
                    </div>
                </div>

                <div className={styles.dataBlockRow}>
                    <span className={styles.fieldLabel}>Inventory</span>
                    <div className={styles.alignedStackList}>
                        {reportData.inventoryList.length > 0 ? (
                            reportData.inventoryList.map((item, idx) => (
                                <div key={idx} className={styles.stackItem}>
                                    {item.name} <span className={styles.stockEmphasis}>{item.stock} left</span>
                                </div>
                            ))
                        ) : (
                            <div className={styles.stackItem}>No stock variants found</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}