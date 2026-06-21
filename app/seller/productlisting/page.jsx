import React from 'react';
import styles from './productlisting.module.css'; 
import Image from 'next/image';
import Navbar from '@/app/_components/SellerNavBar/SellerNavBar.jsx';
import Link from 'next/link';

export default function ProductListingPage() {
    // Sample data oni will change ltr 
    const products = [
        { id: 1, name: "Product name", price: "RM2999.90", category: "Category" },
        { id: 2, name: "Product name", price: "RM2908.90", category: "Category" },
        { id: 3, name: "Product name", price: "RM3939.00", category: "Category" },
        { id: 4, name: "Product name", price: "RM2999.90", category: "Category" },
        { id: 5, name: "Product name", price: "RM2908.90", category: "Category" },
        { id: 6, name: "Product name", price: "RM3939.00", category: "Category" },
    ];

  return (
    <div className={styles.container}>
        <Navbar />

        <main className={styles.main}>
            {/* Seller Info*/}
            <section className={styles.shopHeader}>

            <div className={styles.shopAvatar}></div>
            <div className={styles.shopInfo}>
                <h1 className={styles.shopNameRow}>
                Shop name <span className={styles.shopRating}>★ Shop Rating</span>
                </h1>
                <div>
                    <p className={styles.shopDescription}>Discover the latest in tech innovation at JomBeli Gadgets. We specialize in high-performance electronics, smart mobile accessories, premium audio devices, and trending lifestyle gadgets. Driven by a passion for quality and authentic products, we provide tech lovers with reliable devices that seamlessly blend style and functionality. Enjoy secure checkout, fast shipping, and top-tier customer support. Upgrade your tech game with JomBeli now!</p>
                </div>
            </div>
            </section>

            <div className={styles.searchBarRow}>
            <input 
                type="text" 
                placeholder="Search..." 
                className={styles.searchInput}
            />
            <div className={styles.actionButtons}>
                <button className="btn btn-outline">Manage Category</button>
                <button className="btn btn-primary">Add New Product</button>
            </div>
            </div>

            <hr className={styles.divider} />
            <div className={styles.contentLayout}>
            <aside className={styles.sidebar}>
                <div>
                <h2 className={styles.sidebarTitle}>TRENDING PRODUCTS</h2>
                <p className={styles.sidebarDesc}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                </p>
                </div>
                <div>
                <h2 className={styles.sidebarTitle}>PHONE</h2>
                <p className={styles.sidebarDesc}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                </p>
                </div>
            </aside>

            <div className={styles.productGrid}>
                {products.map((product) => (
                <div key={product.id} className={styles.productCard}>
                    <span className={styles.categoryTag}>{product.category}</span>
                    
                    <div className={styles.imagePlaceholder}></div>
                    
                    <div className={styles.cardFooter}>
                    <div>
                        <h3 className={styles.productName}>{product.name}</h3>
                        <p className={styles.productPrice}>{product.price}</p>
                    </div>
                    <button className="btn btn-ghost" style={{ padding: '2px 8px' }}>View</button>
                    </div>
                </div>
                ))}
            </div>

            </div>
        </main>

        </div>
    );
    }