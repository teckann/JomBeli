"use client";

import Styles from "./AdminFilterRefundsBars.module.css";

import { useRouter, useSearchParams } from "next/navigation";

export default function FilterBarsContainer({sellerStatus, adminStatus}) {

    const router = new useRouter();
    const searchParams = new useSearchParams();

    const currentSellerStatus = searchParams.get("sellerStatus") || "All";
    const currentAdminStatus = searchParams.get("adminStatus") || "All";
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
                <SellerCategorySelect values={currentSellerStatus} categories={sellerStatus} handleChange={handleChange} />
                <AdminCategorySelect values={currentAdminStatus} categories={adminStatus} handleChange={handleChange} />
                <DateSelect values={currentStatus} handleChange={handleChange} />
            </div>
        </div>
    );
}

export function SellerCategorySelect({categories, handleChange, values}) {
    // centralize control url
    
    return (
        <div className={ Styles.selectBox }>
            <label className={ Styles.selectText } htmlFor="sellerStatus">Seller Status</label>
            <select className={ Styles.inputs } value={values} name="sellerStatus" id="sellerStatus" onChange={handleChange}>
                <option value="All">All</option>
                {categories.map((category) => {
                    return <option key={category} value={category} >{category}</option>
                })}
            </select>
        </div>
    );
}

export function AdminCategorySelect({categories, handleChange, values}) {
    // centralize control url
    
    return (
        <div className={ Styles.selectBox }>
            <label className={ Styles.selectText } htmlFor="adminStatus">Admin Status</label>
            <select className={ Styles.inputs } value={values} name="adminStatus" id="adminStatus" onChange={handleChange}>
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