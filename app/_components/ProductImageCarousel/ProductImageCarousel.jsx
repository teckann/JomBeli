"use client";

import Image from "next/image";
import styles from "./ProductImageCarousel.module.css";
import { useRef, useEffect, useState } from "react";

function ProductImageCarousel({ productImages }) {
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!Array.isArray(productImages) || productImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % productImages.length;

        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            left: nextIndex * scrollRef.current.clientWidth,
            behavior: "smooth",
          });
        }

        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [productImages.length]);

  const handleIndicatorClick = (index) => {
    setCurrentIndex(index);

    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: index * scrollRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={styles.productCarouselArea}>
      <div ref={scrollRef} className={styles.productScroll}>
        {productImages.map((url, index) => (
          <div key={index} className={styles.productItem}>
            <Image
              src={url}
              alt={`Product image ${index + 1}`}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
      </div>

      {productImages.length > 1 && (
        <div className={styles.indicators}>
          {productImages.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${
                index === currentIndex ? styles.active : ""
              }`}
              onClick={() => handleIndicatorClick(index)}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductImageCarousel;
