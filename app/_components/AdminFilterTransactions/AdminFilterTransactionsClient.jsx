'use client'

import Styles from "./AdminFilterTransactions.module.css";
import { useRouter,useSearchParams } from 'next/navigation';

export default function FilterTransactions({ type }){

    const router = useRouter();
    const searchParams = useSearchParams();

    const currentTransactionType = searchParams.get("transactionType") || "All";
    const currentTransactionStatus = searchParams.get("transactionStatus") || "Active";
    const currentTransaction = searchParams.get("transaction") || "";

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
            <div>
                <SearchTransaction values={currentTransaction} handleChange={handleChange}/>  
            </div>
            <div className={Styles.roleAndStatus}>
                <SelectType type={type} values={currentTransactionType} handleChange={handleChange}/>
                {/* <SelectStatus values={currentTransactionStatus} handleChange={handleChange}/> */}
            </div>
        </div>
    )

}

export function SearchTransaction({ handleChange }){
    return(
        <div>
            <input id="transaction" name="transaction" className={Styles.searchTransactionBar} onChange={handleChange} placeholder="Search transaction by username" type="text"></input>
        </div>
    )
}

export function SelectType({ type,handleChange,values }){
    return(
        <div>
            <label className={Styles.selectText} htmlFor='transactionType'/>
            <select name="transactionType" id="transactionType" className={Styles.dropdown} onChange={handleChange} value={values}>
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
            <select name="transactionStatus" id="transactionStatus" className={Styles.dropdown} onChange={handleChange} value={values}>
                <option value = "All">All</option>
                <option value = "Success">Success</option>
                <option value = "Unsuccessful">Unsuccessful</option>
            </select>
        </div>
    )
}

