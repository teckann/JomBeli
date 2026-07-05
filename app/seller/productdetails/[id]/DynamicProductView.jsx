'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import styles from './productdetails.module.css';
import { supabase } from '@/app/_lib/supabase'; 

export default function DynamicProductView({ 
  initialProduct, 
  variants, 
  currentUrlId, 
  latestReview,
  averageRating = "0.0",
  totalReviews = 0,
  starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  totalSales = 0
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false); 

  const [storages, setStorages] = useState([]);
  const [colours, setColours] = useState([]);
  const [selectedStorage, setSelectedStorage] = useState('');
  const [selectedColour, setSelectedColour] = useState('');

  const productImages = Array.isArray(initialProduct?.product_image_url) 
    ? initialProduct.product_image_url 
    : [];
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [variantImage, setVariantImage] = useState(null);

  const [currentPrice, setCurrentPrice] = useState(initialProduct?.price || 0);
  const [currentStock, setCurrentStock] = useState(initialProduct?.stock_quantity ?? 0);

  const formatDate = (str) => str ? new Date(str).toLocaleDateString('en-GB') : '';

  const handlePrevImage = () => {
    if (productImages.length === 0) return;
    setVariantImage(null); 
    setCurrentImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (productImages.length === 0) return;
    setVariantImage(null); 
    setCurrentImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (!variants?.length) {
      setCurrentStock(initialProduct?.stock_quantity ?? 0);
      setCurrentPrice(initialProduct?.price || 0); 
      return;
    }

    const storageSet = new Set();
    const colourSet = new Set();

    variants.forEach(v => {
      if (v.sku?.includes('*')) {
        const parts = v.sku.split('*').map(p => p.trim());
        let storagePart = parts[0];
        let colourPart = parts[1];

        const colorKeywords = ['black', 'white', 'blue', 'red', 'green', 'grey', 'silver', 'gold', 'purple', 'pink', 'starlight'];
        if (colorKeywords.some(keyword => parts[0].toLowerCase().includes(keyword))) {
          storagePart = parts[1];
          colourPart = parts[0];
        }

        if (storagePart) storageSet.add(storagePart);
        if (colourPart) colourSet.add(colourPart);
      } else if (v.sku) {
        colourSet.add(v.sku.trim());
      }
    });

    const finalStorages = Array.from(storageSet);
    const finalColours = Array.from(colourSet);

    setStorages(finalStorages);
    setColours(finalColours);

    if (finalStorages.length > 0) setSelectedStorage(finalStorages[0]);
    if (finalColours.length > 0) setSelectedColour(finalColours[0]);
  }, [variants, initialProduct]);

  useEffect(() => {
    if (!variants?.length) {
      setCurrentPrice(initialProduct?.price || 0);
      return;
    }

    const matched = variants.find(v => {
      if (!v.sku) return false;
      const skuParts = v.sku.split('*').map(p => p.trim().toLowerCase());
      
      const sLower = selectedStorage.toLowerCase();
      const cLower = selectedColour.toLowerCase();

      if (skuParts.length === 2) {
        return (skuParts.includes(sLower) && skuParts.includes(cLower)) || 
               (skuParts[0] === sLower && !selectedColour) || 
               (skuParts[0] === cLower && !selectedStorage);
      }
      return skuParts[0] === cLower || skuParts[0] === sLower;
    });

    if (matched) {
      setCurrentPrice(matched.product_variant_price ?? initialProduct?.price ?? 0);
      setCurrentStock(matched.product_variant_stock ?? 0);
      if (matched.product_variant_image_url) {
        setVariantImage(matched.product_variant_image_url);
      }
    } else {
      setCurrentPrice(initialProduct?.price || 0);
      setCurrentStock(0);
    }
  }, [selectedStorage, selectedColour, variants, initialProduct]);

  const handleDeleteProduct = async (e) => {
    e.preventDefault(); 
    if (!currentUrlId || !window.confirm("Are you sure you want to delete this product?")) return;

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
      alert(`Error deleting product: ${err.message || err}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const displayImage = variantImage || productImages[currentImageIndex] || null;

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.topPartWrapper}>
          <div className={styles.topLeftColumn}>
            <a href="/seller/productlisting" className={styles.backBtn} style={{ textDecoration: 'none' }}>← Back</a>
            <h1 className={styles.productTitle}>{initialProduct?.product_name}</h1>
          </div>

          <div className={styles.topRightColumn}>
            <a href={`/seller/editproduct?product_id=${currentUrlId}`} className={styles.editLink}>Edit</a>
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
          </div>
        </div>
        <hr className={styles.divider} />

        <section className={styles.detailsSection}>
          <div className={styles.imageGalleryContainer}>
            <div className={styles.imagePlaceholder}>
              {displayImage ? (
                <img 
                  src={displayImage} 
                  alt={initialProduct?.product_name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} 
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>No Image Sync</div>
              )}

              {productImages.length > 1 && !variantImage && (
                <>
                  <button type="button" className={styles.slideBtnLeft} onClick={handlePrevImage}>‹</button>
                  <button type="button" className={styles.slideBtnRight} onClick={handleNextImage}>›</button>
                </>
              )}
            </div>

            {productImages.length > 1 && !variantImage && (
              <div className={styles.carouselDots}>
                {productImages.map((_, idx) => (
                  <span 
                    key={idx} 
                    className={`${styles.dot} ${idx === currentImageIndex ? styles.activeDot : ''}`}
                    onClick={() => setCurrentImageIndex(idx)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className={styles.infoTableContainer}>
            <table className={styles.infoTable}>
              <tbody>
                <tr><td>Product ID</td><td>{initialProduct?.product_id}</td></tr>
                <tr><td>Category</td><td>{initialProduct?.category || "Phone"}</td></tr>
                <tr><td className={styles.alignTop}>Description</td><td>{initialProduct?.product_description}</td></tr>
                <tr><td>Stock</td><td>{currentStock}</td></tr>
                <tr>
                  <td>Price</td>
                  <td className={styles.priceHighlight}>
                    RM {Number(currentPrice || 0).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.bottomSection}>
          <div className={styles.variantsContainer}>
            <h2 className={styles.sectionTitle}>Product Variants</h2>
            
            {storages.length > 0 && (
              <div className={styles.variantGroup}>
                <div className={styles.variantLabel}>Options / Storage</div>
                <div className={styles.variantOptions}>
                  {storages.map(size => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedStorage(size);
                        setVariantImage(null);
                      }}
                      className={`${styles.optionTagButton} ${selectedStorage === size ? styles.activeOption : ''}`}
                      type="button"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {storages.length > 0 && colours.length > 0 && <hr className={styles.divider} />}
            
            {colours.length > 0 && (
              <div className={styles.variantGroup}>
                <div className={styles.variantLabel}>Colour</div>
                <div className={styles.colorOptions}>
                  {colours.map(color => {
                    let colorClass = styles.greyBg;
                    if (color.toLowerCase().includes('black')) colorClass = styles.blackBg;
                    if (color.toLowerCase().includes('white') || color.toLowerCase().includes('starlight')) colorClass = styles.whiteBg;

                    return (
                      <button
                        key={color}
                        onClick={() => {
                          setSelectedColour(color);
                          setVariantImage(null);
                        }}
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
            )}

            {storages.length === 0 && colours.length === 0 && (
              <div style={{ color: '#999', padding: '10px 0' }}>Standard item (No extra configurations)</div>
            )}
          </div>

          <div className={styles.reviewsContainer}>
            <div className={styles.reviewHeaderRow}>
              <h2 className={styles.sectionTitle}>Customer Reviews</h2>
              <a href={`/seller/productreviews?product_id=${currentUrlId}`} className={styles.moreLink}>More</a>
            </div>
            
            <div className={styles.ratingSummaryRow}>
              <div className={styles.bigRating}>
                <span className={styles.ratingNumber}>{averageRating}</span>
                <span className={styles.ratingTotal}>/5.0</span>
                <p className={styles.reviewCount}>{totalReviews} reviews</p>
              </div>
              
              <div className={styles.ratingBars} style={{ width: '100%', minWidth: '200px' }}>
                {[5, 4, 3, 2, 1].map(star => {
                  let count = 0;
                  const currentAvgFloor = Math.floor(parseFloat(averageRating));
                  
                  if (totalReviews === 1 && currentAvgFloor === star) {
                    count = 1;
                  } else if (starCounts) {
                    Object.entries(starCounts).forEach(([key, value]) => {
                      if (Math.floor(parseFloat(key)) === star || Math.round(parseFloat(key)) === star) {
                        count += Number(value) || 0;
                      }
                    });
                  }

                  const percentage = totalReviews > 0 ? `${((count / totalReviews) * 100).toFixed(0)}%` : '0%';
                  
                  return (
                    <div key={star} className={styles.barItem} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px', width: '100%' }}>
                      <div className={styles.barTrack} style={{ flex: 1, backgroundColor: '#eee', height: '8px', borderRadius: '4px', overflow: 'hidden', marginRight: '10px', minWidth: '120px' }}>
                        <div 
                          className={styles.barFill} 
                          style={{ 
                            width: percentage, 
                            backgroundColor: '#ff2323', 
                            height: '100%', 
                            borderRadius: '4px',
                            transition: 'width 0.3s ease'
                          }}
                        ></div>
                      </div>
                      <span className={styles.starNum} style={{ minWidth: '12px', textAlign: 'right' }}>{star}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {latestReview ? (
              <div className={styles.commentCard}>
                <div className={styles.commentMeta}>
                  <span className={styles.commentUser}>
                    {latestReview.reviewer_name || "Anonymous User"}
                    <span style={{ marginLeft: '8px', color: '#e67e22', fontWeight: 'bold' }}>
                      ★ {Number(latestReview.rating || latestReview.product_rating || 5).toFixed(1)}
                    </span>
                  </span>
                  <span className={styles.commentDate}>{formatDate(latestReview.created_at)}</span>
                </div>
                <p className={styles.commentText}>“{latestReview.comment}”</p>
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