import {
  getProducts,
  getSellerInfo,
  getSellerRating,
  getSellerTotalReviews,
  getSingleProduct,
} from "@/app/_lib/dynamic-services";
import styles from "./page.module.css";
import ProductDetails from "@/app/_components/ProductDetails/ProductDetails";
import ProductDetailsBackButton from "@/app/_components/ProductDetailsBackButton/ProductDetailsBackButton";
import Footer from "@/app/_components/Footer/Footer";
import { Suspense } from "react";
import Spinner from "@/app/_components/Spinner/Spinner";
import Image from "next/image";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const { productId } = await params;
  // console.log(productId);
  const { product_name: name } = await getSingleProduct(productId);

  return { title: `${name}` };
}

// my laptop very hot, so ignore it first
// export async function generateStaticParams() {
//   const products = await getProducts();

//   const ids = products.map((product) => ({
//     productId: String(product.product_id),
//   }));

//   return ids;
// }

async function page({ params }) {
  const { productId } = await params;

  const { user_id: sellerId } = await getSingleProduct(productId);
  const sellerRating = await getSellerRating(sellerId);
  const totalReview = await getSellerTotalReviews(sellerId);

  return (
    <main className={styles.main}>
      <ProductDetailsBackButton />

      <div className={styles.contentContainer}>
        <Suspense fallback={<Spinner />} key={productId}>
          <ProductDetails productId={productId} />
        </Suspense>

        <SellerInfo
          sellerId={sellerId}
          sellerRating={sellerRating}
          totalReview={totalReview}
        />
      </div>

      <Footer />
    </main>
  );
}

const SellerInfo = async ({ sellerId, sellerRating, totalReview }) => {
  const { avatar, username } = await getSellerInfo(sellerId);

  return (
    <div className={styles.sellerContainer}>
      <div className={styles.sellerMain}>
        <div className={styles.avatarContainer}>
          <Image
            src={avatar}
            alt="Seller Logo"
            fill
            sizes="40px"
            className={styles.avatar}
          />
        </div>

        <div className={styles.actions}>
          <div className={styles.shopInfoContainer}>
            <p className={styles.shopName}>{username}</p>
            <p className={styles.shopInfo}>
              <span>{sellerRating} Stars</span> -{" "}
              <span>{totalReview} Reviews</span>
            </p>
          </div>

          <div className={styles.buttonContainer}>
            <Link href={`/buyer/chat?id=${sellerId}`}>
              <button>Chat Now</button>
            </Link>

            <Link href="#">
              <button>View Shop</button>
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.sellerSub}>
        <p>test</p>
      </div>
    </div>
  );
};

export default page;
