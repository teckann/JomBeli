import Styles from "./ManageFinance.module.css";
import NavBar from "@/app/_components/AdminManageFinanceNavBar/AdminManageFinanceNavBar";
import AdminFinanceOverview from "@/app/_components/AdminFinanceOverview/AdminFinanceOverview";
import AdminFinanceTransactionHistory from "@/app/_components/AdminFinanceTransactionHistory/AdminFinanceTransactionHistory";
import GenerateFinancialReport from "@/app/_components/AdminGenerateFinancialReport/AdminGenerateFinancialReport";

export default async function manageFinance({ searchParams }) {
    const tabs = await searchParams;
    const activeTab = tabs.tab || "overview";

    return (
        <div className={Styles.contentPage}>
            <div className={Styles.upperPart}>
                <div className={Styles.pageDescription}>
                    <h1>Manage Finance</h1>
                </div> 
                <GenerateFinancialReport/>
            </div>
            <div className={Styles.bodyPage}>
                <NavBar/>
                {activeTab === "financialInformation" && <AdminFinanceOverview></AdminFinanceOverview>}        
                {activeTab === "overview" && <AdminFinanceTransactionHistory searchParams={tabs}></AdminFinanceTransactionHistory>}      
            </div>
        </div> 
    );
}