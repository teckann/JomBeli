import Link from "next/link";
import ProductListing from "../_components/ProductListing/ProductListing";
import { getProducts, getTop4DiscountProducts } from "../_lib/data-services";
import styles from "./page.module.css";
import ThemeToggleButton from "../_components/ThemeToggleButton";
import SignOutButton from "../_components/SignOutButton";
import { Suspense } from "react";
import Spinner from "../_components/Spinner/Spinner";

export default async function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.bannerArea}>Banner</div>

      {/* discount */}
      <SpecialArea
        title="Special Offers"
        svg={
          <svg
            className={styles.icon}
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            preserveAspectRatio="none"
          >
            <path d="M13 2L3 14h7l-1 8 12-14h-7l-1-6z" />
          </svg>
        }
        type="discountProducts"
      />

      {/* top sales */}
      <SpecialArea
        title="Special Offers"
        svg={
          <svg
            className={styles.icon}
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            preserveAspectRatio="none"
          >
            <path d="M13 2L3 14h7l-1 8 12-14h-7l-1-6z" />
          </svg>
        }
        type="discountProducts"
      />

      {/* temp */}
      <div className={styles.temp}>
        <ThemeToggleButton />
        <SignOutButton />
      </div>
    </main>
  );
}

const SpecialArea = ({ title, svg, type }) => {
  return (
    <div className={styles.specialArea}>
      <div className={styles.titleContainer}>
        <div className={styles.title}>
          {svg}
          <p>{title}</p>
        </div>

        <Link className={styles.link} href="/buyer/category">
          See all
        </Link>
      </div>

      <Suspense fallback={<Spinner />}>
        <ProductListing type={type} />
      </Suspense>
    </div>
  );
};
