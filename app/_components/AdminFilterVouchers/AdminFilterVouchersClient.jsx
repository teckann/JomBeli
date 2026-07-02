'use client'

import Styles from "./AdminFilterVouchers.module.css";
import { useRouter,useSearchParams } from 'next/navigation';
import { AdminAddVoucherForm } from "../AdminAddVouchers/AdminAddVoucherWidget";

export default function FilterVouchers({ type }){

    const router = useRouter();
    const searchParams = useSearchParams();

    const currentVoucherType = searchParams.get("type") || "All";
    const currentVoucherStatus = searchParams.get("status") || "Active";
    const currentVoucher = searchParams.get("voucher") || "";

    const handleChange = (e) => {
        //make a new copy to edit without touching the original
        const params = new URLSearchParams(searchParams.toString());
        //.set() adds the changed name and value user picked 
        params.set(e.target.name, e.target.value);
        //.toString() serializes back to a query string 
        router.push(`?${params.toString()}`);
    } 

    return(
        <div className={Styles.filterBar}>
            <div className={Styles.searchUser}>
                <SearchVoucher className={Styles.searchUser} values={currentVoucher} handleChange={handleChange}/>  
                <AdminAddVoucherForm />
            </div>
            <div className={Styles.roleAndStatus}>
                <SelectType type={type} values={currentVoucherType} handleChange={handleChange}/>
                <SelectStatus values={currentVoucherStatus} handleChange={handleChange}/>
            </div>
        </div>
    )

}

export function SearchVoucher({ handleChange }){
    return(
        <div>
            <input id="voucher" name="voucher" className={Styles.searchVoucherBar} onChange={handleChange} placeholder="Search Voucher by name" type="text"></input>
        </div>
    )
}

export function SelectType({ type,handleChange,values }){
    return(
        <div>
            <label className={Styles.selectText} htmlFor='type'/>
            <select name="type" id="type" className={Styles.typeDropdown} onChange={handleChange} value={values}>
                <option value="All">All</option>
                {type.map((types) => {
                    return <option key={types} value={types}>{types}</option>  
                })}
            </select>
        </div>
    )
}

export function SelectStatus({ handleChange,values }){
    return (
        <div>
            <label className={Styles.selectText} htmlFor='status'/>
            <select name="status" id="status" className={Styles.statusDropdown} onChange={handleChange} value={values}>
                <option value = "All">All</option>
                <option value = "active">Active</option>
                <option value = "inactive">Inactive</option>
            </select>
        </div>
    )
}