"use client";

import { useState, useTransition } from "react";
import StarRating from "../StarRating/StarRating";
import { submitReviews } from "@/app/_lib/actions";
import Styles from "./ReviewForm.module.css"; 
import Image from "next/image";

export default function ReviewForm({ ReviewData }) {
  const [isPending, startTransition] = useTransition();

  const orderItems = ReviewData.orderItems;
  const orderId = ReviewData.orderId;
  const userId = ReviewData.userId;

  const [formState, setFormState] = useState(
    orderItems.map((item) => ({
      userId: userId,
      orderId: orderId,
      productId: item.PRODUCT_VARIANTS_T.product_id,
      productName: item.PRODUCT_VARIANTS_T.PRODUCTS_T.product_name,
      rating: 5, 
      comment: "",
      productImage: item.PRODUCT_VARIANTS_T.PRODUCTS_T.product_image_url[0],
      sku: item.PRODUCT_VARIANTS_T.sku
    }))
  );

  const handleItemChange = (index, field, value) => {
    setFormState((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    startTransition(async () => {
      await submitReviews({ reviewsArray: formState });
    });
  };

  if (orderItems.length === 0) {
    return <p>No items found to review for this order.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className={Styles.formWrapper}>
      <h1 className={Styles.title}>Review Order #{orderId}</h1>
      
      {formState.map((item, index) => (
        <div key={index} className={Styles.reviewCard}>
          <h3 className={Styles.productName}>{item.productName}</h3>
          <h3 className={Styles.sku}>{item.sku}</h3>
          <Image className={Styles.productImage} src={item.productImage} width={100} height={100} alt={item.productName}/>
          
          <div className={Styles.ratingSection}>
            <span>Rating:</span>
            <StarRating 
              maxRating={5}
              defaultRating={5}
              size={24}
              onRateChange={(newRating) => handleItemChange(index, "rating", newRating)}
            />
          </div>

          <div className={Styles.commentSection}>
            <label htmlFor={`comment-${index}`}>Comments:</label>
            <textarea
              id={`comment-${index}`}
              rows="3"
              value={item.comment}
              onChange={(e) => handleItemChange(index, "comment", e.target.value)}
              placeholder="Tell us what you think about this product..."
              required
              className={Styles.textarea}
            />
          </div>
        </div>
      ))}

      <button type="submit" disabled={isPending} className={Styles.submitButton}>
        {isPending ? "Submitting..." : "Submit Reviews"}
      </button>
    </form>
  );
}