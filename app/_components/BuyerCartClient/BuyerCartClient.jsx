"use client"

import { removeCartItems } from "@/app/_lib/actions";
import Styles from "./BuyerCartClient.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import OrderItemCard from "../OrderItemCard/OrderItemCard";
import TempCoverComponent from "../TempCoverComponent/TempCoverComponent";


export default function BuyerCartClient({cartData}){

    const [itemList, setItemsList] = useState(cartData);
    const [checkedItems, setCheckedItems] = useState([]);
    const [selectedShopID, setSelectedShopID] = useState(null);

    // Group items by shop (seller user id)
    const groupedByShop = itemList.reduce((acc, cartitem) => {
        const shopId = cartitem.PRODUCT_VARIANTS_T.PRODUCTS_T.user_id;
        const shopName = cartitem.PRODUCT_VARIANTS_T.PRODUCTS_T.USERS_T.username;

        if (!acc[shopId]) {
            acc[shopId] = { 
                shopName: shopName,
                items: []
            };
        }

        acc[shopId].items.push(cartitem);
        return acc;
    }, {});
    
    const handleCheckboxChange = (id, shopId) => {
        const isAlreadyChecked = checkedItems.includes(id);
        const nextCheckedItems = isAlreadyChecked
            ? checkedItems.filter((item) => item !== id)
            : [...checkedItems, id];

        setCheckedItems(nextCheckedItems);

        if (nextCheckedItems.length === 0) {
            setSelectedShopID(null);
        } else {
            setSelectedShopID(shopId);
        }
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
                {Object.entries(groupedByShop).length==0
                ?
                    <div className={Styles.tempCoverContainer}>
                        <TempCoverComponent
                        imagePath="/data-not-found.png"
                        alt="Data not found"
                        title="No Cart Item Found"
                        desc="Go browse and add items to cart"
                        />
                    </div>
                :   null
                }
                {Object.entries(groupedByShop).map(([shopId, { shopName, items }]) => (
                    <div key={shopId} className={Styles.cartItemList}>
                        <h2>{shopName}</h2>
                        <hr />
                        {items.map((cartitem) => (
                            <OrderItemCard 
                                key={cartitem.cart_item_id}
                                cartitem={cartitem}
                                isChecked={checkedItems.includes(cartitem.cart_item_id)}
                                onCheckboxChange={() => handleCheckboxChange(cartitem.cart_item_id, shopId)}
                                onDelete={() => handleDelete(cartitem.cart_item_id)}
                                showCheckbox={true}
                                showDelete={true}
                                selectedShopID={selectedShopID}
                            />
                        ))}
                    </div>
                ))}
            </div>

            <div className={Styles.summaryContainer}>
                <h2 className={Styles.summaryTitle}>Order Summary</h2>
                
                <div className={Styles.summaryRow}>
                    <span>Subtotal</span>
                    <span>RM{totalOriginalPrice.toFixed(2)}</span>
                </div>
                
                <div className={`${Styles.summaryRow} ${Styles.discount}`}>
                    <span>Discount</span>
                    <span>-RM{totalSaved.toFixed(2)}</span>
                </div>
                
                <div className={`${Styles.summaryRow} ${Styles.total}`}>
                    <span>Total</span>
                    <span>RM{totalDiscountedPrice.toFixed(2)}</span>
                </div>
                
                <button 
                    className={Styles.checkoutBtn}
                    onClick={() => handleCheckOut()}
                    disabled={checkedItems.length === 0}
                >
                    Check Out
                </button>
            </div>
        </div>
    )
}