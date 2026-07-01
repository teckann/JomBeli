import Image from "next/image";
import {
  getFilterReviews,
  getProductReviews,
} from "@/app/_lib/dynamic-services";
import styles from "./ProductReviewListing.module.css";
import TempCoverComponent from "../TempCoverComponent/TempCoverComponent";

async function ProductReviewListing({ filter, productId }) {
  const reviews = await getProductReviews(productId);

  let displayReviews = [];

  if (filter && filter !== "all")
    displayReviews = await getFilterReviews(productId, Number(filter));

  if (!filter || filter === "all") displayReviews = reviews;

  return (
    <div className={styles.reviewsContainer}>
      {displayReviews.length !== 0 ? (
        displayReviews?.map((item) => (
          <Review key={item.review_id} review={item} />
        ))
      ) : (
        <div className={styles.tempCover}>
          <TempCoverComponent
            imagePath="/data-not-found.png"
            alt="No Review"
            title="No Reviews Yet"
            desc={`There are no reviews for ${filter} rating.`}
          />
        </div>
      )}
    </div>
  );
}

function maskName(name = "") {
  if (!name) return "";
  if (name.length <= 2) return name;
  return (
    name[0] + "*".repeat(Math.max(2, name.length - 2)) + name[name.length - 1]
  );
}

const formatDateTime = (datetime) => {
  const date = new Date(datetime);
  return `${date.toLocaleDateString("en-CA")} ${date.toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    },
  )}`;
};

const Review = ({ review }) => {
  const rating = Number(review.product_rating || 0);

  return (
    <div className={styles.reviewCard}>
      <Image
        src={review.avatar || "/default-avatar.png"}
        alt="avatar"
        width={40}
        height={40}
        className={styles.avatar}
      />

      <div className={styles.content}>
        <div className={styles.topRow}>
          <div className={styles.username}>{maskName(review.username)}</div>

          <div className={styles.date}>{formatDateTime(review.created_at)}</div>
        </div>

        <div className={styles.stars}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} filled={i < rating} />
          ))}
        </div>

        <p className={styles.comment}>{review.comment}</p>
      </div>
    </div>
  );
};

const Star = ({ filled }) => (
  <svg
    className={filled ? styles.starFilled : styles.starEmpty}
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

export default ProductReviewListing;
