import React from 'react';
import { getUser } from "@/app/_lib/auth";
import { createClient } from '@supabase/supabase-js';
import styles from './productreviews.module.css';

export default async function ReviewsPage({ searchParams }) {
  const currentUser = await getUser();
  if (!currentUser || !currentUser.id) {
    return <div className={styles.loading}>Please log in to view reviews.</div>;
  }

  const resolvedSearchParams = await searchParams;
  const productId = resolvedSearchParams?.product_id ? String(resolvedSearchParams.product_id).trim() : "";

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  let reviewsList = [];
  let summaryStats = {
    average: "0.0",
    totalCount: 0,
    starsBreakdown: { 5: "0%", 4: "0%", 3: "0%", 2: "0%", 1: "0%" }
  };

  if (productId) {
    try {
      const { data: variants } = await supabaseAdmin
        .from('PRODUCT_VARIANTS_T')
        .select('product_variant_id')
        .eq('product_id', productId);

      if (variants && variants.length > 0) {
        const variantIds = variants.map(v => v.product_variant_id).filter(Boolean);

        const { data: orderItems } = await supabaseAdmin
          .from('ORDER_ITEMS_T')
          .select('order_id')
          .in('product_variant_id', variantIds);

        if (orderItems && orderItems.length > 0) {
          const orderIds = Array.from(new Set(orderItems.map(item => item.order_id).filter(Boolean)));

          if (orderIds.length > 0) {
            const { data: dbReviews } = await supabaseAdmin
              .from('REVIEWS_T')
              .select('*')
              .in('order_id', orderIds)
              .order('created_at', { ascending: false });

            if (dbReviews && dbReviews.length > 0) {
              const userIds = Array.from(new Set(dbReviews.map(r => r.user_id).filter(Boolean)));
              let userMap = {};

              if (userIds.length > 0) {
                const { data: users } = await supabaseAdmin
                  .from('USERS_T')
                  .select('user_id, username')
                  .in('user_id', userIds);

                if (users) {
                  users.forEach(u => {
                    userMap[u.user_id] = {
                      username: u.username,

                    };
                  });
                }
              }

              reviewsList = dbReviews.map(r => {
              const userData = userMap[r.user_id];

              return {
                id: r.review_id,
                orderId: r.order_id,
                user: userData?.username || "Anonymous User", 
                avatarUrl: userData?.avatarUrl || null, 
                rating: Number(r.product_rating).toFixed(1),
                date: new Date(r.created_at).toLocaleDateString('en-GB'),
                text: r.comment
              };
            });

              const total = dbReviews.length;
              let sum = 0;
              let counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

              dbReviews.forEach(r => {
                const ratingFloor = Math.floor(r.product_rating);
                sum += Number(r.product_rating);
                if (counts[ratingFloor] !== undefined) {
                  counts[ratingFloor]++;
                } else if (ratingFloor > 5) {
                  counts[5]++; 
                }
              });

              summaryStats.average = (sum / total).toFixed(1);
              summaryStats.totalCount = total;
              summaryStats.starsBreakdown = {
                5: `${Math.round((counts[5] / total) * 100)}%`,
                4: `${Math.round((counts[4] / total) * 100)}%`,
                3: `${Math.round((counts[3] / total) * 100)}%`,
                2: `${Math.round((counts[2] / total) * 100)}%`,
                1: `${Math.round((counts[1] / total) * 100)}%`
              };
            }
          }
        }
      }
    } catch (error) {
      console.error(" Error:", error);
    }
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        
        <div className={styles.topPartWrapper}>
          <div className={styles.topLeftColumn}>
            <a href={`/seller/productdetails/${productId}`} className={styles.backBtnText}>
              ← Back
            </a>
            <h1 className={styles.productTitle}>REVIEWS</h1>
          </div>

          
        </div>

        <hr className={styles.divider} />

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
            {[
              { label: '5 stars', width: summaryStats.starsBreakdown[5] },
              { label: '4 stars', width: summaryStats.starsBreakdown[4] },
              { label: '3 stars', width: summaryStats.starsBreakdown[3] },
              { label: '2 stars', width: summaryStats.starsBreakdown[2] },
              { label: '1 stars', width: summaryStats.starsBreakdown[1] }
            ].map((stat, idx) => (
              <div key={idx} className={styles.statRow}>
                <span className={styles.statLabel}>{stat.label}</span>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: stat.width }}></div>
                </div>
                <span className={styles.percentageText}>{stat.width}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.reviewsList}>
          {reviewsList.length > 0 ? (
            reviewsList.map((review) => (
              <div key={review.id} className={styles.reviewCard}>
                
                <div className={styles.userInfoSide}>
                {review.avatarUrl ? (
                  <img 
                    src={review.avatarUrl} 
                    alt={`${review.user}'s avatar`} 
                    className={styles.userAvatar} 
                  />
                ) : (
                  <div className={styles.userAvatar}></div>
                )}
                
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
                      <button className={styles.deleteBtn} title="Delete Review">delete</button>
                    </div>
                  </div>
                  <p className={styles.commentText}>“{review.text}”</p>
                </div>

              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
              No review records found.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}