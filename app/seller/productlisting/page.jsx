import React from 'react';
import { getUser } from "@/app/_lib/auth";
import styles from './productlisting.module.css'; 
import { supabase } from "@/app/_lib/supabase";
import { getProducts } from "@/app/_lib/data-services";
import Link from 'next/link';

export default async function ProductListingPage() {
    const currentUser = await getUser();
    if (!currentUser || !currentUser.id) {
        return <div className={styles.loading}>Please log in to view your shop.</div>;
    }
    const loggedInUserId = currentUser.id;
    
    const products = await getProducts(loggedInUserId);
    const { data: sellerData, error: userError } = await supabase
        .from('USERS_T')
        .select('username, avatar')
        .eq('user_id', loggedInUserId)
        .maybeSingle(); 

    if (userError) {
        console.error("[Next.js] Failed to fetch data from USERS_T table:", userError.message);
    }

    const shopName = sellerData?.username || currentUser.email || "My Store";
    const displayProducts = (products || []).filter(
        (product) => product.product_status === 'Active'
    );

    const categoriesMap = displayProducts.reduce((acc, product) => {
        const catName = product.category || 'General';
        if (!acc[catName]) {
            acc[catName] = [];
        }
        acc[catName].push(product);
        return acc;
    }, {});

    const categoryList = Object.keys(categoriesMap);

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                    <section className={styles.shopHeader}>
                    <div className={styles.shopAvatarContainer}>
                        <img src={sellerData.avatar} alt={shopName} className={styles.shopAvatarImg} />
                    </div>

                    <div className={styles.shopInfo}>
                      
                        <div className={styles.shopDescription}>
                            <h2>Welcome to {shopName}</h2> 
                            <div>Every item in this collection represents our commitment to excellence. 
                            We source only premium-grade products to ensure maximum reliability and satisfaction. 
                            Explore a curated world crafted exclusively to elevate your lifestyle, with inventory synchronized live.</div>
                        </div>
                    </div>
                </section>

                <div className={styles.actionButtons}>
                    <Link href="/seller/addnewproduct" passHref>
                        <button className="btn btn-primary" style={{ color: '#ffffff' }}>
                            Add New Product
                            </button>
                    </Link>
                    </div>
                                    
                <hr className={styles.divider} />
                
                {categoryList.length > 0 ? (
                    categoryList.map((categoryName) => {
                        const categoryProducts = categoriesMap[categoryName];

                        return (
                            <div key={categoryName} className={styles.categoryBlock}>
                                <aside className={styles.sidebar}>
                                    <h2 className={styles.sidebarTitle}>{categoryName.toUpperCase()}</h2>
                                    <p className={styles.sidebarDesc}>
                                        Explore our top collection of {categoryName.toUpperCase()} updated live. Quality guaranteed.
                                    </p>
                                </aside>

                                <div className={styles.productGrid}>
                                    {categoryProducts.map((product) => {
                                        const hasImage = product.product_image_url && product.product_image_url.length > 0;
                                        const mainImage = hasImage ? product.product_image_url[0] : null;

                                        return (
                                            <div key={product.product_id} className={styles.productCard}>
                                                <span className={styles.categoryTag}>{product.category || 'General'}</span>
                                                
                                                <div className={styles.imagePlaceholder}>
                                                    {mainImage ? (
                                                        <img src={mainImage} alt={product.product_name} />
                                                    ) : (
                                                        <div className={styles.noImageText}>No Image</div>
                                                    )}
                                                </div>
                                                
                                                <div className={styles.cardFooter}>
                                                    <div className={styles.productMeta}>
                                                        <h3 className={styles.productName}>{product.product_name}</h3>
                                                        <p className={styles.productPrice}>
                                                            RM{product.price ? Number(product.price).toFixed(2) : "0.00"}
                                                        </p>
                                                    </div>
                                                    
                                                    <Link 
                                                        href={`/seller/productdetails/${product.product_id}`} 
                                                        className="btn btn-ghost" 
                                                        style={{ padding: '2px 8px', textDecoration: 'none' }}
                                                    >
                                                        View
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className={styles.noProducts}>No products found.</div>
                )}
            </main>
        </div>
    );
}