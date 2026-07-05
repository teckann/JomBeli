import AdminTable from "@/app/_components/AdminTable/AdminTable";
import Styles from "./AdminFinanceTransactionHistory.module.css";
import { getFilterTransactions } from "@/app/_lib/analysis-serives";
import { AdminFilterTransactions } from "../AdminFilterTransactions/AdminFilterTransactions";

export default async function AdminFinanceTransactionHistory({ searchParams }){
    const { transaction, direction, transactionStatus } = searchParams;

    const titles = ['User Name','Transaction Type','Direction','Method','Amount','Transaction Status','Made At'];
    
    const fields = ['USERS_T.username','transaction_type','direction','payment_method','amount','wallet_transaction_status','created_at'];
    
    const actions = [{type:"viewTransaction"}]

    const datas = await getFilterTransactions({
        transaction,
        direction,
        transactionStatus
    });
    
    const dataIdFormat = "wallet_transaction_id";

    return (
        <div className={Styles.transactionHistoryPage}>
            <div>
                <AdminFilterTransactions />            
            </div>
            <div>
                <AdminTable titles={titles} fields={fields} datas={datas} actions={actions} slice={true} dataIdFormat={dataIdFormat}></AdminTable>
            </div>
        </div>

    );


}