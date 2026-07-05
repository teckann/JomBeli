"use client";

import Styles from "./AdminFilterHubs.module.css";

import { useRouter, useSearchParams } from "next/navigation";

export default function FilterBarsContainer({hubStatus}) {

    const router = new useRouter();
    const searchParams = new useSearchParams();

    const currentHubStatus = searchParams.get("hubStatus") || "All";


    const handleChange = (e) => {
        const params = new URLSearchParams(searchParams.toString());

        params.set(e.target.name, e.target.value);

        router.push(`?${params.toString()}`);
    }


    return (
        <div className={ Styles.filterBarsContainer }>
            {/* <div>
                <ProductNameInput handleChange={handleChange} />
            </div> */}
            <div className={ Styles.selectBoxs}>
                <HubStatusSelect values={currentHubStatus} categories={hubStatus} handleChange={handleChange} />
            </div>
        </div>
    );
}

export function HubStatusSelect({categories, handleChange, values}) {
    // centralize control url
    
    return (
        <div className={ Styles.selectBox }>
            <label className={ Styles.selectText } htmlFor="hubStatus">Order Status</label>
            <select className={ Styles.inputs } value={values} name="hubStatus" id="hubStatus" onChange={handleChange}>
                <option value="All">All</option>
                {categories.map((category) => {
                    return <option key={category} value={category} >{category}</option>
                })}
            </select>
        </div>
    );
}