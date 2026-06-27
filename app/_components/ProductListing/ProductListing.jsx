import { getProducts, getTop4DiscountProducts } from "@/app/_lib/data-services";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./ProductListing.module.css";
import Link from "next/link";

async function ProductListing({ type }) {
  const dailyDiscover = await getProducts();
  const discountProducts = await getTop4DiscountProducts();

  let products = [];

  if (type === "discountProducts") products = discountProducts;

  return (
    <div className={styles.main}>
      {products.map((product) => (
        <ProductCard key={product.product_id} product={product} />
      ))}
    </div>
  );
}

export default ProductListing;
