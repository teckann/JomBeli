'use client'; 

import React, { useState, useEffect } from 'react';
import styles from './addnewproduct.module.css'; 
import { supabase } from '@/app/_lib/supabase'; 

export default function AddProductPage() {
 
    const [currentUser, setCurrentUser] = useState(null);    
    const [authLoading, setAuthLoading] = useState(true);    
    const [isSubmitting, setIsSubmitting] = useState(false); 

    const [coreSpec, setCoreSpec] = useState({
        productName: '',
        category: '',
        description: '',
        price: '',
        discount: '' 
    });

    const [selectedImages, setSelectedImages] = useState([]);
    const [variants, setVariants] = useState([{ option: '', values: '' }]);
    const [combinations, setCombinations] = useState([]);


    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setCurrentUser(session.user); 
            }
            setAuthLoading(false); 
        }).catch(() => setAuthLoading(false));

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setCurrentUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, []);


    useEffect(() => {
        const validVariants = variants.filter(v => v.option.trim() !== '' && v.values.trim() !== '');
        if (validVariants.length === 0) {
            setCombinations([]); 
            return;
        }

        const choicesLists = validVariants.map(v => 
            v.values.split(',').map(val => val.trim()).filter(Boolean)
        );

        if (choicesLists.some(list => list.length === 0)) {
            setCombinations([]); 
            return;
        }

        let results = [[]];
        for (let i = 0; i < choicesLists.length; i++) {
            const currentOptions = choicesLists[i]; 
            const nextCombinations = [];

            for (let j = 0; j < results.length; j++) {
                for (let k = 0; k < currentOptions.length; k++) {
                    nextCombinations.push([...results[j], currentOptions[k]]);
                }
            }
            results = nextCombinations; 
        }

        const newCombinations = results.map(comboArray => {
            const skuName = comboArray.join(' * ');
            const existing = combinations.find(c => c.sku === skuName);
            
            return {
                sku: skuName,
                price: existing ? existing.price : '',
                stock: existing ? existing.stock : ''
            };
        });

        setCombinations(newCombinations); 
    }, [variants]);


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

    const handleRemoveCombo = (index) => setCombinations(combinations.filter((_, i) => i !== index));
    const handleImageChange = (e) => e.target.files && setSelectedImages(Array.from(e.target.files));

    const uploadImagesToBucket = async (productId) => {
        const uploadedUrls = []; 
        
        for (let i = 0; i < selectedImages.length; i++) {
            const file = selectedImages[i];
            const fileExtension = file.name.split('.').pop();
            const fileName = `${productId}-${Date.now()}-${i}.${fileExtension}`;

            const { error } = await supabase.storage
                .from('products')
                .upload(fileName, file, { cacheControl: '3600', upsert: false });

            if (error) {
                console.error("error:", error.message);
                throw error; 
            }

            const { data: publicUrlData } = supabase.storage
                .from('products') 
                .getPublicUrl(fileName);

            if (publicUrlData?.publicUrl) {
                uploadedUrls.push(publicUrlData.publicUrl);
            }
        }
        
        return uploadedUrls; 
    };


    const saveCoreProduct = async (productId, imageUrls) => {
        const rawDiscount = coreSpec.discount.trim();
        const finalDiscount = (rawDiscount === '' || rawDiscount === '0') ? null : parseFloat(rawDiscount);
        
        const finalPrice = parseFloat(coreSpec.price) || 0;

        const { data, error } = await supabase
            .from('PRODUCTS_T')
            .insert([{
                product_id: productId, 
                user_id: currentUser.id, 
                product_name: coreSpec.productName,
                product_description: coreSpec.description,
                category: coreSpec.category,
                price: finalPrice,
                discount: finalDiscount,
                product_image_url: imageUrls 
            }])
            .select('product_id') 
            .single();

        if (error) throw error;
        return data?.product_id || productId;
    };

    const saveOptionsAndValues = async (productId) => {
        const activeVariants = variants.filter(v => v.option.trim() !== '' && v.values.trim() !== '');
        for (const variant of activeVariants) {
            const optionId = Math.floor(Math.random() * 100000) + Date.now();
            
            const { error: optionError } = await supabase
                .from('PRODUCT_OPTIONS_T')
                .insert([{ option_id: optionId, product_id: productId, option_name: variant.option.trim() }]);
            if (optionError) throw optionError;

            const valueItems = variant.values.split(',').map(val => val.trim()).filter(Boolean).map((val, idx) => ({
                value_id: Date.now() + Math.floor(Math.random() * 1000) + idx, 
                option_id: optionId,
                option_value: val
            }));
            
            const { error: valuesError } = await supabase.from('PRODUCT_OPTION_VALUES_T').insert(valueItems);
            if (valuesError) throw valuesError;
        }
    };

    const saveVariantCombinations = async (productId) => {
        const baseId = Date.now() + Math.floor(Math.random() * 1000);
        const payload = combinations.map((combo, idx) => ({
            product_variant_id: baseId + idx, 
            product_id: productId,
            sku: combo.sku,
            product_variant_price: parseFloat(combo.price) || 0, 
            product_variant_stock: parseInt(combo.stock, 10) || 0, 
            product_variant_status: 'Active' 
        }));
        
        const { error } = await supabase.from('PRODUCT_VARIANTS_T').insert(payload);
        if (error) throw error;
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        if (!currentUser) {
            alert("Please log in first!");
            return;
        }

        if (selectedImages.length < 2) { return alert("Please select and upload at least 2 product images!"); }
        if (combinations.length === 0) { return alert("Please create at least one valid variant combination!"); }

        setIsSubmitting(true); 

        try {
            const newProductId = Math.floor(Math.random() * 100000) + Date.now(); 

            const imageUrls = await uploadImagesToBucket(newProductId);
            const savedId = await saveCoreProduct(newProductId, imageUrls);
            
            await saveOptionsAndValues(savedId);
            await saveVariantCombinations(savedId);

            alert('New product have been successfully created');
            window.history.back(); 

        } catch (error) {
            console.error("Pipeline breakdown:", error);
            alert(`Error occurred while saving product data: ${error.message}`);
        } finally {
            setIsSubmitting(false); 
        }
    };


    if (authLoading) {
        return <div style={{ padding: '40px', textAlign: 'center', fontWeight: 'bold', fontSize: '16px' }}>Securely syncing your cloud login credentials...</div>;
    }

    return (
        <div className={styles.container}>
            <button type="button" className={styles.backBtn} onClick={() => window.history.back()}>← Back</button>
            <h1 className={styles.pageTitle}>ADD NEW PRODUCT</h1>
            
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
                            <input type="text" value={coreSpec.category} onChange={(e) => setCoreSpec({...coreSpec, category: e.target.value})} required />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>General Price (RM) :</label>
                            <input type="number" step="0.01" min="0" placeholder="e.g., 99.90" value={coreSpec.price} onChange={(e) => setCoreSpec({...coreSpec, price: e.target.value})} required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Discount Percentage (%) :</label>
                            <input type="number" min="0" max="100" placeholder="e.g., 10" value={coreSpec.discount} onChange={(e) => setCoreSpec({...coreSpec, discount: e.target.value})} />
                        </div>

                        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                            <label>Product Images (At least 2) :</label>
                            <input type="file" accept="image/*" multiple onChange={handleImageChange} required />
                            <small style={{ color: '#555', marginTop: '5px', display: 'block' }}>Selected: {selectedImages.length} files</small>
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
                                <input type="text" placeholder="e.g., Color" value={v.option} onChange={(e) => handleVariantChange(idx, 'option', e.target.value)} />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Value :</label>
                                <input type="text" placeholder="e.g., Red, Blue" value={v.values} onChange={(e) => handleVariantChange(idx, 'values', e.target.value)} />
                            </div>
                            <div className={styles.actionBtns}>
                                <button type="button" onClick={handleAddOption} className={styles.iconBtn}>＋</button>
                                <button type="button" onClick={() => handleRemoveOption(idx)} className={styles.iconBtn}>X</button>
                            </div>
                        </div>
                    ))}
                </section>

                <section className={styles.card}>
                    <h2>Variant Combinations</h2>
                    {combinations.length > 0 ? (
                        <table className={styles.skuTable}>
                            <thead>
                                <tr>
                                    <th>SKU</th>
                                    <th>Price (RM)</th>
                                    <th>Stock</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {combinations.map((combo, idx) => (
                                    <tr key={combo.sku}>
                                        <td className={styles.skuName}>{combo.sku}</td>
                                        <td><input type="number" step="0.01" value={combo.price} onChange={(e) => handleComboChange(idx, 'price', e.target.value)} required /></td>
                                        <td><input type="number" value={combo.stock} onChange={(e) => handleComboChange(idx, 'stock', e.target.value)} required /></td>
                                        <td><button type="button" onClick={() => handleRemoveCombo(idx)} className={styles.deleteRowBtn}>X</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className={styles.emptyTablePlaceholder}>Fill in valid Product Variants above to auto-generate combinations.</div>
                    )}
                </section>

                <div className={styles.bottomActions}>
                    <button type="button" className={styles.cancelBtn} onClick={() => window.history.back()} disabled={isSubmitting}>Cancel</button>
                    <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                        {isSubmitting ? 'Uploading Images & Syncing Multitables...' : 'Add New Product'}
                    </button>
                </div>
            </form>
        </div>
    );
}