'use client'; 

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation'; 
import styles from './editproduct.module.css'; 
import { supabase } from '@/app/_lib/supabase'; 

const CATEGORIES = [
    'Devices', 'Audio', 'Charging', 'Accessories', 'Gaming', 
    'Smart Home', 'Fashion', 'Lifestyle', 'Sports', 'Health', 'Office', 'Others'
];

export default function EditProductPage() {
    const searchParams = useSearchParams(); 
    const router = useRouter();
    const productId = searchParams.get('product_id'); 

    const [currentUser, setCurrentUser] = useState(null);    
    const [authLoading, setAuthLoading] = useState(true);    
    const [dataLoading, setDataLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [coreSpec, setCoreSpec] = useState({
        productName: '',
        category: '',
        description: '',
        price: '',
        discount: '' 
    });

    const [existingImages, setExistingImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    
    const [variants, setVariants] = useState([{ option: '', values: '' }]);
    const [combinations, setCombinations] = useState([]);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) setCurrentUser(session.user); 
            setAuthLoading(false); 
        }).catch(() => setAuthLoading(false));

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setCurrentUser(session?.user || null);
        });
        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (!productId || !currentUser) return;

        const fetchProductData = async () => {
            try {
                setDataLoading(true);

                const { data: product, error: prodError } = await supabase
                    .from('PRODUCTS_T')
                    .select('*')
                    .eq('product_id', productId)
                    .single();

                if (prodError) throw prodError;

                setCoreSpec({
                    productName: product.product_name || '',
                    category: product.category || '',
                    description: product.product_description || '',
                    price: product.price?.toString() || '',
                    discount: product.discount?.toString() || ''
                });
                setExistingImages(product.product_image_url || []);

                const { data: options, error: optError } = await supabase
                    .from('PRODUCT_OPTIONS_T')
                    .select(`
                        option_id,
                        option_name,
                        PRODUCT_OPTION_VALUES_T (
                            value_id,
                            option_value
                        )
                    `)
                    .eq('product_id', productId);

                if (optError) throw optError;

                if (options && options.length > 0) {
                    const formattedVariants = options.map(opt => ({
                        option_id: opt.option_id, 
                        option: opt.option_name || '',
                        values: opt.PRODUCT_OPTION_VALUES_T.map(v => v.option_value).join(', '),
                        _rawValues: opt.PRODUCT_OPTION_VALUES_T 
                    }));
                    setVariants(formattedVariants);
                }

                const { data: records, error: varError } = await supabase
                    .from('PRODUCT_VARIANTS_T')
                    .select('*')
                    .eq('product_id', productId);

                if (varError) throw varError;

                if (records && records.length > 0) {
                    setCombinations(records.map(r => ({
                        product_variant_id: r.product_variant_id, 
                        sku: r.sku,
                        price: r.product_variant_price?.toString() || '',
                        stock: r.product_variant_stock?.toString() || '0'
                    })));
                }

            } catch (err) {
                console.error("Fetch pipeline error: ", err);
                alert("Failed to sync structural layouts from database.");
            } finally {
                setDataLoading(false);
            }
        };

        fetchProductData();
    }, [productId, currentUser]);

    const handleAddOption = () => setVariants([...variants, { option: '', values: '' }]);
    
    const handleRemoveOption = (index) => {
        const updated = variants.filter((_, i) => i !== index);
        setVariants(updated.length > 0 ? updated : [{ option: '', values: '' }]);
    };

    const handleVariantChange = (index, field, value) => {
        const updated = [...variants];
        updated[index][field] = value;
        setVariants(updated);
    };

    const handleComboChange = (index, field, value) => {
        const updated = [...combinations];
        updated[index][field] = value;
        setCombinations(updated); 
    };

    const handleImageChange = (e) => e.target.files && setSelectedImages(Array.from(e.target.files));

    const uploadImagesToBucket = async (prodId) => {
        const uploadedUrls = [...existingImages]; 
        for (let i = 0; i < selectedImages.length; i++) {
            const file = selectedImages[i];
            const fileName = `${prodId}-${Date.now()}-${i}.${file.name.split('.').pop()}`;
            const { error } = await supabase.storage.from('products').upload(fileName, file, { upsert: false });
            if (error) throw error; 
            const { data } = supabase.storage.from('products').getPublicUrl(fileName);
            if (data?.publicUrl) uploadedUrls.push(data.publicUrl);
        }
        return uploadedUrls; 
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        if (!currentUser) return alert("Please log in first!");
        setIsSubmitting(true); 

        try {
            const finalUrls = await uploadImagesToBucket(productId);

            const { error: coreErr } = await supabase
                .from('PRODUCTS_T')
                .update({
                    product_name: coreSpec.productName,
                    product_description: coreSpec.description,
                    category: coreSpec.category,
                    price: parseFloat(coreSpec.price) || 0,
                    discount: coreSpec.discount.trim() ? parseFloat(coreSpec.discount) : null,
                    product_image_url: finalUrls 
                })
                .eq('product_id', productId);

            if (coreErr) throw coreErr;

            const optionPromises = variants.map(async (v) => {
                if (!v.option_id) return; 
                return supabase
                    .from('PRODUCT_OPTIONS_T')
                    .update({ option_name: v.option })
                    .eq('option_id', v.option_id);
            });
            await Promise.all(optionPromises);

            const optionValuePromises = [];
            variants.forEach((v) => {
                if (!v._rawValues) return;
                const splitValues = v.values.split(',').map(str => str.trim());
                
                v._rawValues.forEach((raw, idx) => {
                    if (splitValues[idx]) {
                        optionValuePromises.push(
                            supabase
                                .from('PRODUCT_OPTION_VALUES_T')
                                .update({ option_value: splitValues[idx] })
                                .eq('value_id', raw.value_id)
                        );
                    }
                });
            });
            await Promise.all(optionValuePromises);

            const variantPromises = combinations.map(async (combo) => {
                if (!combo.product_variant_id) return;
                return supabase
                    .from('PRODUCT_VARIANTS_T')
                    .update({
                        product_variant_price: parseFloat(combo.price) || 0,
                        product_variant_stock: parseInt(combo.stock, 10) || 0
                    })
                    .eq('product_variant_id', combo.product_variant_id);
            });
            await Promise.all(variantPromises);

            alert('Product has been successfully updated');
            router.back(); 

        } catch (error) {
            console.error(error);
            alert(`Update error context: ${error.message}`);
        } finally {
            setIsSubmitting(false); 
        }
    };

    if (authLoading || dataLoading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Syncing layout from relational schema matrices...</div>;
    }

    return (
        <div className={styles.container}>
            <button type="button" className={styles.backBtn} onClick={() => router.back()}>← Back</button>
            <h1 className={styles.pageTitle}>EDIT PRODUCT</h1>
            
            <form onSubmit={handleSubmit} className={styles.mainForm}>
                
                <section className={styles.card}>
                    <h2>Core Specification</h2>
                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <label>Product Name :</label>
                            <input type="text" value={coreSpec.productName} onChange={(e) => setCoreSpec({...coreSpec, productName: e.target.value})} required />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Category :</label>
                            <select value={coreSpec.category} onChange={(e) => setCoreSpec({...coreSpec, category: e.target.value})} required>
                                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>General Price (RM) :</label>
                            <input type="number" step="0.01" value={coreSpec.price} onChange={(e) => setCoreSpec({...coreSpec, price: e.target.value})} required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Discount Percentage (%) :</label>
                            <input type="number" value={coreSpec.discount} onChange={(e) => setCoreSpec({...coreSpec, discount: e.target.value})} />
                        </div>

                        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                            <label>Append New Images (Optional) :</label>
                            <input type="file" accept="image/*" multiple onChange={handleImageChange} />
                        </div>

                        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                            <label>Description :</label>
                            <textarea rows="4" value={coreSpec.description} onChange={(e) => setCoreSpec({...coreSpec, description: e.target.value})} required />
                        </div>
                    </div>
                </section>

                <section className={styles.card}>
                    <h2>Product Variants</h2> 
                    {variants.map((v, idx) => (
                        <div key={idx} className={styles.variantRow}>
                            <div className={styles.inputGroup}>
                                <label>Option :</label>
                                <input type="text" value={v.option} onChange={(e) => handleVariantChange(idx, 'option', e.target.value)} />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Value :</label>
                                <input type="text" value={v.values} onChange={(e) => handleVariantChange(idx, 'values', e.target.value)} />
                            </div>
                            
                        </div>
                    ))}
                </section>

                <section className={styles.card}>
                    <h2>Variant Combinations</h2>
                    <table className={styles.skuTable}>
                        <thead>
                            <tr>
                                <th>SKU</th>
                                <th>Price (RM)</th>
                                <th>Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            {combinations.map((combo, idx) => (
                                <tr key={combo.product_variant_id}>
                                    <td className={styles.skuName}>{combo.sku}</td>
                                    <td><input type="number" step="0.01" value={combo.price} onChange={(e) => handleComboChange(idx, 'price', e.target.value)} required /></td>
                                    <td><input type="number" value={combo.stock} onChange={(e) => handleComboChange(idx, 'stock', e.target.value)} required /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                <div className={styles.bottomActions}>
                    <button type="button" className={styles.cancelBtn} onClick={() => router.back()} disabled={isSubmitting}>Cancel</button>
                    <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                        {isSubmitting ? 'Updating Storage...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}