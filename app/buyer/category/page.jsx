import Footer from "@/app/_components/Footer/Footer";
import styles from "./page.module.css";
import CategoryFilterBar from "@/app/_components/CategoryFilterBar/CategoryFilterBar";
import ProductListing from "@/app/_components/ProductListing/ProductListing";
import { Suspense } from "react";
import Spinner from "@/app/_components/Spinner/Spinner";

export const metadata = {
  title: "Category",
};

async function page({ searchParams }) {
  const searchItem = await searchParams;
  const filter = searchItem?.category ?? "all";

  // console.log(filter);

  return (
    <main className={styles.main}>
      <CategoryFilterBar />

      <div className={styles.container}>
        <Suspense fallback={<Spinner />} key={filter}>
          <ProductListing filter={filter} />
        </Suspense>
      </div>

      <Footer />
    </main>
  );
}

export default page;
