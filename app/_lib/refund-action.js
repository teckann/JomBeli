"use server";

import { createClient } from "./server";
import { revalidatePath } from "next/cache";



import { IDGenerator } from "@/app/_lib/random-id-generator"; 
import { setBalances } from "@/app/_lib/data-services"; 

export async function RefundAction(formData) {
    const refundId = formData.get("refund_id");
    const sellerRemarks = formData.get("seller_remarks");
    const decision = formData.get("action"); 

    const supabase = await createClient();

    
    const { data: refundData, error: refundError } = await supabase
        .from("REFUNDS_T")
        .update({
            seller_status: decision,
            seller_remarks: sellerRemarks
        })
        .eq("refund_id", refundId)
        .select("order_id")
        .single();

    if (refundError) {
        console.error("Refund update error:", refundError);
        throw new Error("Failed to update refund status.");
    }

    
    if (decision === "approved" && refundData) {
        const orderId = refundData.order_id;

        
        const { data: orderData, error: orderError } = await supabase
            .from("ORDERS_T")
            .select("buyer_id, total_amount")
            .eq("order_id", orderId)
            .single();

        if (orderError) throw new Error("Failed to fetch order details.");

        
        const { error: updateOrderError } = await supabase
            .from("ORDERS_T")
            .update({ order_status: "Refunded" })
            .eq("order_id", orderId);

        if (updateOrderError) throw new Error("Failed to update order status.");

        
        const wallet_transaction_id = await IDGenerator();
        
        const { error: walletError } = await supabase
            .from("WALLET_TRANSACTIONS_T")
            .insert([
                {
                    wallet_transaction_id: wallet_transaction_id,
                    user_id: orderData.buyer_id,
                    transaction_type: `Refund for order: #${orderId}`,
                    direction: "Credit",
                    payment_method: "Wallet Balance",
                    amount: orderData.total_amount,
                    wallet_transaction_status: "Success"
                }
            ]);

        if (walletError) throw new Error("Failed to create wallet transaction.");

        
        await setBalances(orderData.buyer_id, orderData.total_amount);
    }

    
    revalidatePath(`/seller/refunds/${refundId}`);
}