import { supabase } from '@/app/_lib/supabase';

export async function fetchCourierStops() {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("User not authenticated.");

  const { data: orders, error: dbError } = await supabase
    .from('SHIPPING_T')
    .select(`
      order_id,
      courier_id,
      ORDERS_T (
        ADDRESSES_T (
          recipient_name,
          recipient_contact_number,
          street,
          city,
          state,
          postcode,
          lat,
          lng
        )
      )
    `)
    .eq('courier_id', user.id)
    .eq('shipping_status', 'Assigned');

  if (dbError) throw dbError;
  if (!orders?.length) throw new Error("No active orders found.");

  const stops = orders.map(order => {
    const addr = order.ORDERS_T.ADDRESSES_T;
    return {
      orderId: order.order_id,
      lat: addr?.lat ? parseFloat(addr.lat) : null,
      lng: addr?.lng ? parseFloat(addr.lng) : null,
      label: addr ? `${addr.street}, ${addr.city}, ${addr.postcode}` : "Unknown Address",
      recipient_name: addr?.recipient_name ? addr.recipient_name : null,
      recipient_contact: addr?.recipient_contact_number ? addr.recipient_contact_number : null,
    };
  });

  if (stops.some(s => s.lat === null || s.lng === null)) {
    throw new Error("Some orders lack coordinates.");
  }

  return stops;
}

export async function markOrderDelivered(orderId) {
  const { error: orderError } = await supabase
    .from('ORDERS_T')
    .update({ order_status: 'Delivered' })
    .eq('order_id', orderId);

  if (orderError) throw new Error(`Failed to update order ${orderId}: ${orderError.message}`);

  const { error: shippingError } = await supabase
    .from('SHIPPING_T')
    .update({ 
      shipping_status: 'Completed',
      shipped_at: new Date().toISOString(),
     })
    .eq('order_id', orderId);

  if (shippingError) throw new Error(`Failed to update shipping for order ${orderId}: ${shippingError.message}`)
}