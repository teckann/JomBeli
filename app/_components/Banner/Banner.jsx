"use client";

import Image from "next/image";
import styles from "./Banner.module.css";
import { useRef, useEffect, useState } from "react";

function Banner({ banners }) {
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % banners.length;

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
  }, [banners.length]);

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
    <div className={styles.bannerArea}>
      <div ref={scrollRef} className={styles.bannerScroll}>
        {banners.map((banner) => (
          <div key={banner.banner_id} className={styles.bannerItem}>
            <Image
              src={banner.banner_image_url}
              alt="Banner"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
      {banners.length > 1 && (
        <div className={styles.indicators}>
          {banners.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${index === currentIndex ? styles.active : ""
                }`}
              onClick={() => handleIndicatorClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Banner;
