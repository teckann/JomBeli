'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/_lib/supabase'; 
import styles from './SellerProductReviews.module.css';

export default function SellerProductReview({ sellerId }) {
  const [reviewsList, setReviewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summaryStats, setSummaryStats] = useState({
    average: "0.0",
    totalCount: 0,
    starsBreakdown: { 5: "0%", 4: "0%", 3: "0%", 2: "0%", 1: "0%" }
  });

  useEffect(() => {
    async function fetchSellerReviews() {
      if (!sellerId) return;

      try {
        setLoading(true);

        const { data: sellerProducts, error: productError } = await supabase
          .from('PRODUCTS_T')
          .select('product_id')
          .eq('user_id', sellerId);

        if (productError) throw productError;
        const productIds = sellerProducts?.map(p => p.product_id) || [];

        if (productIds.length > 0) {
          const { data: dbReviews, error: reviewError } = await supabase
            .from('REVIEWS_T')
            .select('*')
            .in('product_id', productIds)
            .order('created_at', { ascending: false }); 

          if (reviewError) throw reviewError;

          if (dbReviews?.length) {
            const total = dbReviews.length;
            let sum = 0;
            const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

            const userIds = Array.from(new Set(dbReviews.map(r => r.user_id).filter(Boolean)));
            let userMap = {};

            if (userIds.length > 0) {
              const { data: users } = await supabase
                .from('USERS_T')
                .select('user_id, username')
                .in('user_id', userIds);

              users?.forEach(u => { 
                userMap[u.user_id] = { username: u.username }; 
              });
            }

            const formattedReviews = dbReviews.map(r => {
              const ratingVal = r.product_rating || r.rating || 0;
              const ratingFloor = Math.min(5, Math.max(1, Math.floor(ratingVal)));
              
              sum += Number(ratingVal);
              counts[ratingFloor]++;

              return {
                id: r.review_id,
                orderId: r.order_id,
                user: userMap[r.user_id]?.username || "Anonymous User", 
                rating: Number(ratingVal).toFixed(1),
                date: new Date(r.created_at).toLocaleDateString('en-GB'),
                text: r.comment
              };
            });


            setReviewsList(formattedReviews.slice(0, 2));
            
            setSummaryStats({
              average: (sum / total).toFixed(1),
              totalCount: total,
              starsBreakdown: {
                5: `${Math.round((counts[5] / total) * 100)}%`,
                4: `${Math.round((counts[4] / total) * 100)}%`,
                3: `${Math.round((counts[3] / total) * 100)}%`,
                2: `${Math.round((counts[2] / total) * 100)}%`,
                1: `${Math.round((counts[1] / total) * 100)}%`
              }
            });
          } else {
            setReviewsList([]);
          }
        }
      } catch (error) {
        console.error("Error loading seller reviews:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSellerReviews();
  }, [sellerId]);

  if (!sellerId) return <div className={styles.loading}>Authenticating store session...</div>;
  if (loading) return <div className={styles.loading}>Loading reviews...</div>;

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        

        <section className={styles.summaryCard}>
          <div className={styles.ratingInfo}>
            <div className={styles.bigRatingRow}>
              <span className={styles.ratingBig}>{summaryStats.average}</span>
              <span className={styles.ratingTotal}>/5.0</span>
              <span className={styles.reviewCount}>{summaryStats.totalCount} reviews</span>
            </div>
            <p className={styles.ratingSince}>Real-time verified score</p>
          </div>

          <div className={styles.ratingStats}>
            {[5, 4, 3, 2, 1].map(star => {
              const widthStr = summaryStats.starsBreakdown[star];
              return (
                <div key={star} className={styles.statRow}>
                  <span className={styles.statLabel}>{star} stars</span>
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ width: widthStr }}></div>
                  </div>
                  <span className={styles.percentageText}>{widthStr}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className={styles.reviewsList}>
          {reviewsList.length > 0 ? (
            reviewsList.map((review) => (
              <div key={review.id} className={styles.reviewCard}>
                <div className={styles.userInfoSide}>
                  <div className={styles.userAvatar}></div>
                  <div className={styles.userMeta}>
                    <h3 className={styles.username}>{review.user}</h3> 
                    <p>Review ID: {review.id}</p>
                    <p>Order ID: {review.orderId}</p>
                  </div>
                </div>

                <div className={styles.contentSide}>
                  <div className={styles.contentHeader}>
                    <span className={styles.starRating}>★ {review.rating}</span>
                    <div className={styles.rightActions}>
                      <span className={styles.commentDate}>{review.date}</span>
                     
                    </div>
                  </div>
                  <p className={styles.commentText}>“{review.text}”</p>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
              No review records found for your products.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}