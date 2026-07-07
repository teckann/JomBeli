import Styles from "./PlatformReports.module.css";
import Link from 'next/link';
import GenerateFinancialReport from "@/app/_components/AdminGenerateFinancialReport/AdminGenerateFinancialReport";

export default async function manageVoucher({ searchParams }) {
    return (  
        <div className={Styles.contentPage}>
            <div className={Styles.upperPart}>
                <div className={Styles.pageDescription}>
                    <h1 className={Styles.header}>Manage Vouchers</h1>
                    <p>Manage All Vouchers Right Now!</p>
                </div>
            </div>
            <div className={Styles.cardBox}>
                <h1 className={Styles.header}>Financial</h1>
                <div className={Styles.cardContainer}>
                    <GenerateFinancialReport />
                </div>
            </div>
            <div className={Styles.cardBox}>
                <h1 className={Styles.header}>Users</h1>
                <div className={Styles.cardContainer}>
                    {/* User report button, similarly dedicated, once I know that endpoint's fields */}
                </div>
            </div>
        </div> 
    )
}