'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/app/_lib/supabase';
import styles from './details.module.css';

function OrderDetailsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get('order_id');

    const [orderInfo, setOrderInfo] = useState(null);
    const [transactionInfo, setTransactionInfo] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [hubs, setHubs] = useState([]);
    const [selectedHub, setSelectedHub] = useState('');
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        if (!orderId) {
            setErrorMessage("No Order ID provided in the URL.");
            setLoading(false);
            return;
        }

        async function initPageData() {
            try {
                setLoading(true);
                setErrorMessage(null);

                const { data: orderData, error: orderErr } = await supabase
                    .from('ORDERS_T')
                    .select('order_id, order_status')
                    .eq('order_id', orderId)
                    .maybeSingle();
                
                if (orderErr) throw orderErr;
                
                if (!orderData) {
                    setErrorMessage(`Order ID "${orderId}" was not found in the database. Please check your ORDERS_T table entries.`);
                    setLoading(false);
                    return;
                }
                setOrderInfo(orderData);

                const { data: transData, error: transErr } = await supabase
                    .from('ORDER_TRANSACTIONS_T')
                    .select('amount, order_transaction_status')
                    .eq('order_id', orderId)
                    .maybeSingle();

                if (transErr) throw transErr;
                setTransactionInfo(transData);

                const { data: hubsData } = await supabase
                    .from('HUBS_T')
                    .select('hub_id, hub_name, hub_location');
                setHubs(hubsData || []);

                const { data: itemsData, error: itemsErr } = await supabase
                    .from('ORDER_ITEMS_T')
                    .select(`
                        order_item_id,
                        product_variant_id,
                        quantity,
                        unit_price,
                        PRODUCT_VARIANTS_T (
                            sku,
                            product_variant_stock,
                            PRODUCTS_T (
                                product_name,
                                category,
                                product_image_url
                            )
                        )
                    `)
                    .eq('order_id', orderId);
                
                if (itemsErr) throw itemsErr;
                setOrderItems(itemsData || []);

                const { data: shippingData } = await supabase
                    .from('SHIPPING_T')
                    .select('hub_id')
                    .eq('order_id', orderId)
                    .maybeSingle();
                if (shippingData?.hub_id) {
                    setSelectedHub(shippingData.hub_id);
                }

            } catch (err) {
                console.error("Supabase Data Fetch Exception:", err.message);
                setErrorMessage(`Database Error: ${err.message}`);
            } finally {
                setLoading(false);
            }
        }

        initPageData();
    }, [orderId]);

    const handleHubChange = async (e) => {
        const hubId = e.target.value;
        setSelectedHub(hubId);
        if (!orderId || !hubId) return;

        try {
            setActionLoading(true);
            const { error } = await supabase
                .from('SHIPPING_T')
                .update({ hub_id: hubId })
                .eq('order_id', orderId);

            if (error) throw error;
        } catch (err) {
            console.error("Error setting hub:", err.message);
            alert("Database update failed for hub allocation.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleStatusTransition = async () => {
        if (!orderInfo) return;
        const currentStatus = orderInfo.order_status;

        if ((currentStatus === 'Ordered' || currentStatus === 'Pending' || currentStatus === 'Packed') && !selectedHub) {
            alert('Please select a logistics hub first before processing.');
            return;
        }

        try {
            setActionLoading(true);

            if (currentStatus === 'Ordered' || currentStatus === 'Pending') {
                for (const item of orderItems) {
                    const currentStock = item.PRODUCT_VARIANTS_T?.product_variant_stock || 0;
                    const buyQty = item.quantity || 0;
                    const finalStock = currentStock - buyQty;

                    if (finalStock < 0) {
                        alert(`Insufficient stock! Item SKU: [${item.PRODUCT_VARIANTS_T?.sku}] only has ${currentStock} units left.`);
                        setActionLoading(false);
                        return; 
                    }

                    const { error: stockError } = await supabase
                        .from('PRODUCT_VARIANTS_T')
                        .update({ product_variant_stock: finalStock })
                        .eq('product_variant_id', item.product_variant_id);

                    if (stockError) throw stockError;
                }

                const { error: statusErr } = await supabase
                    .from('ORDERS_T')
                    .update({ order_status: 'Packed' })
                    .eq('order_id', orderId);

                if (statusErr) throw statusErr;
                alert('Order packed successfully! Stocks have been updated.');

            } 
            else if (currentStatus === 'Packed') {
                const { error: statusErr } = await supabase
                    .from('ORDERS_T')
                    .update({ order_status: 'Shipped' })
                    .eq('order_id', orderId);

                if (statusErr) throw statusErr;
                alert('Order shipped successfully! Item is on its way.');
            }

            router.refresh();
            router.back();

        } catch (err) {
            console.error("Transaction Error:", err.message);
            alert("Error running status flow updates.");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div className={styles.container}>Synchronizing live database stream...</div>;

    if (errorMessage) {
        return (
            <div className={styles.container}>
                <button className={styles.backBtn} onClick={() => router.back()}>← Back</button>
                <div style={{ padding: '20px', border: '1px solid #ffcccb', backgroundColor: '#fff6f6', borderRadius: '8px', color: '#d8000c' }}>
                    <h3 style={{ margin: '0 0 10px 0' }}>Resource Not Found</h3>
                    <p>{errorMessage}</p>
                </div>
            </div>
        );
    }

    const getUIConfig = () => {
        const status = orderInfo?.order_status;
        if (status === 'Ordered' || status === 'Pending') {
            return { title: 'NEW ORDER', buttonText: 'Packed by Seller', disabled: false };
        } else if (status === 'Packed') {
            return { title: 'PACKED ORDER', buttonText: 'Shipped', disabled: false };
        } else if (status === 'Shipped' || status === 'Completed' || status === 'Success' || status === 'Succuess') {
            return { title: 'COMPLETED', buttonText: 'Completed', disabled: true };
        }
        return { title: 'ORDER DETAILS', buttonText: 'Processed', disabled: true };
    };

    const uiConfig = getUIConfig();

    const parseImgUrl = (imgJson) => {
        try {
            if (!imgJson) return '/placeholder.png';
            const parsed = typeof imgJson === 'string' ? JSON.parse(imgJson) : imgJson;
            return Array.isArray(parsed) ? parsed[0] : parsed;
        } catch {
            return '/placeholder.png';
        }
    };

    return (
        <div className={styles.container}>
            <button className={styles.backBtn} onClick={() => router.back()}>
                <span>←</span> Back
            </button>

            <h1 className={styles.pageTitle}>{uiConfig.title}</h1>
            <div className={styles.orderIdSub}>Order ID : {orderId}</div>

            <div className={styles.overviewCard}>
                <h3 className={styles.cardTitle}>Order Details</h3>
                
                <div className={styles.rowItem}>
                    <span className={styles.rowLabel}>Total Product</span>
                    <span className={styles.rowValue}>
                        {orderItems.reduce((acc, curr) => acc + curr.quantity, 0)} Items
                    </span>
                </div>
                
                <div className={styles.rowItem}>
                    <span className={styles.rowLabel}>Total Payment</span>
                    <span className={styles.rowValue}>
                        RM {transactionInfo?.amount !== undefined ? transactionInfo.amount : 'N/A'}
                    </span>
                </div>
                
                <div className={styles.rowItem}>
                    <span className={styles.rowLabel}>Choose Hub</span>
                    <select 
                        value={selectedHub} 
                        onChange={handleHubChange}
                        disabled={actionLoading || uiConfig.disabled}
                        className={styles.hubSelect}
                    >
                        <option value="">-- Select Hub --</option>
                        {hubs.map((hub) => (
                            <option key={hub.hub_id} value={hub.hub_id}>
                                {hub.hub_name} ({hub.hub_location})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className={styles.productsList}>
                {orderItems.map((item) => {
                    const variantDetails = item.PRODUCT_VARIANTS_T || {};
                    const productDetails = variantDetails.PRODUCTS_T || {};

                    return (
                        <div key={item.order_item_id} className={styles.productCard}>
                            <img 
                                src={parseImgUrl(productDetails.product_image_url)} 
                                alt="Ordered Product" 
                                className={styles.imagePlaceholder}
                                onError={(e) => { e.target.src = '/placeholder.png'; }}
                            />
                            <table className={styles.productSpecsTable}>
                                <tbody>
                                    <tr>
                                        <td className={styles.specLabel}>Category</td>
                                        <td className={styles.specValue}>{productDetails.category || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td className={styles.specLabel}>Product Name</td>
                                        <td className={styles.specValue}>{productDetails.product_name || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td className={styles.specLabel}>Option (SKU)</td>
                                        <td className={styles.specValue}>
                                            {variantDetails.sku || 'N/A'} <strong>(Qty: {item.quantity})</strong>
                                        </td>
                                    </tr>
                                    
                                </tbody>
                            </table>
                        </div>
                    );
                })}
            </div>

            <div className={styles.actionArea}>
                <button 
                    className={styles.packedBtn} 
                    onClick={handleStatusTransition}
                    disabled={actionLoading || uiConfig.disabled}
                >
                    {actionLoading ? 'Processing...' : uiConfig.buttonText}
                </button>
            </div>
        </div>
    );
}

export default function OrderDetailsPage() {
    return (
        <Suspense fallback={<div>Establishing secure data handshake...</div>}>
            <OrderDetailsContent />
        </Suspense>
    );
}