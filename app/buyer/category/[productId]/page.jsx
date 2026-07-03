import getProductOverallRating, {
  getProductReviews,
  getSellerInfo,
  getSellerRating,
  getSellerTotalDiscountProduct,
  getSellerTotalProduct,
  getSellerTotalReviews,
  getSingleProduct,
  getTotalRatingRecords,
} from "@/app/_lib/dynamic-services";
import styles from "./page.module.css";
import ProductDetails from "@/app/_components/ProductDetails/ProductDetails";
import ProductDetailsBackButton from "@/app/_components/ProductDetailsBackButton/ProductDetailsBackButton";
import Footer from "@/app/_components/Footer/Footer";
import { Suspense } from "react";
import Spinner from "@/app/_components/Spinner/Spinner";
import Image from "next/image";
import Link from "next/link";
import ProductReviewFilterBar from "@/app/_components/ProductReviewFilterBar/ProductReviewFilterBar";
import ProductReviewListing from "@/app/_components/ProductReviewListing/ProductReviewListing";
import TempCoverComponent from "@/app/_components/TempCoverComponent/TempCoverComponent";

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

async function page({ params, searchParams }) {
  const { productId } = await params;

  const searchItem = await searchParams;
  const filter = searchItem?.reviewStar ?? "all";

  const { user_id: sellerId, product_description: desc } =
    await getSingleProduct(productId);
  const sellerRating = await getSellerRating(sellerId);
  const totalReview = await getSellerTotalReviews(sellerId);
  const totalProducts = await getSellerTotalProduct(sellerId);
  const totalDiscountProduct = await getSellerTotalDiscountProduct(sellerId);
  const productOverallRating = await getProductOverallRating(productId);
  const productRatingRecord = await getTotalRatingRecords(productId);

  const reviews = await getProductReviews(productId);

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
          totalProducts={totalProducts}
          totalDiscountProduct={totalDiscountProduct}
        />

        <Description desc={desc} />

        <div className={styles.reviewContainer}>
          <ReviewHeading />

          {reviews.length !== 0 ? (
            <div className={styles.reviewContent}>
              <ProductReviewFilterBar
                productOverallRating={productOverallRating}
                productRatingRecord={productRatingRecord}
              />

              <Suspense fallback={<Spinner />} key={filter}>
                <ProductReviewListing filter={filter} productId={productId} />
              </Suspense>
            </div>
          ) : (
            <div className={styles.tempCoverCon}>
              <TempCoverComponent
                imagePath="/data-not-found.png"
                alt="No Review"
                title="No Reviews Yet"
                desc="There are no reviews for this item yet."
              />
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

const SellerInfo = async ({
  sellerId,
  sellerRating,
  totalReview,
  totalProducts,
  totalDiscountProduct,
}) => {
  const { avatar, username } = await getSellerInfo(sellerId);

  const subElementData = [
    {
      icon: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
      iconStyleName: "starIcon",
      text: `${sellerRating.toFixed(1)} Shop Rating`,
    },
    {
      icon: "M21 7.5 12 2 3 7.5v9L12 22l9-5.5v-9ZM12 4.3l6.8 4.1L12 12.5 5.2 8.4 12 4.3Zm-7 5.5 6 3.6v6.3l-6-3.7V9.8Zm8 9.9v-6.3l6-3.6v6.2l-6 3.7Z",
      iconStyleName: "productIcon",
      text: `${totalProducts} Available Items`,
    },
    {
      icon: "M20.59 13.41L11 3.83A2 2 0 009.59 3H4a2 2 0 00-2 2v5.59a2 2 0 00.59 1.41l9.59 9.59a2 2 0 002.83 0l5.59-5.59a2 2 0 000-2.83zM7.5 7A1.5 1.5 0 119 8.5 1.5 1.5 0 017.5 7z",
      iconStyleName: "discountIcon",
      text: `${totalDiscountProduct} Discount Items`,
    },
  ];

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
              <span>{sellerRating.toFixed(1)} Stars</span> -{" "}
              <span>{totalReview} Reviews</span>
            </p>
          </div>

          <div className={styles.buttonContainer}>
            <Link href={`/buyer/chat?id=${sellerId}`}>
              <button>Chat Now</button>
            </Link>

            <Link href={`/buyer/shopProfile/${sellerId}`}>
              <button>View Shop</button>
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.sellerSub}>
        {subElementData.map((item, index) => (
          <SubElement
            key={index}
            icon={item.icon}
            iconStyleName={item.iconStyleName}
            text={item.text}
          />
        ))}
      </div>
    </div>
  );
};

const SubElement = ({ icon, iconStyleName, text }) => {
  return (
    <div className={styles.subElement}>
      <svg
        className={styles[iconStyleName]}
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d={icon} />
      </svg>

      <p>{text}</p>
    </div>
  );
};

const Description = ({ desc }) => {
  return (
    <div className={styles.descContainer}>
      <div className={styles.headerTitle}>
        <svg
          className={styles.headerIcon}
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M6 2h9l5 5v15H6V2Zm8 1.5V8h4.5L14 3.5ZM8 11h8v2H8v-2Zm0 4h8v2H8v-2Zm0-8h4v2H8V7Z" />
        </svg>

        <p>Product Description</p>
      </div>
      <p className={styles.descText}>{desc}</p>
    </div>
  );
};

const ReviewHeading = () => {
  return (
    <div className={styles.headerTitle}>
      <svg
        className={styles.headerIcon}
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Zm-2 9H6V9h12v2Zm-4 4H6v-2h8v2Z" />
      </svg>

      <p>Product Reviews</p>
    </div>
  );
};

export default page;
