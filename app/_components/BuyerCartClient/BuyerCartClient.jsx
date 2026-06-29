"use client"

import { removeCartItems } from "@/app/_lib/actions";
import Styles from "./BuyerCartClient.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import OrderItemCard from "../OrderItemCard/OrderItemCard";


export default function BuyerCartClient({cartData}){

    const [itemList, setItemsList] = useState(cartData);
    const [checkedItems, setCheckedItems] = useState([]);

    // Group items by shop (seller user id)
    const groupedByShop = itemList.reduce((acc, cartitem) => {
        const shopId = cartitem.PRODUCT_VARIANTS_T.PRODUCTS_T.user_id;

        if (!acc[shopId]) {
            acc[shopId] = { items: [] };
        }

        acc[shopId].items.push(cartitem);
        return acc;
    }, {});
    
    const handleCheckboxChange = (id) => {
        setCheckedItems((prev) =>
            prev.includes(id)
                ?prev.filter((item) => item !== id)
                :[...prev, id]
        );
    };

    // Calculate price based on checked items
    const { totalOriginalPrice, totalDiscountedPrice } = itemList
    .filter((item) => checkedItems.includes(item.cart_item_id))
    .reduce(
        (totals, item) => {
        const { product_variant_price: originalPrice, PRODUCTS_T } = item.PRODUCT_VARIANTS_T;
        const discountPercent = PRODUCTS_T?.discount || 0;
        const quantity = item.quantity;

        const itemOriginalTotal = originalPrice * quantity;
        
        const discountAmount = originalPrice * (discountPercent / 100);
        const finalItemPrice = originalPrice - discountAmount;
        const itemDiscountedTotal = finalItemPrice * quantity;

        totals.totalOriginalPrice += itemOriginalTotal;
        totals.totalDiscountedPrice += itemDiscountedTotal;

        return totals;
        },
        { totalOriginalPrice: 0, totalDiscountedPrice: 0 }
    );
    const totalSaved = totalOriginalPrice - totalDiscountedPrice;

    // Delete cart item
    const handleDelete = async (cartItemId) => {
        await removeCartItems(cartItemId);
        setItemsList((prev) => prev.filter(item => item.cart_item_id !== cartItemId));
        setCheckedItems((prev) => prev.filter(id => id !== cartItemId));
    };
    
    const router = useRouter();

    const handleCheckOut = () => {
        if(checkedItems.length === 0){
            alert("Please select at least one item");
            return;
        }

        const itemsParam = checkedItems.join(",");

        router.push(`/buyer/payment?items=${itemsParam}`);
    }

    return(
        <div className={Styles.cartComponentWrapper}>
            <div className={Styles.cartItemWrapper}>
                {Object.entries(groupedByShop).map(([shopId, { items }]) => (
                    <div key={shopId} className={Styles.cartItemList}>
                        <h2>Shop {shopId}</h2>
                        <hr />
                        {items.map((cartitem) => (
                            <OrderItemCard 
                                key={cartitem.cart_item_id}
                                cartitem={cartitem}
                                isChecked={checkedItems.includes(cartitem.cart_item_id)}
                                onCheckboxChange={() => handleCheckboxChange(cartitem.cart_item_id)}
                                onDelete={() => handleDelete(cartitem.cart_item_id)}
                                showCheckbox={true}
                                showDelete={true}
                            />
                        ))}
                    </div>
                ))}
            </div>

            <div className={Styles.summaryContainer}>
                <h1>Subtotal: {totalOriginalPrice.toFixed(2)}</h1>
                <h1>Discount: {totalSaved.toFixed(2)}</h1>
                <h1>Total: {totalDiscountedPrice.toFixed(2)}</h1>
                <button 
                    onClick={()=>handleCheckOut()}
                    disabled={checkedItems.length === 0}
                >
                    Check Out
                </button>
            </div>
        </div>
    )
}