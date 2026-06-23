"use client";

import Styles from "./AdminFilterProductsBars.module.css";

import { useRouter, useSearchParams } from "next/navigation";

export default function FilterBarsContainer({categories}) {

    const router = new useRouter();
    const searchParams = new useSearchParams();

    const currentCategory = searchParams.get("category") || "All";
    const currentStatus = searchParams.get("status") || "Active";


    const handleChange = (e) => {
        const params = new URLSearchParams(searchParams.toString());

        params.set(e.target.name, e.target.value);

        router.push(`?${params.toString()}`);
    }


    return (
        <div className={ Styles.filterBarsContainer }>
            <div>
                <ProductNameInput handleChange={handleChange} />
            </div>
            <div className={ Styles.selectBoxs}>
                <CategorySelect values={currentCategory} categories={categories} handleChange={handleChange} />
                <StatusSelect values={currentStatus} handleChange={handleChange} />
            </div>
        </div>
    );
}

export function CategorySelect({categories, handleChange, values}) {
    // centralize control url
    
    return (
        <div className={ Styles.selectBox }>
            <label className={ Styles.selectText } htmlFor="category">Category</label>
            <select className={ Styles.inputs } value={values} name="category" id="category" onChange={handleChange}>
                <option value="All">All</option>
                {categories.map((category) => {
                    return <option key={category} value={category} >{category}</option>
                })}
            </select>
        </div>
    );
}

export function StatusSelect({handleChange, values}) {

    return (
        <div className={ Styles.selectBox }>
            <label className={ Styles.selectText } htmlFor="status" >Status</label>
            <select className={ Styles.inputs } value={values} onChange={handleChange} name="status" id="status">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
            </select>
        </div>
    )
}

export function ProductNameInput({handleChange}) {

    return (
        <div>
            <input className={ Styles.inputs } name="productName" type="text" placeholder="Search by Product Name" onChange={handleChange} />
        </div>
    );
}