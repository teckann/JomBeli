import { getTransactionDetails } from "@/app/_lib/data-services";
import Styles from "./transactionDetails.module.css";
import BackButton from "@/app/_components/AdminBackButton/AdminBackButton";
import AdminShowInformationList from "@/app/_components/AdminShowInformationList/AdminShowInformationList";

export const revalidate = 0;

export default async function transactionDetail({params}){
    const resolvedParams = await params;
    const transactionId = resolvedParams?.transactionId ? String (resolvedParams.transactionId).trim() : ""

    const transaction = await getTransactionDetails(transactionId);
    const transactionInfo = [
        { field: "Transaction Id", value: transaction.wallet_transaction_id },
        { field: "User Id", value: transaction.user_id },
        { field: "User Name", value: transaction.USERS_T?.username ?? "-" },
        { field: "Transaction Type", value: transaction.transaction_type },
        { field: "Direction", value: transaction.direction },
        { field: "Payment Method", value: transaction.payment_method },
        { field: "Amount", value: transaction.amount },
        { field: "Status", value: transaction.wallet_transaction_status },
        { field: "Made At", value: transaction.created_at },
    ]

    return(
        <div className={Styles.transactionDetailsPage}>
            <div className={Styles.lowerContainer}>
                <div className={Styles.leftSide}>
                    <BackButton />
                    <AdminShowInformationList itemTitle="Transaction details" objectlist={transactionInfo}/>
                </div>
            </div>
        </div>
    )
}


