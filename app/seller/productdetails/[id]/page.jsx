import React from 'react';
import { getUser } from "@/app/_lib/auth";
import styles from './productdetails.module.css'; 
import { createClient } from '@supabase/supabase-js';
import DynamicProductView from './DynamicProductView.jsx'; 

export default async function ProductDetailPage({ params }) {
  const currentUser = await getUser();
  if (!currentUser?.id) return <div className={styles.loading}>Please log in to view your shop.</div>;

  const resolvedParams = await params;
  const currentUrlId = resolvedParams?.id ? String(resolvedParams.id).trim() : "";

  const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  let product = null, variants = [], latestReview = null, averageRating = "0.0", totalReviews = 0;
  const starCounts = { 5: 0, 4: 0, 3: 0 }; 

  if (currentUrlId) {
    const [productRes, variantsRes] = await Promise.all([
      supabaseAdmin.from('PRODUCTS_T').select('*').eq('product_id', currentUrlId).maybeSingle(),
      supabaseAdmin.from('PRODUCT_VARIANTS_T').select('*').eq('product_id', currentUrlId)
    ]);
    
    product = productRes.data;
    variants = variantsRes.data || [];

    if (product && product.user_id !== currentUser.id) {
      return (
        <div className={styles.container}>
          <main className={styles.main}>
            <div className={styles.topPartWrapper}>
              <div className={styles.topLeftColumn}>
                <a href="/seller/productlisting" className={styles.backBtn} style={{ textDecoration: 'none' }}>← Back to Shop</a>
                <h1 className={styles.productTitle}>ACCESS DENIED</h1>
              </div>
            </div>
            <hr className={styles.divider} />
            <div style={{ textAlign: 'center', padding: '100px 0', color: '#cc0000', fontWeight: 'bold' }}>
              You do not have permission to view or manage this product.
            </div>
          </main>
        </div>
      );
    }

    if (product) {
      try {
        const { data: reviews } = await supabaseAdmin
          .from('REVIEWS_T')
          .select('*')
          .eq('product_id', currentUrlId)
          .order('created_at', { ascending: false });

        if (reviews?.length) {
          totalReviews = reviews.length;
          latestReview = { ...reviews[0] }; 

          let totalStars = 0;
          reviews.forEach(r => {
            const rating = r.rating || r.product_rating || 0;
            totalStars += rating;
            if (starCounts[rating] !== undefined) starCounts[rating]++;
          });
          averageRating = (totalStars / totalReviews).toFixed(1);

          if (latestReview.user_id) {
            const { data: userData } = await supabaseAdmin
              .from('USERS_T') 
              .select('username')
              .eq('user_id', latestReview.user_id)
              .maybeSingle();

            latestReview.reviewer_name = userData?.username || "Anonymous User";
          }
        }
      } catch (err) {
        console.error("Error processing reviews:", err);
      }
    }
  }

  return (
    <DynamicProductView 
      initialProduct={product} 
      variants={variants} 
      currentUrlId={currentUrlId} 
      latestReview={latestReview} 
      averageRating={averageRating}
      totalReviews={totalReviews}
      starCounts={starCounts}
    />
  );
}