'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; 
import styles from './editproduct.module.css'; 
import { supabase } from '@/app/_lib/supabase'; 

export default function EditProduct() {
    const searchParams = useSearchParams();
    const productId = searchParams.get('product_id'); 

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Part 1: Core Specification
    const [coreSpec, setCoreSpec] = useState({
        productName: '',
        category: '',
        description: ''
    });

    // Part 2: Product Variants
    const [variants, setVariants] = useState([{ option: '', values: '' }]);

    // Part 3: SKU Combinations
    const [combinations, setCombinations] = useState([]);
    
    // 关键状态：用于控制初始化加载锁
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    // 1. 监听用户登录状态
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) setUser(session.user);
        }).catch(() => {});

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) setUser(session.user);
            else setUser(null);
        });
        return () => subscription.unsubscribe();
    }, []);

    // 2. 🟢 核心逻辑：从 4 张表里把这个商品的所有旧数据捞出来回显
    useEffect(() => {
        if (!productId) return;

        const fetchProductData = async () => {
            try {
                setIsInitialLoading(true);

                // T1: 读核心规格
                const { data: product, error: pErr } = await supabase
                    .from('PRODUCTS_T')
                    .select('*')
                    .eq('product_id', productId)
                    .single();
                if (pErr) throw pErr;

                if (product) {
                    setCoreSpec({
                        productName: product.product_name || '',
                        category: product.category || '',
                        description: product.product_description || ''
                    });
                }

                // T2 & T3: 读 Options 和 Values 并进行【高级防重复归类去重】
                const { data: options, error: oErr } = await supabase
                    .from('PRODUCT_OPTIONS_T')
                    .select(`
                        option_id,
                        option_name,
                        PRODUCT_OPTION_VALUES_T (
                            option_value
                        )
                    `)
                    .eq('product_id', productId);
                if (oErr) throw oErr;

                if (options && options.length > 0) {
                    // ​​✓​​ 核心防脏数据处理：防止数据库内因误操作保存了多个同名 Option 导致页面爆炸
                    const uniqueMap = new Map();
                    
                    options.forEach(opt => {
                        const name = opt.option_name ? opt.option_name.trim() : '';
                        if (!name) return;
                        
                        const currentValues = opt.PRODUCT_OPTION_VALUES_T 
                            ? opt.PRODUCT_OPTION_VALUES_T.map(v => v.option_value.trim()) 
                            : [];
                        
                        if (uniqueMap.has(name)) {
                            // 如果检测到重复的规格项（例如存在两个 Color），合并它们的 values 并过滤掉重名的 value
                            const existingValues = uniqueMap.get(name);
                            const combined = Array.from(new Set([...existingValues, ...currentValues]));
                            uniqueMap.set(name, combined);
                        } else {
                            uniqueMap.set(name, currentValues);
                        }
                    });

                    // 将整合处理完毕的数据重新赋予给状态
                    const loadedVariants = Array.from(uniqueMap.entries()).map(([optionName, valueArray]) => ({
                        option: optionName,
                        values: valueArray.join(', ')
                    }));
                    
                    setVariants(loadedVariants);
                }

                // T4: 读现有的 SKU 组合
                const { data: skus, error: sErr } = await supabase
                    .from('PRODUCT_VARIANTS_T')
                    .select('*')
                    .eq('product_id', productId);
                if (sErr) throw sErr;

                if (skus && skus.length > 0) {
                    const loadedCombos = skus.map(skuRow => ({
                        sku: skuRow.sku,
                        price: skuRow.product_variant_price?.toString() || '',
                        stock: skuRow.product_variant_stock?.toString() || '',
                        imageAddress: skuRow.product_variant_image_url || ''
                    }));
                    setCombinations(loadedCombos);
                }

            } catch (err) {
                console.error("Failed to load product for editing:", err);
                alert("❌ Error loading product data!");
            } finally {
                // 精准延时解除初始化限制锁，保证数据赋值的平稳度
                setTimeout(() => {
                    setIsInitialLoading(false);
                    setLoading(false);
                }, 100); 
            }
        };

        fetchProductData();
    }, [productId]);

    // 3. SKU 自动笛卡尔积生成逻辑
    useEffect(() => {
        // 加载初期拒绝触发笛卡尔积，严防覆盖从数据库捞回的原生 SKU 字段
        if (isInitialLoading || loading) return;

        const validVariants = variants.filter(v => v.option.trim() !== '' && v.values.trim() !== '');
        if (validVariants.length === 0) {
            setCombinations([]);
            return;
        }

        const validSKU = validVariants.map(v => v.values.split(',').map(val => val.trim()).filter(Boolean));
        if (validSKU.some(layer => layer.length === 0)) {
            setCombinations([]);
            return;
        }

        const generateCartesian = (arrays) => {
            return arrays.reduce((acc, curr) => {
                const res = [];
                acc.forEach(a => {
                    curr.forEach(b => { res.push([...a, b]); });
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
    }, [variants, isInitialLoading, loading]);

    // 处理表单输入的辅助函数
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

    // 4. 🟢 核心提交逻辑：EDIT 保存更新
    const handleSubmit = async (e) => {
        e.preventDefault();

        const backupUserId = typeof window !== 'undefined' ? localStorage.getItem('logged_in_user_id') : null;
        const finalUserId = user?.id || backupUserId;

        if (!finalUserId) {
            alert("❌ Please log in first!");
            return;
        }

        if (combinations.length === 0) {
            alert("Please generate at least one valid variant combination!");
            return;
        }

        setIsSubmitting(true);

        try {
            // STEP 1: 更新主表 PRODUCTS_T 
            const { error: productError } = await supabase
                .from('PRODUCTS_T')
                .update({
                    user_id: finalUserId,
                    product_name: coreSpec.productName,
                    product_description: coreSpec.description,
                    category: coreSpec.category,
                    product_image_url: [combinations[0]?.imageAddress].filter(Boolean)
                })
                .eq('product_id', productId);

            if (productError) throw productError;

            // STEP 2 & 3: 清理旧数据并重新落库
            await supabase.from('PRODUCT_VARIANTS_T').delete().eq('product_id', productId);
            
            const { data: oldOptions } = await supabase.from('PRODUCT_OPTIONS_T').select('option_id').eq('product_id', productId);
            if (oldOptions && oldOptions.length > 0) {
                const oldOptionIds = oldOptions.map(o => o.option_id);
                await supabase.from('PRODUCT_OPTION_VALUES_T').delete().in('option_id', oldOptionIds);
                await supabase.from('PRODUCT_OPTIONS_T').delete().eq('product_id', productId);
            }

            const activeVariants = variants.filter(v => v.option.trim() !== '' && v.values.trim() !== '');

            for (const variant of activeVariants) {
                const generatedOptionId = Math.floor(Math.random() * 1000000) + Date.now() + Math.floor(Math.random() * 100);

                const { data: insertedOption, error: optionError } = await supabase
                    .from('PRODUCT_OPTIONS_T')
                    .insert([{
                        option_id: generatedOptionId,
                        product_id: productId,
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

            // STEP 4: 批量保存重构后的新 SKUs 到 PRODUCT_VARIANTS_T
            let baseVariantId = Date.now() + Math.floor(Math.random() * 1000);
            const variantsPayload = combinations.map((combo, idx) => ({
                product_variant_id: baseVariantId + idx,
                product_id: productId,
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

            alert('🎉 Success! Product changes have been successfully updated across all 4 tables!');
            window.history.back();

        } catch (error) {
            console.error("Database update failed:", error);
            alert(`❌ Error updating product: ${error.message || error}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div>Loading product configurations...</div>;

    return (
        <div className={styles.container}>
            <button className={styles.backBtn} onClick={() => window.history.back()}>← Back</button>
            <h1 className={styles.pageTitle}>EDIT PRODUCT</h1>

            <form onSubmit={handleSubmit} className={styles.mainForm}>
                {/* Core Specification */}
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

                {/* Product Variants */}
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

                {/* SKU Combinations Table */}
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
                                    <tr key={`${combo.sku}-${idx}`}>
                                        <td className={styles.skuName}>{combo.sku}</td>
                                        <td>
                                            <input 
                                                type="number" 
                                                step="0.01" 
                                                value={combo.price}
                                                onChange={(e) => handleComboChange(idx, 'price', e.target.value)}
                                                required
                                            />
                                        </td>
                                        <td>
                                            <input 
                                                type="number" 
                                                value={combo.stock}
                                                onChange={(e) => handleComboChange(idx, 'stock', e.target.value)}
                                                required
                                            />
                                        </td>
                                        <td>
                                            <input 
                                                type="text" 
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
                        {isSubmitting ? 'Updating Database...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}