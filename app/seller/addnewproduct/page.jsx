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

            // make ["red", "1TB"] into "Red-1TB"
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





}