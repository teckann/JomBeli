import Image from "next/image";
import Styles from "./OrderItemCard.module.css";

export default function CartItemCard({ 
    cartitem, 
    isChecked, 
    onCheckboxChange, 
    onDelete,
    showCheckbox = true, 
    showDelete = true,
    selectedShopID, 
}) {
    const { product_variant_price: originalPrice, sku } = cartitem.PRODUCT_VARIANTS_T;
    const { product_name, product_image_url} = cartitem.PRODUCT_VARIANTS_T.PRODUCTS_T;
    const discount = cartitem.PRODUCT_VARIANTS_T.PRODUCTS_T.discount;
    const hasDiscount = discount ?? false;
    const finalPrice = hasDiscount ? originalPrice * ((100 - discount) / 100) : originalPrice;

    return (
        <div className={Styles.cartItem}>
            {showCheckbox && (
                <input 
                    type="checkbox" 
                    checked={isChecked}
                    onChange={onCheckboxChange} 
                    disabled={selectedShopID != null && selectedShopID!=cartitem.PRODUCT_VARIANTS_T.PRODUCTS_T.user_id}
                />
            )}

            <div className={Styles.cartItemImageContainer}>
                <Image
                    src={product_image_url[0]}
                    width={200}
                    height={200}
                    alt={product_name}
                />
            </div>

            <div className={Styles.cartItemInfo}>
                <h2>{product_name}</h2>
                <p>{sku}</p>
                <h2>Qty: {cartitem.quantity}</h2>
                <div className={Styles.price}>
                    <span
                        className={`${Styles.finalPrice} ${hasDiscount && Styles.discountColor}`}
                    >
                        RM {finalPrice.toFixed(2)}
                    </span>
                    {hasDiscount && (
                        <span className={Styles.originalPrice}>RM {originalPrice?.toFixed(2)}</span>
                    )}
                </div>
            </div>

            {showDelete && (
                <button 
                    onClick={onDelete}
                    disabled={isChecked}
                >
                    Delete
                </button>
            )}
        </div>
    );
}