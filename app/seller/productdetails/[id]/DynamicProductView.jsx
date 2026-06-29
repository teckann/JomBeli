'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import styles from './productdetails.module.css';
import { supabase } from '@/app/_lib/supabase'; 

export default function DynamicProductView({ initialProduct, variants, currentUrlId, latestReview }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false); 

  const [storages, setStorages] = useState([]);
  const [colours, setColours] = useState([]);

  const [selectedStorage, setSelectedStorage] = useState('');
  const [selectedColour, setSelectedColour] = useState('');

  const [currentPrice, setCurrentPrice] = useState(initialProduct?.price || 0);
  const [currentStock, setCurrentStock] = useState(initialProduct?.stock_quantity || 0);
  const [currentImage, setCurrentImage] = useState(
    initialProduct?.product_image_url && initialProduct.product_image_url.length > 0 
      ? initialProduct.product_image_url[0] 
      : null
  );

  const formatDate = (timestampString) => {
    if (!timestampString) return '';
    const date = new Date(timestampString);
    return date.toLocaleDateString('en-GB'); 
  };

  useEffect(() => {
    if (variants && variants.length > 0) {
      const storageSet = new Set();
      const colourSet = new Set();

      variants.forEach(v => {
        if (v.sku && v.sku.includes('*')) {
          const parts = v.sku.split('*');
          const s = parts[0].trim(); 
          const c = parts[1].trim(); 
          storageSet.add(s);
          colourSet.add(c);
        }
      });

      const uniqueStorages = Array.from(storageSet);
      const uniqueColours = Array.from(colourSet);

      setStorages(uniqueStorages);
      setColours(uniqueColours);

      if (variants[0].sku && variants[0].sku.includes('*')) {
        const parts = variants[0].sku.split('*');
        setSelectedStorage(parts[0].trim());
        setSelectedColour(parts[1].trim());
      }
    } else {
      setCurrentStock(initialProduct?.stock_quantity || 0);
    }
  }, [variants, initialProduct]);

  useEffect(() => {
    if (!selectedStorage || !selectedColour || !variants || !variants.length) return;

    const targetSku = `${selectedStorage} * ${selectedColour}`;
    const matchedVariant = variants.find(v => v.sku && v.sku.trim() === targetSku);

    if (matchedVariant) {
      setCurrentPrice(matchedVariant.product_variant_price);
      setCurrentStock(matchedVariant.product_variant_stock);
      if (matchedVariant.product_variant_image_url) {
        setCurrentImage(matchedVariant.product_variant_image_url);
      }
    } else {
      setCurrentPrice(initialProduct?.price || 0);
      setCurrentStock(0);
    }
  }, [selectedStorage, selectedColour, variants, initialProduct]);

  const handleDeleteProduct = async (e) => {
    e.preventDefault(); 

    if (!currentUrlId) {
      alert("Product ID is missing!");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from('PRODUCTS_T')
        .update({ product_status: 'Inactive' })
        .eq('product_id', currentUrlId);

      if (error) throw error;

      alert('Product has been successfully Deleted.');
    
      router.push('/seller/productlisting');
      router.refresh(); 

    } catch (err) {
      console.error("Failed to delete product:", err);
      alert(`Error deleting product: ${err.message || err}`);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!initialProduct) {
    return (
      <div className={styles.container} style={{ textAlign: 'center', padding: '100px 0' }}>
        <h2 style={{ color: '#cc0000' }}>Loading product details securely...</h2>
      </div>
    );
  }

    return (
    <div className={styles.container}>
      <main className={styles.main}>

        <div className={styles.topPartWrapper}>
          <div className={styles.topLeftColumn}>
            <a href="/seller/productlisting" className={styles.backBtn} style={{ textDecoration: 'none' }}>
              ← Back
            </a>
            <h1 className={styles.productTitle}>
              {initialProduct.product_name}
            </h1>
          </div>

          <div className={styles.topRightColumn}>
            <a href={`/seller/editproduct?product_id=${currentUrlId}`} className={styles.editLink}>
              Edit
            </a>
            
            <a 
              href="#" 
              className={styles.deleteLink}
              onClick={handleDeleteProduct}
              style={{
                color: isDeleting ? '#999' : '#dc3545',
                pointerEvents: isDeleting ? 'none' : 'auto',
                fontWeight: 'bold',
                textDecoration: 'underline'
              }}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </a>
            
            <span className={styles.postDate}>Post on: 16 June 2026</span>
          </div>
        </div>
        <hr className={styles.divider} />

        <section className={styles.detailsSection}>
          <div className={styles.imagePlaceholder}>
            {currentImage ? (
              <img 
                src={currentImage} 
                alt={initialProduct.product_name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} 
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>No Image Sync</div>
            )}
          </div>

          <div className={styles.infoTableContainer}>
            <table className={styles.infoTable}>
              <tbody>
                <tr>
                  <td>Product ID</td>
                  <td>{initialProduct.product_id}</td>
                </tr>
                <tr>
                  <td>Category</td>
                  <td>{initialProduct.category || "Phone"}</td>
                </tr>
                <tr>
                  <td className={styles.alignTop}>Description</td>
                  <td>{initialProduct.product_description}</td>
                </tr>
                <tr>
                  <td>Stock</td>
                  <td>{currentStock}</td> 
                </tr>
                <tr>
                  <td>Price</td>
                  <td className={styles.priceHighlight}>
                    RM {typeof currentPrice === 'number' ? currentPrice.toFixed(2) : Number(currentPrice || 0).toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td>Total Sales</td>
                  <td>110</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.bottomSection}>
          <div className={styles.variantsContainer}>
            <h2 className={styles.sectionTitle}>Product Variants</h2>
            
            <div className={styles.variantGroup}>
              <div className={styles.variantLabel}>Storage</div>
              <div className={styles.variantOptions}>
                {storages.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedStorage(size)}
                    className={`${styles.optionTagButton} ${selectedStorage === size ? styles.activeOption : ''}`}
                    type="button"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            <hr className={styles.divider} />
            
            <div className={styles.variantGroup}>
              <div className={styles.variantLabel}>Colour</div>
              <div className={styles.colorOptions}>
                {colours.map((color) => {
                  let colorClass = styles.greyBg;
                  if (color.toLowerCase() === 'black') colorClass = styles.blackBg;
                  if (color.toLowerCase() === 'white') colorClass = styles.whiteBg;

                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColour(color)}
                      className={`${styles.colorBoxButton} ${selectedColour === color ? styles.activeColorBox : ''}`}
                      type="button"
                    >
                      <div className={`${styles.colorPreview} ${colorClass}`}></div>
                      <span>{color}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={styles.reviewsContainer}>
            <div className={styles.reviewHeaderRow}>
              <h2 className={styles.sectionTitle}>Customer Reviews</h2>
              <a href={`/seller/productreviews?product_id=${currentUrlId}`} className={styles.moreLink}>More</a>
            </div>
            <div className={styles.ratingSummaryRow}>
              <div className={styles.bigRating}>
                <span className={styles.ratingNumber}>4.7</span>
                <span className={styles.ratingTotal}>/5.0</span>
                <p className={styles.reviewCount}>128 reviews</p>
              </div>
              <div className={styles.ratingBars}>
                <div className={styles.barItem}>
                  <div className={styles.barTrack}><div className={styles.barFill} style={{width: '80%'}}></div></div>
                  <span className={styles.starNum}>5</span>
                </div>
                <div className={styles.barItem}>
                  <div className={styles.barTrack}><div className={styles.barFill} style={{width: '15%'}}></div></div>
                  <span className={styles.starNum}>4</span>
                </div>
                <div className={styles.barItem}>
                  <div className={styles.barTrack}><div className={styles.barFill} style={{width: '5%'}}></div></div>
                  <span className={styles.starNum}>3</span>
                </div>
              </div>
            </div>

            {latestReview ? (
              <div className={styles.commentCard}>
                <div className={styles.commentMeta}>
                  <span className={styles.commentUser}>
                    {latestReview.reviewer_name || "Anonymous User"}
                    <span style={{ marginLeft: '8px', color: '#e67e22', fontWeight: 'bold' }}>
                      ★ {Number(latestReview.product_rating || 5).toFixed(1)}
                    </span>
                  </span>
                  <span className={styles.commentDate}>
                    {formatDate(latestReview.created_at)}
                  </span>
                </div>
                <p className={styles.commentText}>
                  “{latestReview.comment}”
                </p>
              </div>
            ) : (
              <div className={styles.commentCard} style={{ textAlign: 'center', color: '#999', padding: '30px 0' }}>
                No reviews available for this product yet.
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}