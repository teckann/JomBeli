import React from 'react'
import SellerOrderTrackingTable from "@/app/_components/SellerOrderTrackingTable/SellerOrderTrackingTable";

export default async function OrderTrackingPage ({ searchParams }) { 

    
    const orderstatus_URL = await searchParams;


    // like PHP ternary operator
    const orderstatus_final = orderstatus_URL?.status ?? "New Order";

    // demo data oni
    const allOrders = [
        { id: 'O001', userId: 'U001', productName: 'Product A', variant: 'White * 128GB', amount: 2, date: '4-6-2026', status: 'New Order' },
        { id: 'O002', userId: 'U002', productName: 'Product B', variant: 'Black * 256GB', amount: 1, date: '4-6-2026', status: 'New Order' },
        { id: 'O003', userId: 'U003', productName: 'Product C', variant: 'Gold * 512GB', amount: 1, date: '4-6-2026', status: 'Packed by Seller' },
        { id: 'O004', userId: 'U004', productName: 'Product D', variant: 'Silver * 1TB', amount: 4, date: '4-6-2026', status: 'Completed' }
    ];


    return (
        <div style={{ padding: '20px' }}>
            <SellerOrderTrackingTable 
                status={orderstatus_final} 
                orders={allOrders}
            />
        </div>
    );
}