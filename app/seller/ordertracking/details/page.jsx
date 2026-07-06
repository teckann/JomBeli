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
                    setErrorMessage(`Order ID "${orderId}" was not found.`);
                    setLoading(false);
                    return;
                }
                setOrderInfo(orderData);

                const { data: transData } = await supabase
                    .from('ORDER_TRANSACTIONS_T')
                    .select('amount')
                    .eq('order_id', orderId)
                    .maybeSingle();
                setTransactionInfo(transData);

                const { data: hubsData } = await supabase
                    .from('HUBS_T')
                    .select('hub_id, hub_name, hub_location');
                setHubs(hubsData || []);

                const { data: itemsData } = await supabase
                    .from('ORDER_ITEMS_T')
                    .select(`
                        order_item_id, product_variant_id, quantity, unit_price,
                        PRODUCT_VARIANTS_T (
                            sku, product_variant_stock,
                            PRODUCTS_T ( product_name, category, product_image_url )
                        )
                    `)
                    .eq('order_id', orderId);
                setOrderItems(itemsData || []);

                const { data: shippingRows } = await supabase
                    .from('SHIPPING_T')
                    .select('hub_id')
                    .eq('order_id', orderId)
                    .order('shipping_id', { ascending: false });
                
                if (shippingRows && shippingRows.length > 0) {
                    const targetedRow = shippingRows.find(row => row.hub_id) || shippingRows[0];
                    if (targetedRow && targetedRow.hub_id) {
                        setSelectedHub(targetedRow.hub_id);
                    }
                }

            } catch (err) {
                console.error("Fetch Error:", err.message);
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

        if (currentStatus === 'Packed By Seller' && !selectedHub) {
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
                        alert(`Insufficient stock for SKU: [${item.PRODUCT_VARIANTS_T?.sku}].`);
                        setActionLoading(false);
                        return; 
                    }

                    await supabase
                        .from('PRODUCT_VARIANTS_T')
                        .update({ product_variant_stock: finalStock })
                        .eq('product_variant_id', item.product_variant_id);
                }

                await supabase
                    .from('ORDERS_T')
                    .update({ order_status: 'Packed By Seller' })
                    .eq('order_id', orderId);

                alert('Order packed successfully!');
            } 
            else if (currentStatus === 'Packed By Seller') {
                await supabase
                    .from('ORDERS_T')
                    .update({ order_status: 'Shipped' })
                    .eq('order_id', orderId);

                alert('Order shipped successfully!');
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
                    <p>{errorMessage}</p>
                </div>
            </div>
        );
    }

    const getUIConfig = () => {
        const status = orderInfo?.order_status;
        if (status === 'Ordered' || status === 'Pending') {
            return { title: 'NEW ORDER', buttonText: 'Packed By Seller', showButton: true, hubView: 'hide' };
        } else if (status === 'Packed' || status === 'Packed By Seller') { 
            return { title: 'PACKED ORDER', buttonText: 'Shipped', showButton: true, hubView: 'select' };
        } else if (status === 'Shipped' || status === 'Completed' || status === 'Success' || status === 'Succuess') {
            return { title: 'COMPLETED', buttonText: '', showButton: false, hubView: 'text' };
        }
        return { title: 'ORDER DETAILS', buttonText: '', showButton: false, hubView: 'text' };
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

    const assignedHubDetails = hubs.find(h => String(h.hub_id) === String(selectedHub));

    return (
        <div className={styles.container}>
            <button className={styles.backBtn} onClick={() => router.back()}>← Back</button>

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
                
                {uiConfig.hubView === 'select' && (
                    <div className={styles.rowItem}>
                        <span className={styles.rowLabel}>Choose Hub</span>
                        <select 
                            value={selectedHub} 
                            onChange={handleHubChange}
                            disabled={actionLoading}
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
                )}

                {uiConfig.hubView === 'text' && (
                    <div className={styles.rowItem}>
                        <span className={styles.rowLabel}>Allocated Hub</span>
                        <span className={styles.rowValue} style={{ fontWeight: '600', color: '#333' }}>
                            {assignedHubDetails 
                                ? `${assignedHubDetails.hub_name} (${assignedHubDetails.hub_location})` 
                                : 'No hub was selected'}
                        </span>
                    </div>
                )}
            </div>

            <div className={styles.productsList}>
                {orderItems.map((item) => {
                    const variantDetails = item.PRODUCT_VARIANTS_T || {};
                    const productDetails = variantDetails.PRODUCTS_T || {};

                    return (
                        <div key={item.order_item_id} className={styles.productCard}>
                            <img 
                                src={parseImgUrl(productDetails.product_image_url)} 
                                alt="Product" 
                                className={styles.imagePlaceholder}
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

            {uiConfig.showButton && (
                <div className={styles.actionArea}>
                    <button 
                        className={styles.packedBtn} 
                        onClick={handleStatusTransition}
                        disabled={actionLoading}
                    >
                        {actionLoading ? 'Processing...' : uiConfig.buttonText}
                    </button>
                </div>
            )}
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