import Link from "next/link";
import ProductListing from "../_components/ProductListing/ProductListing";
import { getProducts, getTop4DiscountProducts } from "../_lib/data-services";
import styles from "./page.module.css";

export default async function Home() {
  const dailyDiscover = await getProducts();
  const discountProducts = await getTop4DiscountProducts();
  // console.log(dailyDiscover);

  return (
    <main className={styles.main}>
      <div className={styles.bannerArea}>Banner</div>

      <div className={styles.discountProductsArea}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>Special Offers</h2>
          <Link className={styles.link} href="/buyer/category">
            See all
          </Link>
        </div>
        <ProductListing products={discountProducts} />
      </div>
    </main>
  );
}
