import ProductCard from "../ProductCard/ProductCard";
import styles from "./ProductListing.module.css";

function ProductListing({ products }) {
  return (
    <div className={styles.main}>
      {products.map((product) => (
        <ProductCard key={product.product_id} product={product} />
      ))}
    </div>
  );
}

export default ProductListing;
