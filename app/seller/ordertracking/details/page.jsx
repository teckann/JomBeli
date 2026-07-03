'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/app/_lib/supabase'; 


function OrderDetailsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get('order_id'); 

    const [hubs, setHubs] = useState([]); 
    const [selectedHub, setSelectedHub] = useState(''); 
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchHubs() {
            try {
                const { data, error } = await supabase
                    .from('HUBS_T')
                    .select('hub_id, hub_name, hub_location');
                
                if (error) throw error;
                setHubs(data || []);
            } catch (err) {
                console.error("Error fetching hubs:", err.message);
            }
        }
        if (orderId) fetchHubs();
    }, [orderId]);

    const handleHubChange = async (e) => {
        const hubId = e.target.value;
        setSelectedHub(hubId);
        if (!orderId || !hubId) return;

        try {
            setLoading(true);
            const { error } = await supabase
                .from('SHIPPING_T')
                .update({ hub_id: hubId })
                .eq('order_id', orderId);

            if (error) throw error;
            alert('Hub allocated successfully!');
        } catch (err) {
            console.error("Error updating shipping hub:", err.message);
            alert('Failed to update hub. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <button onClick={() => router.back()} style={{ marginBottom: '15px', cursor: 'pointer' }}>
                ← Back
            </button>

            <h1>NEW ORDER</h1>
            <p>Order ID : {orderId || 'Loading...'}</p>

            <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <h3>Order Details</h3>
                <hr />
                <div style={{ marginTop: '15px' }}>
                    <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Choose Hub: </label>
                    <select 
                        value={selectedHub} 
                        onChange={handleHubChange}
                        disabled={loading}
                        style={{ padding: '5px 10px', borderRadius: '4px' }}
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

        </div>
    );
}

export default function OrderDetailsPage() {
    return (
        <Suspense fallback={<div style={{ padding: '20px' }}>Loading order details...</div>}>
            <OrderDetailsContent />
        </Suspense>
    );
}