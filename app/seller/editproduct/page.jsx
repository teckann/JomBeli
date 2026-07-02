'use client'; 

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation'; 
import styles from './editproduct.module.css'; 
import { supabase } from '@/app/_lib/supabase'; 

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
                            option_value
                        )
                    `)
                    .eq('product_id', productId);

                if (optError) throw optError;

                if (options && options.length > 0) {
                    const formattedVariants = options.map(opt => ({
                        option: opt.option_name,
                        values: opt.PRODUCT_OPTION_VALUES_T.map(v => v.option_value).join(', ')
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
                        sku: r.sku,
                        price: r.product_variant_price?.toString() || '',
                        stock: r.product_variant_stock?.toString() || ''
                    })));
                }

            } catch (err) {
                console.error("Error loading product:", err);
                alert("Failed to load product details.");
            } finally {
                setDataLoading(false);
            }
        };

        fetchProductData();
    }, [productId, currentUser]);

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
                price: existing ? existing.price : coreSpec.price, 
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

    const uploadImagesToBucket = async (prodId) => {
        const uploadedUrls = [...existingImages]; 
        
        for (let i = 0; i < selectedImages.length; i++) {
            const file = selectedImages[i];
            const fileExtension = file.name.split('.').pop();
            const fileName = `${prodId}-${Date.now()}-${i}.${fileExtension}`;

            const { error } = await supabase.storage
                .from('products')
                .upload(fileName, file, { cacheControl: '3600', upsert: false });

            if (error) throw error; 

            const { data: publicUrlData } = supabase.storage
                .from('products') 
                .getPublicUrl(fileName);

            if (publicUrlData?.publicUrl) {
                uploadedUrls.push(publicUrlData.publicUrl);
            }
        }
        return uploadedUrls; 
    };

    const updateCoreProduct = async (imageUrls) => {
        const rawDiscount = coreSpec.discount.trim();
        const finalDiscount = (rawDiscount === '' || rawDiscount === '0') ? null : parseFloat(rawDiscount);
        const finalPrice = parseFloat(coreSpec.price) || 0;

        const { error } = await supabase
            .from('PRODUCTS_T')
            .update({
                product_name: coreSpec.productName,
                product_description: coreSpec.description,
                category: coreSpec.category,
                price: finalPrice,
                discount: finalDiscount,
                product_image_url: imageUrls 
            })
            .eq('product_id', productId);

        if (error) throw error;
    };

    const cleanAndSaveVariants = async () => {
        await supabase.from('PRODUCT_VARIANTS_T').delete().eq('product_id', productId);
        
        const { data: oldOptions } = await supabase
            .from('PRODUCT_OPTIONS_T')
            .select('option_id')
            .eq('product_id', productId);

        if (oldOptions && oldOptions.length > 0) {
            const oldOptionIds = oldOptions.map(o => o.option_id);
            await supabase.from('PRODUCT_OPTION_VALUES_T').delete().in('option_id', oldOptionIds);
        }
        await supabase.from('PRODUCT_OPTIONS_T').delete().eq('product_id', productId);

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

        const baseId = Date.now() + Math.floor(Math.random() * 1000);
        const payload = combinations.map((combo, idx) => ({
            product_variant_id: baseId + idx, 
            product_id: productId,
            sku: combo.sku,
            product_variant_price: parseFloat(combo.price) || 0, 
            product_variant_stock: parseInt(combo.stock, 10) || 0, 
            product_variant_status: 'Active' 
        }));
        
        if (payload.length > 0) {
            const { error } = await supabase.from('PRODUCT_VARIANTS_T').insert(payload);
            if (error) throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        if (!currentUser) return alert("Please log in first!");
        if (combinations.length === 0) return alert("Please create at least one valid variant combination!");

        setIsSubmitting(true); 

        try {
            const finalImageUrls = await uploadImagesToBucket(productId);
            await updateCoreProduct(finalImageUrls);
            await cleanAndSaveVariants();

            alert('Product details have been successfully modified');
            router.back(); 

        } catch (error) {
            console.error("Pipeline updated failed:", error);
            alert(`Error occurred while saving: ${error.message}`);
        } finally {
            setIsSubmitting(false); 
        }
    };

    if (authLoading || dataLoading) {
        return <div style={{ padding: '40px', textAlign: 'center', fontWeight: 'bold', fontSize: '16px' }}>Fetching configuration records from database engine...</div>;
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
                            <label>Append New Images (Optional) :</label>
                            <input type="file" accept="image/*" multiple onChange={handleImageChange} />
                            <small style={{ color: '#555', marginTop: '5px', display: 'block' }}>
                                Existing: {existingImages.length} files | Staged: {selectedImages.length} files
                            </small>
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
                    <button type="button" className={styles.cancelBtn} onClick={() => router.back()} disabled={isSubmitting}>Cancel</button>
                    <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                        {isSubmitting ? 'Updating Storage & Relational Matrices...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}