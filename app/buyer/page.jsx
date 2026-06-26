import Link from "next/link";
import ProductListing from "../_components/ProductListing/ProductListing";
import { getProducts, getTop4DiscountProducts } from "../_lib/data-services";
import styles from "./page.module.css";
import ThemeToggleButton from "../_components/ThemeToggleButton";
import SignOutButton from "../_components/SignOutButton";
import { Suspense } from "react";
import Spinner from "../_components/Spinner/Spinner";

export default async function Home() {
  // const dailyDiscover = await getProducts();
  // const discountProducts = await getTop4DiscountProducts();
  // console.log(dailyDiscover);

  return (
    <main className={styles.main}>
      <div className={styles.bannerArea}>Banner</div>

      <div className={styles.discountProductsArea}>
        <div className={styles.titleContainer}>
          <div className={styles.title}>
            <svg
              className={styles.icon}
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              preserveAspectRatio="none"
            >
              <path d="M13 2L3 14h7l-1 8 12-14h-7l-1-6z" />
            </svg>
            <p>Special Offers</p>
          </div>

          <Link className={styles.link} href="/buyer/category">
            See all
          </Link>
        </div>

        <Suspense fallback={<Spinner />}>
          <ProductListing type="discountProducts" />
        </Suspense>
      </div>

      {/* temp */}
      <div className={styles.temp}>
        <ThemeToggleButton />
        <SignOutButton />
      </div>
    </main>
  );
}
