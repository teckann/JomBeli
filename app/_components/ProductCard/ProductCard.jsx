import Image from "next/image";
import styles from "./ProductCard.module.css";
import Link from "next/link";

function ProductCard({ product, type }) {
  const {
    product_id: productID,
    product_name: productName,
    product_image_url: productImg,
    category,
    stock_quantity: stock,
    total_sold: sold,
    price,
    discount,
  } = product;

  // check got discount or not
  const hasDiscount = discount ?? false;
  const finalPrice = hasDiscount ? price * ((100 - discount) / 100) : price;

  return (
    <Link
      className={styles.productCard}
      href={`/buyer/products?id=${productID}`}
    >
      <div className={styles.productImage}>
        <Image src={productImg[0]} alt={productName} fill />
      </div>

      <div className={styles.productInfo}>
        <h3>{productName}</h3>

        <div className={styles.tagContainer}>
          <Tags
            type={type}
            discount={discount}
            stock={stock}
            category={category}
            sold={sold}
          />
        </div>

        <div className={styles.price}>
          <span
            className={`${styles.finalPrice} ${hasDiscount && styles.discountColor}`}
          >
            RM {finalPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className={styles.originalPrice}>RM {price?.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

const Tags = ({ type, discount, stock, category, sold }) => {
  return (
    <>
      <div className={styles.tag}>
        <svg
          className={styles.icon}
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          width="12"
          height="12"
        >
          <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z" />
        </svg>
        <p>{category}</p>
      </div>

      {type === "discountProducts" && (
        <div className={styles.tag}>
          <svg
            className={styles.icon}
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            width="12"
            height="12"
          >
            <path d="M20.59 13.41L11 3.83A2 2 0 009.59 3H4a2 2 0 00-2 2v5.59a2 2 0 00.59 1.41l9.59 9.59a2 2 0 002.83 0l5.59-5.59a2 2 0 000-2.83zM7.5 7A1.5 1.5 0 119 8.5 1.5 1.5 0 017.5 7z" />
          </svg>
          <p>{discount} %</p>
        </div>
      )}

      {type === "hotselling" && (
        <div className={styles.tag}>
          <svg
            className={styles.icon}
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            width="12"
            height="12"
          >
            <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM7.2 14h9.6c.8 0 1.5-.5 1.8-1.2l3-7.3c.3-.8-.3-1.5-1.1-1.5H6.2L5.7 2H2v2h2l3.6 9.6-1.3 2.3C5.7 16.6 6.6 18 8 18h12v-2H8l1.2-2z" />
            {/* <path d="M21 7.5l-9-5-9 5v9l9 5 9-5v-9zm-9-3.3l6.7 3.8-2.7 1.5L9 5.7 12 4.2zm-7.7 4.2L12 3.2l2.7 1.5L6 9.7 4.3 8.4zM4 9.8l8 4.4 8-4.4v7.4l-8 4.4-8-4.4V9.8z" /> */}
          </svg>
          <p>{sold}</p>
        </div>
      )}

      {(type === "all" || type === "discover") && (
        <div className={styles.tag}>
          <svg
            className={styles.icon}
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            width="12"
            height="12"
          >
            <path d="M21 7.5l-9-5-9 5v9l9 5 9-5v-9zm-9-3.3l6.7 3.8-2.7 1.5L9 5.7 12 4.2zm-7.7 4.2L12 3.2l2.7 1.5L6 9.7 4.3 8.4zM4 9.8l8 4.4 8-4.4v7.4l-8 4.4-8-4.4V9.8z" />
          </svg>
          <p>{stock}</p>
        </div>
      )}
    </>
  );
};

export default ProductCard;
