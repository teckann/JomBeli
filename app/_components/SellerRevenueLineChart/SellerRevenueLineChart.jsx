'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RevenueLineChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" />
        <XAxis dataKey="month" tick={{ fill: '#666', fontSize: 12 }} />
        <YAxis tick={{ fill: '#666', fontSize: 12 }} tickFormatter={(value) => `RM${value}`} />
        <Tooltip formatter={(value) => [`RM${value}`, 'Revenue']} />
        <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} activeDot={{ r: 8 }} dot={{ strokeWidth: 2, r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RevenueLineChart;