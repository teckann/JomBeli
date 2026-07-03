'use client';

import React from 'react';
import styles from './SellerOrderProgressBar.module.css';

export default function SellerOrders({ activeStatus, onStatusChange }) {
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
            onClick={() => onStatusChange('ordered')}
          >
            <div className={styles.circle}></div>
            <span className={styles.stepLabel}>New Order</span>
          </button>

          <button 
            type="button"
            className={`${styles.stepNode} ${activeStatus === 'packed' ? styles.activeNode : ''}`}
            onClick={() => onStatusChange('packed')}
          >
            <div className={styles.circle}></div>
            <span className={styles.stepLabel}>Packed Order</span>
          </button>

          <button 
            type="button"
            className={`${styles.stepNode} ${activeStatus === 'shipped' ? styles.activeNode : ''}`}
            onClick={() => onStatusChange('shipped')}
          >
            <div className={styles.circle}></div>
            <span className={styles.stepLabel}>Shipped Order</span>
          </button>
        </div>
      </section>
    </div>
  );
}