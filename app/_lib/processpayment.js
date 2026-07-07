import { createClient } from "./server";
import { GeneralIDGenerator, IDGenerator} from "./random-id-generator";

export async function processPayment({
  buyerId,
  sellerId,
  addressId,
  deliveryOption, //express, standard
  deliveryFee, //shipping fee
  originalPrice,
  discountAmount,
  totalAmount,
  userVoucherId = null,
  items,
}) {
  const supabase = await createClient();

  //Check buyer balance 
  const { data: buyer, error: buyerError } = await supabase
    .from("USERS_T")
    .select("balances")
    .eq("user_id", buyerId)
    .single();

  if (buyerError) {
    console.error("Failed to fetch buyer balance:", buyerError);
    throw new Error("Could not verify buyer balance");
  }

  if (buyer.balances < totalAmount) {
    throw new Error("Insufficient wallet balance");
  }

  //Check stock availability
  const variantIds = items.map((item) => item.product_variant_id);

  const { data: variants, error: variantsError } = await supabase
    .from("PRODUCT_VARIANTS_T")
    .select("product_variant_id, product_variant_stock")
    .in("product_variant_id", variantIds);

  if (variantsError) {
    console.error("Failed to fetch variants:", variantsError);
    throw new Error("Could not verify product stock");
  }

  const stockMap = Object.fromEntries(
    variants.map((v) => [v.product_variant_id, v.product_variant_stock])
  );

  for (const item of items) {
    const availableStock = stockMap[item.product_variant_id] ?? 0;
    if (availableStock < item.quantity) {
      throw new Error(
        `Insufficient stock for variant ${item.product_variant_id} — available: ${availableStock}, requested: ${item.quantity}`
      );
    }
  }

  //Create the order
  const generatedOrderId = GeneralIDGenerator()
  const { error: orderError } = await supabase.from("ORDERS_T").insert({
    order_id: generatedOrderId,
    buyer_id: buyerId,
    seller_id: sellerId,
    address_id: addressId,
    user_voucher_id: userVoucherId,
    original_price: originalPrice,
    discount_amount: discountAmount,
    total_amount: totalAmount,
    payment_status: "Paid",
    order_status: "Ordered",
  });

  if (orderError) {
    console.error("Failed to create order:", orderError);
    throw new Error(`Could not create order: ${orderError.message}`);
  }

  //Insert order items
  const orderItems = items.map((item) => ({
    order_id: generatedOrderId,
    product_variant_id: item.product_variant_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
    subtotal: item.quantity * item.unit_price,
  }));

  const { error: orderItemsError } = await supabase
    .from("ORDER_ITEMS_T")
    .insert(orderItems);

  if (orderItemsError) {
    console.error("Failed to insert order items:", orderItemsError);
    throw new Error("Could not insert order items");
  }

  // Create the shipping data
  const generatedShippingId = GeneralIDGenerator();

  const { error: shippingError } = await supabase
    .from("SHIPPING_T")
    .insert({
      shipping_id: generatedShippingId,
      order_id: generatedOrderId,
      delivery_type: deliveryOption,
      delivery_fee: deliveryFee,
      shipping_status: "Created"
    });

  if (shippingError) {
    console.error("Failed to create shipping record:", shippingError);
    throw new Error(`Could not create shipping row: ${shippingError.message}`);
  }

  //Deduct buyer wallet balance 
  const { error: balanceError } = await supabase
    .from("USERS_T")
    .update({ balances: buyer.balances - totalAmount })
    .eq("user_id", buyerId);

  if (balanceError) {
    console.error("Failed to deduct buyer balance:", balanceError);
    throw new Error("Could not deduct wallet balance");
  }

  //Record wallet transaction (debit) 
  const { error: walletTxError } = await supabase
    .from("WALLET_TRANSACTIONS_T")
    .insert({
      wallet_transaction_id: await IDGenerator(),
      user_id: buyerId,
      transaction_type: "Purchase",
      direction: "Credit",
      payment_method: "Wallet",
      amount: totalAmount,
      wallet_transaction_status: "Success",
    });

  if (walletTxError) {
    console.error("Failed to record wallet transaction:", walletTxError);
    throw new Error("Could not record wallet transaction");
  }

  //Record order transaction 
  const { error: orderTxError } = await supabase
    .from("ORDER_TRANSACTIONS_T")
    .insert({
      order_transaction_id: await IDGenerator(),
      order_id: generatedOrderId,
      amount: totalAmount,
      order_transaction_status: "Success",
    });

  if (orderTxError) {
    console.error("Failed to record order transaction:", orderTxError);
    throw new Error("Could not record order transaction");
  }

  //Decrement stock per variant
  const stockUpdates = items.map(async (item) => {
    const newStock = stockMap[item.product_variant_id] - item.quantity;

    const { error: updateError } = await supabase
      .from("PRODUCT_VARIANTS_T")
      .update({ product_variant_stock: newStock })
      .eq("product_variant_id", item.product_variant_id);

    if (updateError) {
      throw new Error(
        `Could not update stock for variant ${item.product_variant_id}`
      );
    }
  });

  try {
    await Promise.all(stockUpdates);
  } catch (err) {
    console.error("Failed to decrement stock:", err.message);
    throw new Error(err.message);
  }

  //Mark voucher as used
  if (userVoucherId) {
    const { error: voucherError } = await supabase
      .from("USER_VOUCHERS_T")
      .update({
        user_voucher_status: "Used",
        used_at: new Date().toISOString(),
      })
      .eq("user_voucher_id", userVoucherId);

    if (voucherError) {
      console.error("Failed to mark voucher as used:", voucherError);
      throw new Error("Could not update voucher status");
    }
  }

  //Clear purchased items from cart 
  const { error: cartError } = await supabase
    .from("CART_ITEMS_T")
    .delete()
    .eq("user_id", buyerId)
    .in("product_variant_id", variantIds);

  if (cartError) {
    console.error("Failed to clear cart items:", cartError);
    throw new Error("Could not clear cart");
  }

  console.log("Payment processed successfully for order:", generatedOrderId);
  return { success: true, orderId: generatedOrderId };
}