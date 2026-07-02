'use client'; 

import React from 'react';
import SellerDashboardStatisticCard from "@/app/_components/SellerDashboardStatisticCard/SellerDashboardStatisticCard.jsx";
import SellerGenerateReportButton from '@/app/_components/SellerGenerateReportButton/SellerGenerateReportButton.jsx';
import styles from './dashboard.module.css';

const DashboardPage = () => {
  const statsData = [
    { id: 1, title: 'Total Products', value: 17 },
    { id: 2, title: 'Total Orders', value: 183 },
    { id: 3, title: 'Pending Orders', value: 5 },
    { id: 4, title: 'Total Vouchers', value: 10 },
  ];

  return (
    <div style={{ maxWidth: '1400px', marginTop: '30px', marginLeft: 'auto', marginRight: 'auto' }}>
      <main className={styles.main}>
        
        <div className={styles.topPartWrapper}>
          <div className={styles.topLeftColumn}>
            <h1 className={styles.productTitle}>DASHBOARD</h1>
          </div>
        </div>
        
        <hr className={styles.divider} />
        
        <div className={styles.buttonRightAligner}>
          <SellerGenerateReportButton />
        </div>
        
        <div className={styles.statisticCardsContainer}>
          {statsData.map((item) => (
            <SellerDashboardStatisticCard 
              key={item.id} 
              title={item.title} 
              value={item.value} 
            />
          ))}
        </div>

      </main>
    </div>
  );
};

export default DashboardPage;