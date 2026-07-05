"use client";

import Styles from "./AdminFilterSupportBars.module.css";

import { useRouter, useSearchParams } from "next/navigation";

export default function FilterBarsContainer({supportType, supportStatus}) {

    const router = new useRouter();
    const searchParams = new useSearchParams();

    const currentSupportType = searchParams.get("supportType") || "All";
    const currentSupportStatus = searchParams.get("supportStatus") || "All";
    const currentStatus = searchParams.get("date") || true;


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
                <SupportTypeSelect values={currentSupportType} categories={supportType} handleChange={handleChange} />
                <SupportStatusSelect values={currentSupportStatus} categories={supportStatus} handleChange={handleChange} />
                <DateSelect values={currentStatus} handleChange={handleChange} />
            </div>
        </div>
    );
}

export function SupportTypeSelect({categories, handleChange, values}) {
    // centralize control url
    
    return (
        <div className={ Styles.selectBox }>
            <label className={ Styles.selectText } htmlFor="supportType">Support Status</label>
            <select className={ Styles.inputs } value={values} name="supportType" id="supportType" onChange={handleChange}>
                <option value="All">All</option>
                {categories.map((category) => {
                    return <option key={category} value={category} >{category}</option>
                })}
            </select>
        </div>
    );
}

export function SupportStatusSelect({categories, handleChange, values}) {
    // centralize control url
    
    return (
        <div className={ Styles.selectBox }>
            <label className={ Styles.selectText } htmlFor="supportStatus">Support Status</label>
            <select className={ Styles.inputs } value={values} name="supportStatus" id="supportStatus" onChange={handleChange}>
                <option value="All">All</option>
                {categories.map((category) => {
                    return <option key={category} value={category} >{category}</option>
                })}
            </select>
        </div>
    );
}

export function DateSelect({handleChange, values}) {

    return (
        <div className={ Styles.selectBox }>
            <label className={ Styles.selectText } htmlFor="date" >Status</label>
            <select className={ Styles.inputs } value={values} onChange={handleChange} name="date" id="date">
                <option value="true">Latest</option>
                <option value="false">Oldest</option>
            </select>
        </div>
    )
}

// export function ProductNameInput({handleChange}) {

//     return (
//         <div>
//             <input className={ Styles.inputs } name="productName" type="text" placeholder="Search by Product Name" onChange={handleChange} />
//         </div>
//     );
// }