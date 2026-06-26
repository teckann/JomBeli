'use client';

import React, {useState, useEffect} from 'react';
import styles from './addnewproduct.module.css';
import { supabase } from '@/app/_lib/supabase'; 

export default function AddNewProduct () {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [coreSpec, setCoreSpec] = useState ({
        productName: '',
        category: '',
        description: ''
    });

    const [variants, setVariants] = useState ([{
        option: '',
        values: '',
    }])

    const [combinations, setCombinations] = useState ([])

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(session.user);
            }
            setLoading(false);
        }).catch(() => setLoading(false));

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser(session.user);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    useEffect (() => {
        const validVariants = variants.filter (v => v.option.trim() !== '' && v.values.trim() !== '')
        if (validVariants.length === 0) {
            setCombinations([]); 
            return;
        }

        const validSKU = validVariants.map(v => v.values.split(',').map(val => val.trim()).filter(Boolean));

        if (validSKU.some(layer => layer.length === 0)) {
            setCombinations([]); 
            return;
        }

        // Cartesian Product (to generate sku)
        const generateCartesian = (arrays) => {
            return arrays.reduce((acc, curr) => {
                const res = [];
                acc.forEach(a => {
                    curr.forEach(b => {
                        res.push([...a, b]);
                    });
                });
                return res;
            }, [[]]);
        };

        const cartesianResults = generateCartesian(validSKU);

        const newCombinations = cartesianResults.map(combo => {
            const skuName = combo.join(' * '); 
            const existing = combinations.find(c => c.sku === skuName);
            
            return {
                sku: skuName,
                price: existing ? existing.price : '',
                stock: existing ? existing.stock : '',
                imageAddress: existing ? existing.imageAddress : ''
            };
        });

        setCombinations(newCombinations); 
    }, [variants]); 

    const handleAddOption = () => {
        setVariants([...variants, { option: '', values: '' }]);
    };

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

    const handleRemoveCombo = (index) => {
        setCombinations(combinations.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const backupUserId = typeof window !== 'undefined' ? localStorage.getItem('logged_in_user_id') : null;
        const finalUserId = user?.id || backupUserId;

        if (!finalUserId) {
            alert(" Cannot save product: Please log in as a seller first so Supabase can verify your account session.");
            return;
        }

        if (combinations.length === 0) {
            alert("Please generate at least one valid variant combination!");
            return;
        }

        setIsSubmitting(true);

        try {
            // save to PRODUCTS_T 
            const generatedProductId = Math.floor(Math.random() * 1000000) + Date.now(); 

            const { data: insertedProduct, error: productError } = await supabase
                .from('PRODUCTS_T')
                .insert([{
                    product_id: generatedProductId, 
                    user_id: finalUserId, 
                    product_name: coreSpec.productName,
                    product_description: coreSpec.description,
                    category: coreSpec.category,
                    product_image_url: [combinations[0]?.imageAddress].filter(Boolean)
                }])
                .select('product_id') 
                .single(); 

            if (productError) throw productError;
            const currentProductId = insertedProduct?.product_id || generatedProductId; 

            // save PRODUCT_OPTIONS_T and PRODUCT_OPTION_VALUES_T
            const activeVariants = variants.filter(v => v.option.trim() !== '' && v.values.trim() !== '');

            for (const variant of activeVariants) {
                const generatedOptionId = Math.floor(Math.random() * 1000000) + Date.now() + Math.floor(Math.random() * 100);

                const { data: insertedOption, error: optionError } = await supabase
                    .from('PRODUCT_OPTIONS_T')
                    .insert([{
                        option_id: generatedOptionId, 
                        product_id: currentProductId,
                        option_name: variant.option.trim()
                    }])
                    .select('option_id')
                    .single();

                if (optionError) throw optionError;
                const currentOptionId = insertedOption?.option_id || generatedOptionId;

                let baseValueId = Date.now() + Math.floor(Math.random() * 500);
                const valueItems = variant.values.split(',')
                    .map(val => val.trim())
                    .filter(Boolean)
                    .map((val, idx) => ({
                        value_id: baseValueId + idx, 
                        option_id: currentOptionId,
                        option_value: val
                    }));

                const { error: valuesError } = await supabase
                    .from('PRODUCT_OPTION_VALUES_T')
                    .insert(valueItems);

                if (valuesError) throw valuesError;
            }

            // PRODUCT_VARIANTS_T table
            let baseVariantId = Date.now() + Math.floor(Math.random() * 1000);
            const variantsPayload = combinations.map((combo, idx) => ({
                product_variant_id: baseVariantId + idx, 
                product_id: currentProductId,
                sku: combo.sku,
                product_variant_price: parseFloat(combo.price), 
                product_variant_stock: parseInt(combo.stock, 10), 
                product_variant_image_url: combo.imageAddress || null,
                product_variant_status: 'Active' 
            }));

            const { error: variantsError } = await supabase
                .from('PRODUCT_VARIANTS_T')
                .insert(variantsPayload);

            if (variantsError) throw variantsError;

            alert('Product have been successfully created');
            window.history.back();

        } catch (error) {
            console.error("Database save failed! Full Error Object:");
            console.dir(error); 
            
            const errorDetails = error && typeof error === 'object' 
                ? JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
                : String(error);

            console.error("Detailed Error String:", errorDetails);
            alert(`Error saving product. Details:\n${error.message || 'Check browser console for full object'}`);
        } finally {
            setIsSubmitting(false); 
        }
    };

    if (loading) return <div>Loading user authentication...</div>;

    return (
        <div className={styles.container}>
            <button className={styles.backBtn} onClick={() => window.history.back()}>← Back</button>
            <h1 className={styles.pageTitle}>ADD NEW PRODUCT</h1>

            <form onSubmit={handleSubmit} className={styles.mainForm}>
                
                <section className={styles.card}>
                    <h2>Core Specification</h2>
                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                        <label>Product Name :</label>
                        <input 
                            type="text" 
                            value={coreSpec.productName}
                            onChange={(e) => setCoreSpec({...coreSpec, productName: e.target.value})}
                            required 
                        />
                        </div>
                        <div className={styles.inputGroup}>
                        <label>Category :</label>
                        <input 
                            type="text" 
                            value={coreSpec.category}
                            onChange={(e) => setCoreSpec({...coreSpec, category: e.target.value})}
                            required 
                        />
                        </div>
                    </div>
                    <div className={styles.inputGroup} style={{ marginTop: '15px' }}>
                        <label>Description :</label>
                        <textarea 
                        rows="4" 
                        value={coreSpec.description}
                        onChange={(e) => setCoreSpec({...coreSpec, description: e.target.value})}
                        required
                        />
                    </div>
                </section>

                <section className={styles.card}>
                    <h2>Product Variants</h2> 
                    {variants.map((v, idx) => (
                        <div key={idx} className={styles.variantRow}>
                        <div className={styles.inputGroup}>
                            <label>Option :</label>
                            <input 
                            type="text" 
                            placeholder="e.g., Color" 
                            value={v.option}
                            onChange={(e) => handleVariantChange(idx, 'option', e.target.value)}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Value :</label>
                            <input 
                            type="text" 
                            placeholder="e.g., Red, Blue" 
                            value={v.values}
                            onChange={(e) => handleVariantChange(idx, 'values', e.target.value)}
                            />
                        </div>
                        <div className={styles.actionBtns}>
                            <button type="button" onClick={handleAddOption} className={styles.iconBtn}>＋</button>
                            <button type="button" onClick={() => handleRemoveOption(idx)} className={styles.iconBtn}>🗑️</button>
                        </div>
                        </div>
                    ))}
                    
                    <button type="button" onClick={handleAddOption} className={styles.addMoreLink}>
                        Add more option
                    </button>
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
                            <th>Image Address</th>
                            <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {combinations.map((combo, idx) => (
                            <tr key={combo.sku}>
                                <td className={styles.skuName}>{combo.sku}</td>
                                <td>
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    placeholder="xx.xx"
                                    value={combo.price}
                                    onChange={(e) => handleComboChange(idx, 'price', e.target.value)}
                                    required
                                />
                                </td>
                                <td>
                                <input 
                                    type="number" 
                                    placeholder="xx"
                                    value={combo.stock}
                                    onChange={(e) => handleComboChange(idx, 'stock', e.target.value)}
                                    required
                                />
                                </td>
                                <td>
                                <input 
                                    type="text" 
                                    placeholder="xx"
                                    value={combo.imageAddress}
                                    onChange={(e) => handleComboChange(idx, 'imageAddress', e.target.value)}
                                />
                                </td>
                                <td>
                                <button type="button" onClick={() => handleRemoveCombo(idx)} className={styles.deleteRowBtn}>
                                    🗑️
                                </button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    ) : (
                        <div className={styles.emptyTablePlaceholder}>
                        Fill in valid Product Variants above to auto-generate combinations.
                        </div>
                    )}
                </section>

                <div className={styles.bottomActions}>
                    <button type="button" className={styles.cancelBtn} onClick={() => window.history.back()} disabled={isSubmitting}>
                        Cancel
                    </button>
                    <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                        {isSubmitting ? 'Saving to Database...' : 'Add New Product'}
                    </button>
                </div>
            </form>
        </div>
    );
}