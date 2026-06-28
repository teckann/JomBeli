"use client"

import { removeCartItems } from "@/app/_lib/actions";
import Styles from "./BuyerCartClient.module.css";
import Image from "next/image";
import { useState } from "react";


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

    return(
        <div className={Styles.cartComponentWrapper}>
            <div className={Styles.cartItemWrapper}>
                {Object.entries(groupedByShop).map(([shopId, { items }]) => (
                    <div key={shopId} className={Styles.cartItemList}>
                        <h2>Shop {shopId}</h2>
                        <hr />
                        {items.map((cartitem) => (
                            <div key={cartitem.cart_item_id} className={Styles.cartItem}>
                                <input 
                                    type="checkbox" 
                                    checked={checkedItems.includes(cartitem.cart_item_id)}
                                    onChange={() => handleCheckboxChange(cartitem.cart_item_id)} 
                                />
                                <div className={Styles.cartItemImageContainer}>
                                    <Image
                                        src={cartitem.PRODUCT_VARIANTS_T.product_variant_image_url}
                                        width={200}
                                        height={200}
                                        alt="Product Image"
                                    />
                                </div>
                                <div className={Styles.cartItemInfo}>
                                    <h2>{cartitem.PRODUCT_VARIANTS_T.PRODUCTS_T.product_name}</h2>
                                    <p>{cartitem.PRODUCT_VARIANTS_T.sku}</p>
                                    <h2>Qty: {cartitem.quantity}</h2>
                                    <h2>RM {cartitem.PRODUCT_VARIANTS_T.product_variant_price.toFixed(2)}</h2>
                                </div>
                                <button  
                                    onClick={() => handleDelete(cartitem.cart_item_id)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className={Styles.summaryContainer}>
                <h1>Subtotal: {totalOriginalPrice.toFixed(2)}</h1>
                <h1>Discount: {totalSaved.toFixed(2)}</h1>
                <h1>Total: {totalDiscountedPrice.toFixed(2)}</h1>
                <button>Check Out</button>
            </div>
        </div>
    )
}