'use client';

import React, {useState, useEffect} from 'react';
import styles from './addnewproduct.module.css'
import {getUser} from "@/app/_lib/auth";
import {createClient} from '@supabase/supabase-js';

export default function AddNewProduct () {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [productData, setProductData] = useState ({
        productName: '',
        category: '',
        description: ''
    });

    const [variants, setVariants] = useState ([{
        option: '',
        values: '',
    }])

    const [sku, setSKU] = useState ([])

    useEffect(() => {
        async function fetchUser() {
            const currentUser = await getUser();
            setUser(currentUser);
            setLoading(false);
        }
        fetchUser();
    }, []);

    useEffect (() => {
        const validVariants = variants.filter (v => v.option.trim() !== '' && v.values.trim() !== '')
        if (validVariants.length === 0) {
            setSKU([]);
            return;
        }

        const validSKU = validVariants.map(v => v.values.split(',').map(val => val.trim()).filter(Boolean));

        if (validSKU.some(layer => layer.length === 0)) {
            setSKU([]);
            return;
        }

        // Cartesian Product (to generate sku)
        const generateCartesian = (arrays) => {
            // reduce = gabung eh function
            // acc = accumulator (edi gabung eh group)
            // curr = current (now gabunging eh)
            
            // S1: first array is [["red", "blue"], {["1TB"]]
            // now the acc still is a empty []
            // now i take a = [] this empty basket
            // and take the "red" and store into a = []
            // "blue also same"
            // so now the acc = [["red"], ["blue"]]

            // S2: next loop ["1TB"]
            // now the acc = [["red"], ["blue"]]
            // use res.push([...a, b]); to push 1TB into each []
            // u will get [["red", "1TB"], ["blue", "1TB"]]
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
            const skuName = combo.join('-'); 

            const existing = sku.find(c => c.sku === skuName);

            return {
                sku: skuName,
                price: existing ? existing.price : '',
                stock: existing ? existing.stock : '',
                imageAddress: existing ? existing.imageAddress : ''
                };
            });

            setSKU(newCombinations);
        }, [variants, sku]);
        const handleAddOption = () => {
            setVariants([...variants, { option: '', values: '' }]);
        };

        const handleRemoveOption = (index) => {
            const updated = variants.filter((_, i) => i !== index);
            setVariants(updated.length > 0 ? updated : [{ option: '', values: '' }]);
        };

        // change data
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

        // delete
        const handleRemoveCombo = (index) => {
            setCombinations(combinations.filter((_, i) => i !== index));
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            
            const payload = {
                ...coreSpec,
                skus: combinations
            };
        };

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
                    <p className={styles.tip}>Tip: Separate multiple values with commas (e.g., Red, Blue, Green)</p>
                    
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

               





               
            </form>
            </div>

            
        );




    }

 