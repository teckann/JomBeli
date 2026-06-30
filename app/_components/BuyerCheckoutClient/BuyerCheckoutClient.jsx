"use client"

import OrderItemCard from "@/app/_components/OrderItemCard/OrderItemCard";
import AddressSelection from "@/app/_components/BuyerAddressSelection/BuyerAddressSelection";
import PaymentForm from "@/app/_components/PaymentForm/PaymentForm";
import BuyerVoucherSelection from "@/app/_components/BuyerVoucherSelection/BuyerVoucherSelection"
import Styles from "./BuyerCheckoutClient.module.css";
import { useState } from "react";

export default function BuyerCheckoutClient({checkoutItems, addresses, total:{totalOriginalPrice, totalSaved}, userID, vouchers}) {

    const [selectedAddressId, setSelectedAddressId] = useState();
    const [selectedVoucherId, setSelectedVoucherId] = useState(null);
    const selectedVoucher = vouchers.find(
        (voucher) => voucher.user_voucher_id === selectedVoucherId
    );
    const subtotalAfterProductDiscount = totalOriginalPrice - totalSaved;
    const voucherDiscount = selectedVoucher
        ? Math.min(Number(selectedVoucher.discount_value || 0), subtotalAfterProductDiscount)
        : 0;
    const totalDiscount = totalSaved + voucherDiscount;

    const CheckoutData = {
        userID: userID,
        sellerID: checkoutItems[0].PRODUCT_VARIANTS_T.PRODUCTS_T.user_id,
        addressID : selectedAddressId,
        originalPrice : totalOriginalPrice,
        discount : totalSaved,
        voucherDiscount,
        totalDiscount,
        orderItems : checkoutItems,
        userVoucherID: selectedVoucherId,
    }

    return (
        <div className={Styles.pageWrapper}>
            <div className={Styles.orderSection}>
                <div className={Styles.shippingWrapper}>
                    <AddressSelection
                        addresses={addresses}
                        selectedAddressId={selectedAddressId}
                        onSelectAddress={setSelectedAddressId}
                    />
                </div>
                <div className={Styles.orderItemWrapper}>
                    <h2>{checkoutItems[0].PRODUCT_VARIANTS_T.PRODUCTS_T.USERS_T.username}</h2>
                    {checkoutItems.map((item) => (
                        <OrderItemCard 
                            key={item.cart_item_id}
                            cartitem={item}
                            showCheckbox={false}
                            showDelete={false}
                        />
                    ))} 
                </div>
            </div>

            <div className={Styles.paymentSection}>
                <BuyerVoucherSelection 
                    vouchers={vouchers} 
                    selectedVoucherId={selectedVoucherId}
                    onSelectVoucher={setSelectedVoucherId}
                    subtotal={totalOriginalPrice}
                />
                <PaymentForm checkoutData={CheckoutData}/>
            </div>
        </div>
    );
}
