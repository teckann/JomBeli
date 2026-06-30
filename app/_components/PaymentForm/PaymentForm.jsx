"use client";

import { useState } from "react";
import { checkoutAction } from "@/app/_lib/actions";
import { useRouter } from "next/navigation";
import Styles from "./PaymentForm.module.css";

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
        <div className={Styles.checkoutContainer}>
            <div className={Styles.deliverySection}>
                <label className={Styles.sectionLabel}>Select Delivery Method</label>
                <div className={Styles.deliveryOptions}>
                    <div className={`${Styles.deliveryCard} ${deliveryMethod === "Standard" ? Styles.selected : ""}`}>
                        <label htmlFor="standard" className={Styles.radioLabel}>
                            <input 
                                type="radio" 
                                id="standard" 
                                name="deliveryMethod" 
                                value="Standard" 
                                checked={deliveryMethod === "Standard"}
                                onChange={(e) => setDeliveryMethod(e.target.value)}
                                className={Styles.radioInput}
                            />
                            Standard Delivery (RM 5)
                        </label>
                    </div>
                    <div className={`${Styles.deliveryCard} ${deliveryMethod === "Express" ? Styles.selected : ""}`}>
                        <label htmlFor="express" className={Styles.radioLabel}>
                            <input 
                                type="radio" 
                                id="express" 
                                name="deliveryMethod" 
                                value="Express" 
                                checked={deliveryMethod === "Express"}
                                onChange={(e) => setDeliveryMethod(e.target.value)}
                                className={Styles.radioInput}
                            />
                            Express Delivery (RM 10)
                        </label>
                    </div>
                </div>
            </div>

            <div className={Styles.summarySection}>
                <h2 className={Styles.summaryTitle}>Order Summary</h2>
                <hr className={Styles.divider} / >

                <div className={Styles.summaryRow}>
                    <span>Items Subtotal:</span>
                    <span>RM {itemsSubtotal.toFixed(2)}</span>
                </div>
                <div className={`${Styles.summaryRow} ${Styles.discount}`}>
                    <span>Discounts Saved:</span>
                    <span>-RM {discountAmount.toFixed(2)}</span>
                </div>
                <div className={Styles.summaryRow}>
                    <span>Shipping Fee:</span>
                    <span>RM {shippingFee}</span>
                </div>
                <div className={Styles.summaryRow}>
                    <span>Voucher Applied:</span>
                    <span className={checkoutData.userVoucherID ? Styles.voucherApplied : Styles.voucherNone}>
                        {checkoutData.userVoucherID ? "Applied" : "None"}
                    </span>
                </div>
                <div className={`${Styles.summaryRow} Styles.totalRow`}>
                    <strong>Grand Total:</strong>
                    <strong>RM {grandTotal}</strong>
                </div>

                <button onClick={handlePayment} className={Styles.payButton}>
                    Pay Now
                </button>
            </div>
        </div>
    );
}