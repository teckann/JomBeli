'use client';

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
            <a 
              href={`/seller/editproduct?product_id=${currentUrlId}`} 
              className={styles.editLink}
            >
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

       

      </main>
    </div>
  );
}