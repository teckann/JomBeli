import Image from "next/image";
import Styles from "./OrderItemCard.module.css";

export default function CartItemCard({ 
    cartitem, 
    isChecked, 
    onCheckboxChange, 
    onDelete,
    showCheckbox = true, 
    showDelete = true 
}) {
    const { product_variant_price: originalPrice, sku } = cartitem.PRODUCT_VARIANTS_T;
    const { product_name, product_image_url} = cartitem.PRODUCT_VARIANTS_T.PRODUCTS_T;

    return (
        <div className={Styles.cartItem}>
            {showCheckbox && (
                <input 
                    type="checkbox" 
                    checked={isChecked}
                    onChange={onCheckboxChange} 
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
                <h2>RM {originalPrice.toFixed(2)}</h2>
            </div>

            {showDelete && (
                <button onClick={onDelete}>
                    Delete
                </button>
            )}
        </div>
    );
}