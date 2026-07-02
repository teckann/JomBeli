'use client'; 

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/_lib/supabase'; 
import SellerDashboardStatisticCard from "@/app/_components/SellerDashboardStatisticCard/SellerDashboardStatisticCard.jsx";
import SellerGenerateReportButton from '@/app/_components/SellerGenerateReportButton/SellerGenerateReportButton.jsx';
import styles from './dashboard.module.css';
import SellerRevenueSection from '@/app/_components/SellerTotalRevenue/SellerTotalRevenue.jsx';
import SellerSalesOverview from '@/app/_components/SellerSalesOverview/SellerSalesOverview';

const DashboardPage = () => {
  const [sellerId, setSellerId] = useState(null); 
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0); 
  const [pendingOrders, setPendingOrders] = useState(0);
  const [totalVouchers, setTotalVouchers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const { data: { session }, error: authError } = await supabase.auth.getSession();
        if (authError) throw authError;

        if (session?.user) {
          const currentUserId = session.user.id; 
          setSellerId(currentUserId); 

          const [productsResult, pendingOrdersResult, totalOrdersResult, vouchersResult] = await Promise.all([
            supabase
              .from('PRODUCTS_T')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', currentUserId),

            supabase
              .from('ORDERS_T') 
              .select('*', { count: 'exact', head: true })
              .eq('seller_id', currentUserId) 
              .eq('order_status', 'ordered'),

            supabase
              .from('ORDERS_T')
              .select('*', { count: 'exact', head: true })
              .eq('seller_id', currentUserId),

            supabase
              .from('VOUCHERS_T') 
              .select('*', { count: 'exact', head: true })
              .eq('user_id', currentUserId)
          ]);

          if (productsResult.error) throw productsResult.error;
          if (pendingOrdersResult.error) throw pendingOrdersResult.error;
          if (totalOrdersResult.error) throw totalOrdersResult.error;
          if (vouchersResult.error) throw vouchersResult.error;

          setTotalProducts(productsResult.count || 0);
          setPendingOrders(pendingOrdersResult.count || 0);
          setTotalOrders(totalOrdersResult.count || 0); 
          setTotalVouchers(vouchersResult.count || 0); 
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statsData = [
    { id: 1, title: 'Total Products', value: loading ? '...' : totalProducts },
    { id: 2, title: 'Total Orders', value: loading ? '...' : totalOrders }, 
    { id: 3, title: 'Pending Orders', value: loading ? '...' : pendingOrders }, 
    { id: 4, title: 'Total Vouchers', value: loading ? '...' : totalVouchers }, 
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
        
        <div className={styles.space}></div>
        <SellerRevenueSection currentUserId={sellerId} />
        <div className={styles.space}></div>

        <SellerSalesOverview currentUserId={sellerId}/>
        <div className={styles.space}></div>

       


      </main>
    </div>
  );
};

export default DashboardPage;