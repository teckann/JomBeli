'use client';

import React, { useState, useEffect } from 'react';
import styles from './addnewproduct.module.css'
import {getUser} from "@/app/_lib/auth";
import {createClient} from '@supabase/supabase-js';

export default function AddNewProduct () {
    const currentUser = getUser();
    if (!currentUser || !currentUser.id) {
        return <div className = {styles.loading}>Please log in to view reviews</div>
    }

    const [productData, setProductData] = useState ({
        productName: '',
        category: '',
        description: ''
    });


    const [variants, setVariants] = useState ([{
        option: '',
        values: '',
    }])


    const [sku, setSku] = useState ([])

    useEffect (() => {
        const validVariants = variants.filter (v => v.option.trim() !== '' && v.value.trim() !== '')
        if (validVariants.length === 0) {
            setVariants([]);
            return;
        }

       
        const validSKU = validVariants.map (v => v.value.split (',').map (val => val.trim()).filter(Boolean));})

        
}