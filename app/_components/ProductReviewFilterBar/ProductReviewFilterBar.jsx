"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import styles from "./ProductReviewFilterBar.module.css";

function ProductReviewFilterBar({
  productOverallRating,
  productRatingRecord: records,
}) {
  // console.log(records);

  const filterOptions = [
    { id: "all", text: `All (${records.all})` },
    { id: "5.0", text: `5 Stars (${records[5]})` },
    { id: "4.0", text: `4 Stars (${records[4]})` },
    { id: "3.0", text: `3 Stars (${records[3]})` },
    { id: "2.0", text: `2 Stars (${records[2]})` },
    { id: "1.0", text: `1 Star (${records[1]})` },
  ];

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeFilter = searchParams.get("reviewStar") ?? "";

  const handleFilter = (title) => {
    const params = new URLSearchParams(searchParams);

    params.set("reviewStar", title);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.container1}>
        <div className={styles.overallRating}>
          <p className={styles.overallStar}>
            {productOverallRating ? productOverallRating.toFixed(1) : 0}
          </p>
          <p className={styles.totalStar}>out of 5.0</p>
        </div>
      </div>

      <div className={styles.ratingFilterBar}>
        {filterOptions.map((item, index) => (
          <FilterButton
            key={index}
            id={item.id}
            text={item.text}
            activeFilter={activeFilter}
            handleFilter={handleFilter}
          />
        ))}
      </div>
    </div>
  );
}

const FilterButton = ({ id, text, activeFilter, handleFilter }) => {
  return (
    <button
      onClick={() => handleFilter(id)}
      className={`${styles.filterButton} ${id === activeFilter ? styles.active : ""}`}
    >
      <Star />
      <p>{text}</p>
    </button>
  );
};

const Star = () => {
  return (
    <svg
      className={styles.starIcon}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
};

export default ProductReviewFilterBar;
