import { createClient } from "./server";

export async function getShippingCountByHub(hubId) {
    const supabase = await createClient();
    const { count, error } = await supabase
        .from("SHIPPING_T")
        .select("*", { count: "exact", head: true })
        .eq("hub_id", hubId)
        .neq("shipping_status", "Completed")
    if (error) {
        throw new Error(`Failed to retrieve shipping count: ${error.message}`);
    }

    return count ?? 0;
}

export async function getAssignedOrderCount(courierId) {
    const supabase = await createClient();
    const { count, error } = await supabase
        .from("SHIPPING_T")
        .select("*", { count: "exact", head: true })
        .eq("courier_id", courierId)
        .eq("shipping_status", "Assigned");

    if (error) {
        throw new Error(`Failed to retrieve assigned order count: ${error.message}`);
    }

    return count ?? 0;
}

export async function getTodayCompletedCount(courierId) {
    const supabase = await createClient();
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const { count, error } = await supabase
        .from("SHIPPING_T")
        .select("*", { count: "exact", head: true })
        .eq("courier_id", courierId)
        .eq("shipping_status", "Completed")
        .gte("shipped_at", start.toISOString())
        .lt("shipped_at", end.toISOString());

    if (error) {
        throw new Error(
            `Failed to retrieve today's completed deliveries: ${error.message}`
        );
    }

    return count ?? 0;
}

export async function getCurrentTasks(courierId) {

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("SHIPPING_T")
        .select(`
      shipping_id,
      order_id,
      shipping_status,
      delivery_type,
      delivery_fee,
      created_at,
      ORDERS_T (
        total_amount,
        order_status,
        ADDRESSES_T (
          recipient_name,
          recipient_contact_number,
          street,
          city,
          state,
          postcode,
          lat,
          lng
        ),
        USERS_T!ORDERS_T_buyer_id_fkey (
          username
        )
      )
    `)
        .eq("courier_id", courierId)
        .eq("shipping_status", "Assigned")
        .order("created_at", { ascending: true });

    if (error) {
        throw new Error(`Failed to retrieve current tasks: ${error.message}`);
    }

    return data ?? [];
}

export async function getCourierCount(hubId) {
    const supabase = await createClient();

    const { count, error } = await supabase
        .from("USERS_T")
        .select("*", { count: "exact", head: true })
        .eq("hub_id", hubId)
        .eq("available_status", true);

    if (error) {
        throw new Error(`Failed to retrieve active courier count: ${error.message}`);
    }

    return count ?? 0;
}