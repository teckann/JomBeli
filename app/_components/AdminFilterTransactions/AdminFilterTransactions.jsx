import Styles from './AdminFilterTransactions.module.css';
import FilterTransactions from "./AdminFilterTransactionsClient";

export async function AdminFilterTransactions(){
    return(
        <div className={Styles.tableRelatedContainer}>
            <div className={Styles.filterRelatedContainer}>
                <FilterTransactions />
            </div>
        </div>
    )
}
