import {
  getProducts,
  getDiscountProducts,
  getHotProducts,
} from "@/app/_lib/data-services";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./ProductListing.module.css";
import Link from "next/link";

async function ProductListing({ type }) {
  // const dailyDiscover = await getProducts();

  let products = [];

  if (type === "discountProducts") products = await getDiscountProducts();
  if (type === "hotselling") products = await getHotProducts();

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
