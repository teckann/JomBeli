import Styles from "./ManageVoucher.module.css";
import Link from "next/link";

export default async function manageVoucher({ searchParams }) {
    return (
        <div className={Styles.contentPage}>
            <h1>Financial</h1>
            <div className={Styles.cardRow}>
                <link href="/admin/PlatformReports/Financial/Daily" className={Styles.Card}>Daily Report</link>
                <link href="/admin/PlatformReports/Financial/Monthly/Yearly" className={Styles.Card}></link>
            </div>
            <h1>Users</h1>
            <div className={Styles.cardRow}>
                <link href="/admin/PlatformReports/User/Daily" className={Styles.Card}>Daily Report</link>
                <link href="/admin/PlatformReports/User/Monthly/Yearly" className={Styles.Card}></link>
            </div>
        </div> 
    )
}