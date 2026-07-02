'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/_lib/supabase'; 
import styles from './SellerSalesOverview.module.css'; 
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SellerSalesOverview = ({ currentUserId }) => {
  const [last12MonthsTotal, setLast12MonthsTotal] = useState(0);
  const [monthlyItemsData, setMonthlyItemsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserId) return;

    const fetchSalesOverview = async () => {
      try {
        setLoading(true);

        const monthlyMap = {};
        const now = new Date();
        
        for (let i = 11; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const sortKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          const displayLabel = d.toLocaleString('default', { month: 'short', year: 'numeric' });
          
          monthlyMap[sortKey] = { label: displayLabel, itemCount: 0 };
        }

        const oneYearAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

        const { data: orders, error } = await supabase
          .from('ORDERS_T')
          .select('*') 
          .eq('seller_id', currentUserId)
          .eq('order_status', 'Active')
          .gte('created_at', oneYearAgo.toISOString()); 

        if (error) throw error;

        const dataList = orders || [];
        let grandTotalItems = 0;
        
        dataList.forEach((item) => {
          const qtyField = Object.keys(item).find(key => 
            key.toLowerCase().includes('quantity') || key.toLowerCase().includes('qty')
          );
          const itemQuantity = qtyField ? Number(item[qtyField] || 1) : 1;

          if (item.created_at) {
            const date = new Date(item.created_at);
            const sortKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (monthlyMap[sortKey]) {
              monthlyMap[sortKey].itemCount += itemQuantity;
              grandTotalItems += itemQuantity;
            }
          }
        });

        setLast12MonthsTotal(grandTotalItems);

        const sortedChartData = Object.keys(monthlyMap)
          .sort()
          .map((key) => ({
            month: monthlyMap[key].label,
            items: monthlyMap[key].itemCount
          }));

        setMonthlyItemsData(sortedChartData);
      } catch (error) {
        console.error('Error fetching 12-month items sold overview:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesOverview();
  }, [currentUserId]);

  return (
    <div className={styles.salesOverviewContainer}>
      
      <div className={styles.salesTextWrapper}>
        <p className={styles.salesLabel}>Sales Overview</p>
        <h2 className={styles.salesValue}>
          {loading ? '...' : `${last12MonthsTotal} pcs`}
        </h2>
        <span className={styles.salesSubtext}>Based on active orders</span>
      </div>

      <div className={styles.chartWrapper}>
        {loading ? (
          <p className={styles.chartLoadingText}>Loading 12-Month Chart...</p>
        ) : monthlyItemsData.length === 0 ? (
          <p className={styles.chartLoadingText}>No sales history found.</p>
        ) : (
          <OverviewTrendLineChart data={monthlyItemsData} />
        )}
      </div>

    </div>
  );
};

const OverviewTrendLineChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-primary)" />
        <XAxis 
          dataKey="month" 
          tick={{ fill: 'var(--color-font-secondary)', fontSize: 11 }} 
          axisLine={false}
          tickLine={false}
        />
        <YAxis 
          tick={{ fill: 'var(--color-font-secondary)', fontSize: 11 }} 
          tickFormatter={(value) => `${value} pcs`} 
          axisLine={false}
          tickLine={false}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'var(--color-bg-surface)', 
            borderColor: 'var(--color-border-primary)',
            borderRadius: '8px',
            color: 'var(--color-font-primary)'
          }}
          formatter={(value) => [`${value} pcs`, 'Items Sold']} 
        />
        <Line 
          type="monotone" 
          dataKey="items" 
          strokeWidth={3} 
          className={styles.trendLine}
          activeDot={{ r: 6, className: styles.trendActiveDot }} 
          dot={{ r: 3, className: styles.trendDot }} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SellerSalesOverview;