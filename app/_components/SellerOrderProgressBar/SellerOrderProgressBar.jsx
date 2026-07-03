'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/_lib/supabase';
import styles from './SellerOrderProgressBar.module.css';

export default function SellerOrders({ sellerId }) {
  const [activeStatus, setActiveStatus] = useState('ordered');
  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(true);

  const getHeaderTitle = () => {
    if (activeStatus === 'ordered') return 'New Order';
    if (activeStatus === 'packed') return 'Packed Order';
    return 'Shipped Order';
  };

  useEffect(() => {
  async function fetchFilteredOrders() {
    if (!sellerId) return; 

    try {
      setLoading(true);

      const { data: orders, error } = await supabase
        .from('ORDERS_T')
        .select('order_id, user_id, product_name, amount, created_at')
        .eq('seller_id', sellerId)
        .eq('order_status', activeStatus)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrdersList(orders || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  }

  fetchFilteredOrders();
}, [sellerId, activeStatus]);

  return (
    <div className={styles.container}>
      <section className={styles.stepperWrapper}>
        <div className={styles.progressLineTrack}>
          <div 
            className={styles.progressLineFill} 
            style={{ 
              width: activeStatus === 'ordered' ? '0%' : activeStatus === 'packed' ? '50%' : '100%' 
            }}
          ></div>
        </div>

        <div className={styles.stepsContainer}>
          <button 
            type="button"
            className={`${styles.stepNode} ${activeStatus === 'ordered' ? styles.activeNode : ''}`}
            onClick={() => setActiveStatus('ordered')}
          >
            <div className={styles.circle}></div>
            <span className={styles.stepLabel}>New Order</span>
          </button>

          <button 
            type="button"
            className={`${styles.stepNode} ${activeStatus === 'packed' ? styles.activeNode : ''}`}
            onClick={() => setActiveStatus('packed')}
          >
            <div className={styles.circle}></div>
            <span className={styles.stepLabel}>Packed Order</span>
          </button>

          <button 
            type="button"
            className={`${styles.stepNode} ${activeStatus === 'shipped' ? styles.activeNode : ''}`}
            onClick={() => setActiveStatus('shipped')}
          >
            <div className={styles.circle}></div>
            <span className={styles.stepLabel}>Shipped Order</span>
          </button>
        </div>
      </section>

      
     
    </div>
  );
}