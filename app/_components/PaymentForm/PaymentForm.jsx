"use client";

import { useState } from "react";
import { checkoutAction } from "@/app/_lib/actions";
import { useRouter } from "next/navigation";

export default function PaymentForm({ checkoutData }) {
    const router = useRouter();
    const [deliveryMethod, setDeliveryMethod] = useState("Standard");

    const deliveryConfig = {
        Standard: { option: "Standard Delivery", fee: 5, days: "1-3 days" },
        Express: { option: "Express Delivery", fee: 10, days: "within 24 hours" },
    };

    const currentDelivery = deliveryConfig[deliveryMethod];

    const itemsSubtotal = checkoutData.originalPrice;
    const discountAmount = checkoutData.discount;
    const shippingFee = currentDelivery.fee;
    const grandTotal = itemsSubtotal - discountAmount + shippingFee;

    const handlePayment = async () => {

        const paymentPayload = {
            buyerId: checkoutData.userID,
            sellerId: checkoutData.sellerID,
            addressId: checkoutData.addressID,
            deliveryOption: currentDelivery.option,
            deliveryDescription: `${currentDelivery.option} home delivery`,
            deliveryFee: shippingFee,
            estimatedDays: currentDelivery.days,
            originalPrice: itemsSubtotal,
            discountAmount: discountAmount,
            totalAmount: grandTotal,
            userVoucherId: checkoutData.userVoucherID || null,     
            items: checkoutData.orderItems.map(item => ({
                product_variant_id: item.PRODUCT_VARIANTS_T.product_variant_id, 
                quantity: item.quantity,
                unit_price: item.PRODUCT_VARIANTS_T.product_variant_price
            }))
        };
        console.log("Sending Payload:", paymentPayload);

        try {
            const response = await checkoutAction(paymentPayload);
            if (response.success) {
                alert(`Order created successfully! ID: ${response.orderId}`);
                router.push('/buyer/ordercomplete')
            } else {
                alert(`Payment failed: ${response.error}`);
            }
        } catch (error) {
            console.error(error);
            alert("An unexpected error occurred.");
        }
    };

    return (
        <div>
            <div>
                <label>Select Delivery Method</label>
                <div>
                    <label htmlFor="standard">
                        <input 
                            type="radio" 
                            id="standard" 
                            name="deliveryMethod" 
                            value="Standard" 
                            checked={deliveryMethod === "Standard"}
                            onChange={(e) => setDeliveryMethod(e.target.value)}
                        />
                        Standard Delivery (RM 5)
                    </label>
                </div>
                <div>
                    <label htmlFor="express">
                        <input 
                            type="radio" 
                            id="express" 
                            name="deliveryMethod" 
                            value="Express" 
                            checked={deliveryMethod === "Express"}
                            onChange={(e) => setDeliveryMethod(e.target.value)}
                        />
                        Express Delivery (RM 10)
                    </label>
                </div>
            </div>

            <h2>Order Summary</h2>
            <hr />

            <div>
                <span>Items Subtotal:</span>
                <span>RM {itemsSubtotal.toFixed(2)}</span>
            </div>
            <div>
                <span>Discounts Saved:</span>
                <span>-RM {discountAmount.toFixed(2)}</span>
            </div>
            <div>
                <span>Shipping Fee:</span>
                <span>RM {shippingFee}</span>
            </div>
            <div>
                <span>Voucher Applied:</span>
                <span>{checkoutData.userVoucherID ? "Applied" : "NULL"}</span>
            </div>
            <div>
                <strong>Grand Total:</strong>
                <strong>RM {grandTotal}</strong>
            </div>

            <button onClick={handlePayment}>
                Pay Now
            </button>
        </div>
    );
}