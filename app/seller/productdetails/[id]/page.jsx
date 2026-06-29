import React from 'react';
import { getUser } from "@/app/_lib/auth";
import styles from './productdetails.module.css'; 
import { createClient } from '@supabase/supabase-js';
import DynamicProductView from './DynamicProductView.jsx'; 

export default async function ProductDetailPage({ params }) {
  const currentUser = await getUser();
  if (!currentUser || !currentUser.id) {
      return <div className={styles.loading}>Please log in to view your shop.</div>;
  }

  const resolvedParams = await params;
  const currentUrlId = resolvedParams?.id ? String(resolvedParams.id).trim() : "";

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  let product = null;
  let variants = [];
  let latestReview = null; 

  if (currentUrlId) {
    const [productRes, variantsRes] = await Promise.all([
      supabaseAdmin
        .from('PRODUCTS_T')
        .select('*')
        .eq('product_id', currentUrlId)
        .maybeSingle(),
      supabaseAdmin
        .from('PRODUCT_VARIANTS_T') 
        .select('*')
        .eq('product_id', currentUrlId)
    ]);
    
    product = productRes.data;
    variants = variantsRes.data || [];

    if (product && variants.length > 0) {
      try {
        const variantIds = variants.map(v => v.product_variant_id).filter(Boolean);

        if (variantIds.length > 0) {
          const { data: orderItems, error: itemsError } = await supabaseAdmin
            .from('ORDER_ITEMS_T') 
            .select('order_id')
            .in('product_variant_id', variantIds);

          if (!itemsError && orderItems && orderItems.length > 0) {
            const orderIds = Array.from(new Set(orderItems.map(item => item.order_id).filter(Boolean)));

            if (orderIds.length > 0) {
              const { data: reviewData, error: reviewError } = await supabaseAdmin
                .from('REVIEWS_T')
                .select('*')
                .in('order_id', orderIds) 
                .order('created_at', { ascending: false }) 
                .limit(1)
                .maybeSingle();

              if (!reviewError && reviewData) {
                latestReview = reviewData;

                if (latestReview.user_id) {
                  const { data: userData, error: userError } = await supabaseAdmin
                    .from('USERS_T') 
                    .select('username')
                    .eq('user_id', latestReview.user_id)
                    .maybeSingle();

                  if (!userError && userData) {
                    latestReview.reviewer_name = userData.username;
                  } else {
                    latestReview.reviewer_name = "Anonymous User";
                  }
                }
              }
            }
          }
        }
      } catch (err) {
        console.error("Error in relational chained query:", err);
      }
    }
  }

  if (!product) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.topPartWrapper}>
            <div className={styles.topLeftColumn}>
              <a href="/seller/productlisting" className={styles.backBtn} style={{ textDecoration: 'none' }}>
                ← Back
              </a>
              <h1 className={styles.productTitle}>PRODUCT NOT FOUND</h1>
            </div>
          </div>
          <hr className={styles.divider} />
          <div style={{ textAlign: 'center', padding: '100px 0', color: '#cc0000', fontWeight: 'bold' }}>
            Product ID: {currentUrlId || 'Undefined'} does not exist or has been deleted from PRODUCTS_T.
          </div>
        </main>
      </div>
    );
  }

  return (
    <DynamicProductView 
      initialProduct={product} 
      variants={variants} 
      currentUrlId={currentUrlId} 
      latestReview={latestReview} 
    />
  );
}