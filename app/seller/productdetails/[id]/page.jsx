import React from 'react';
import { getUser } from "@/app/_lib/auth";
import styles from './productdetails.module.css'; 
import { createClient } from '@supabase/supabase-js';

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



    
  }


}