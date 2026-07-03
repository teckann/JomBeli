"use client";

import Styles from "./AdminFIlterOrderBars.module.css";

import { useRouter, useSearchParams } from "next/navigation";

export default function FilterBarsContainer({orderStatus}) {

    const router = new useRouter();
    const searchParams = new useSearchParams();

    const currentOrderStatus = searchParams.get("orderStatus") || "All";
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
                <OrderStatusSelect values={currentOrderStatus} categories={orderStatus} handleChange={handleChange} />
                <DateSelect values={currentStatus} handleChange={handleChange} />
            </div>
        </div>
    );
}

export function OrderStatusSelect({categories, handleChange, values}) {
    // centralize control url
    
    return (
        <div className={ Styles.selectBox }>
            <label className={ Styles.selectText } htmlFor="orderStatus">Order Status</label>
            <select className={ Styles.inputs } value={values} name="orderStatus" id="orderStatus" onChange={handleChange}>
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