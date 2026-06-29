"use client"

import OrderItemCard from "@/app/_components/OrderItemCard/OrderItemCard";
import AddressSelection from "@/app/_components/BuyerAddressSelection/BuyerAddressSelection";
import PaymentForm from "@/app/_components/PaymentForm/PaymentForm";
import Styles from "./BuyerCheckoutClient.module.css";
import { useState } from "react";

export default function BuyerCheckoutClient({checkoutItems, addresses, total:{totalOriginalPrice, totalSaved}, userID}) {

    const [selectedAddressId, setSelectedAddressId] = useState();

    const CheckoutData = {
        userID: userID,
        sellerID: checkoutItems[0].PRODUCT_VARIANTS_T.PRODUCTS_T.user_id,
        addressID : selectedAddressId,
        originalPrice : totalOriginalPrice,
        discount : totalSaved,
        orderItems : checkoutItems,
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
                <PaymentForm checkoutData={CheckoutData}/>
            </div>
        </div>
    );
}