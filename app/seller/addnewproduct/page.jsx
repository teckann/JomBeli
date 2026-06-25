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

        // when seller input price, stock and pic
        const handleComboChange = (index, field, value) => {
            const updated = [...combinations];
            updated[index][field] = value;
            setCombinations(updated);
        };

        // delete
        const handleRemoveCombo = (index) => {
            setCombinations(combinations.filter((_, i) => i !== index));
        };

        // not done yet
        const handleSubmit = async (e) => {
            e.preventDefault();
            
            const payload = {
                ...coreSpec,
                skus: combinations
            };
        };




    }