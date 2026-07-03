import Image from 'next/image';
import Styles from './MyOrdersCard.module.css';
import Link from 'next/link';
import { checkProductReview } from '@/app/_lib/data-services';
import { getUser } from '@/app/_lib/auth';
import { confirmOrder } from '@/app/_lib/actions';

export default async function MyOrdersCard({
    orderID,
    orderItems = [], 
    totalAmount,
    order_status,
}){
    const getStatusClass = (status) => {
        switch (status) {
            case 'Ordered': return Styles.statusOrdered;
            case 'Shipped': return Styles.statusShipped;
            case 'OutForDelivery': return Styles.statusOutForDelivery;
            case 'Delivered': return Styles.statusOutForDelivery;
            case 'Applied For Refund': return Styles.statusRefunded;
            case 'Refunded': return Styles.statusRefunded;
            case 'Completed': return Styles.statusCompleted;
            default: return Styles.statusDefault;
        }
    };

    const user = await getUser();
    const userId = user?.id;

    let hasReviewed = false; 
    if (order_status === "Completed" && userId) {
        hasReviewed = await checkProductReview(userId, orderID);
    }

    return (
        <div className={Styles.orderCard}>
            <div className={Styles.orderHeader}>
                <div>
                    <span className={Styles.orderLabel}>Order ID</span>
                    <h2 className={Styles.orderIdText}>#{orderID}</h2>
                </div>
                <div className={Styles.headerRight}>
                    <span className={`${Styles.statusBadge} ${getStatusClass(order_status)}`}>
                        {order_status}
                    </span>
                </div>
            </div>
            
            <div className={Styles.itemsContainer}>
                {orderItems.map((item) => {
                    const { order_item_id, quantity, subtotal } = item;
                    const { sku } = item.PRODUCT_VARIANTS_T || {};
                    const { product_image_url, product_name } = item.PRODUCT_VARIANTS_T.PRODUCTS_T;

                    return (
                        <div key={order_item_id} className={Styles.itemRow}>
                            <div className={Styles.imageWrapper}>
                                <Image
                                    src={product_image_url[0]}
                                    width={90}
                                    height={90}
                                    alt={product_name || "Product image"}
                                    className={Styles.productImage}
                                />
                            </div>

                            <div className={Styles.itemDetails}>
                                <div className={Styles.itemMainInfo}>
                                    <h3 className={Styles.productName}>{product_name || "Unnamed Product"}</h3>
                                    {sku && <p className={Styles.skuText}>SKU: {sku}</p>}
                                </div>
                                <div className={Styles.itemPriceInfo}>
                                    <span className={Styles.qtyText}>Qty: {quantity}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className={Styles.orderFooter}>
                <div className={Styles.totalWrapper}>
                    <span className={Styles.totalLabel}>Total Amount</span>
                    <span className={Styles.totalPrice}>RM {Number(totalAmount).toFixed(2)}</span>
                </div>
                {order_status === "Delivered" ? (
                <div className={Styles.actionContainer}>
                    <form action={confirmOrder}>
                    <input type="hidden" name="orderID" value={orderID} />
                    <button type="submit" className={Styles.actionButton}>
                        Complete Order
                    </button>
                    </form>
                    <Link className={Styles.actionLink} href={`/buyer/refund/${orderID}`} >Refund</Link>
                </div>
                ) : null}
                {order_status === "Completed" && (
                    <div className={Styles.actionContainer}>
                        {hasReviewed ? (
                            <p className={Styles.productReviewed}>Product Reviewed</p>
                        ) : (
                            <Link className={Styles.actionLink} href={`/buyer/review/${orderID}`}>
                                Rate Product
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}