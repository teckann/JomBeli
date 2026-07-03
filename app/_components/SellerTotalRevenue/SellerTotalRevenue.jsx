'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/_lib/supabase'; 
import styles from './SellerTotalRevenue.module.css'; 
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SellerRevenueSection = ({ currentUserId }) => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserId) return;

    const fetchRevenueData = async () => {
      try {
        setLoading(true);

        const { data: transactions, error } = await supabase
          .from('WALLET_TRANSACTIONS_T')
          .select('amount, created_at, transaction_type') 
          .eq('user_id', currentUserId)
          .eq('direction', 'Credit') 
          .eq('wallet_transaction_status', 'Success');

        if (error) throw error;

        const dataList = transactions || [];

        const calculatedRevenue = dataList.reduce((sum, item) => sum + Number(item.amount || 0), 0);
        setTotalRevenue(calculatedRevenue);

        const monthlyMap = {};
        
        dataList.forEach((item) => {
          const date = item.created_at ? new Date(item.created_at) : new Date();
          
          const sortKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          const displayLabel = date.toLocaleString('default', { month: 'short', year: 'numeric' });

          if (!monthlyMap[sortKey]) {
            monthlyMap[sortKey] = { label: displayLabel, amount: 0 };
          }
          monthlyMap[sortKey].amount += Number(item.amount || 0);
        });

        const sortedChartData = Object.keys(monthlyMap)
          .sort()
          .map((key) => ({
            month: monthlyMap[key].label,
            revenue: parseFloat(monthlyMap[key].amount.toFixed(2))
          }));

        setMonthlyRevenueData(sortedChartData);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, [currentUserId]);

  return (
    <div className={styles.revenueCardContainer}>
      
      <div className={styles.revenueTextWrapper}>
        <p className={styles.revenueLabel}>Total Revenue</p>
        <h2 className={styles.revenueValue}>
          {loading ? 'RM ...' : `RM${totalRevenue.toFixed(2)}`}
        </h2>
      </div>

      <div className={styles.chartWrapper}>
        {loading ? (
          <p className={styles.chartLoadingText}>Loading Chart...</p>
        ) : monthlyRevenueData.length === 0 ? (
          <p className={styles.chartLoadingText}>No credit transactions found.</p>
        ) : (
          <RevenueLineChart data={monthlyRevenueData} />
        )}
      </div>

    </div>
  );
};


const RevenueLineChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" />
        <XAxis dataKey="month" tick={{ fill: '#666', fontSize: 12 }} />
        <YAxis tick={{ fill: '#666', fontSize: 12 }} tickFormatter={(value) => `RM${value}`} />
        <Tooltip formatter={(value) => [`RM${value}`, 'Revenue']} />
        <Line 
          type="monotone" 
          dataKey="revenue" 
          stroke="#4f46e5" 
          strokeWidth={3} 
          activeDot={{ r: 8 }} 
          dot={{ strokeWidth: 2, r: 4 }} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SellerRevenueSection;