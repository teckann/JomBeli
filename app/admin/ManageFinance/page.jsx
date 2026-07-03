import Styles from "./ManageFinance.module.css";
import NavBar from "@/app/_components/AdminManageFinanceNavBar/AdminManageFinanceNavBar";
import AdminFinanceOverview from "@/app/_components/AdminFinanceOverview/AdminFinanceOverview";
import AdminFinanceTransactionHistory from "@/app/_components/AdminFinanceTransactionHistory/AdminFinanceTransactionHistory";

export default async function manageFinance({ searchParams }) {
    const tabs = await searchParams;
    const activeTab = tabs.tab || "overview";

    return (
        <div className={Styles.contentPage}>
            <div className={Styles.upperPart}>
                <div className={Styles.pageDescription}>
                    <h1>Manage Finance</h1>
                </div>
            </div>
            <div className={Styles.bodyPage}>
                <NavBar/>
                {activeTab === "overview" && <AdminFinanceOverview></AdminFinanceOverview>}        
                {activeTab === "transactionHistory" && <AdminFinanceTransactionHistory searchParams={tabs}></AdminFinanceTransactionHistory>}      
            </div>
        </div> 
    );
}