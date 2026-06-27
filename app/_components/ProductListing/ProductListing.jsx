import {
  getProducts,
  getDiscountProducts,
  getHotProducts,
  getDiscoverProducts,
} from "@/app/_lib/data-services";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./ProductListing.module.css";
import Link from "next/link";

async function ProductListing({ type }) {
  let products = [];

  if (type === "discountProducts") products = await getDiscountProducts();
  if (type === "hotselling") products = await getHotProducts();
  if (type === "discover") products = await getDiscoverProducts();

  if (type)
    return (
      <div className={styles.main}>
        {products.map((product) => (
          <ProductCard key={product.product_id} product={product} type={type} />
        ))}
      </div>
    );
}

export default ProductListing;
