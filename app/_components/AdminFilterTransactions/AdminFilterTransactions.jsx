import Styles from './AdminFilterTransactions.module.css';
import { getTransactionInfo } from "@/app/_lib/data-services";
import FilterTransactions from "./AdminFilterTransactionsClient";

export async function AdminFilterTransactions(){

    const transactions = await getTransactionInfo();

    const distinctTransactions = [...new Set(transactions.map((transaction) => transaction.transaction_type))]

    return(
        <div className={Styles.tableRelatedContainer}>
            <div className={Styles.filterRelatedContainer}>
                <FilterTransactions type={distinctTransactions}/>
            </div>
        </div>
    )
}
