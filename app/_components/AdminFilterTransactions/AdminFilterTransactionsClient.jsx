'use client'

import Styles from "./AdminFilterTransactions.module.css";
import { useRouter,useSearchParams } from 'next/navigation';

export default function FilterTransactions({ type }){

    const router = useRouter();
    const searchParams = useSearchParams();

    const currentDirection = searchParams.get("direction") || "All";
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
                <SelectDirection values={currentDirection} handleChange={handleChange}/>
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

export function SelectDirection({ handleChange,values }){
    return(
        <div>
            <label className={Styles.selectText} htmlFor='direction'/>
            <select name="direction" id="direction" className={Styles.dropdown} onChange={handleChange} value={values}>
                <option value="All">All</option>
                <option value="Credit">Credit</option>
                <option value="Debit">Debit</option>             
            </select>
        </div>
    )
}


