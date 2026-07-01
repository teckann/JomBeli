import Styles from './RefundsTable.module.css';
import { getUser } from '@/app/_lib/auth';
import Link from 'next/link';
import AdminBackButton from '@/app/_components/AdminBackButton/AdminBackButton';
import { getFilterManageRefunds } from '@/app/_lib/analysis-serives';
import AdminFilterReportsBar from '@/app/_components/AdminFilterRefundsBars/AdminFilterRefundsBars';
import AdminTable from '@/app/_components/AdminTable/AdminTable';
// import { getUserInfo, deactiveProduct } from '@/app/_lib/data-services';



export default async function manageProductsPage({ searchParams }) {

    const { date, adminStatus, sellerStatus } = await searchParams;

    const reportList = await getFilterManageRefunds(date, adminStatus, sellerStatus);

    const titles = ["Refund ID", "Refund Subject", "Buyer Name", "Refund Amounts", "Seller Status", "Admin Status", "Request Date"];

    const actions = [{type: "viewRefund"}];
    const fields = ["refund_id", "refund_subject", "ORDERS_T.buyer.username", "ORDERS_T.total_amount", "seller_status", "admin_status", "created_at"];
    const datas = reportList;

    // const yearMonthsSelect = await getYearsMonthsWithNewProduct();



    return (
        <div className={ Styles.contentPage}>
            <AdminBackButton />
            {/* <div className={Styles.upperPart}>
                <div className={Styles.pageDescription}>
                    <h1>System Refund Table</h1>
                    <p>Manage System Refund here</p>
                </div>
                <div className={Styles.generateReportPart}>
                    <GenerateReportButton yearMonths={yearMonthsSelect} />
                </div>
            </div> */}
            {/* <div className={Styles.productsOverviewContainer}>
                <ProductOverViewBar />
            </div> */}
            <div className={Styles.showTablePart}>
                <div className={Styles.listingText}>
                    <h2>Product Listing</h2>
                    <p>View and manage system products through this table</p>
                </div>
                <div>
                    <AdminFilterReportsBar />
                </div>
            </div>
            <div>
                <AdminTable titles={titles} fields={fields} actions={actions} datas={datas} slice={false} dataIdFormat="report_id" />
            </div>
        </div>
    );
}

// export async function ProductOverViewBar() {

//     const totalProductsCount = await getTotalProductsCount();
//     const monthlyCreatedProductsCount = await getMonthlyProductCreatedCount();
//     const totalAvailableProductsCount = await getTotalAvailableProductsCount();
//     const totalCategoryCount = await getTotalCategoryCount();

//     const overviewData = [
//         {title: "Total Products", count: totalProductsCount}, 
//         {title: "New Products (Monthly)", count: monthlyCreatedProductsCount},
//         {title: "Total Active Products", count: totalAvailableProductsCount},
//         {title: "Product Category", count: totalCategoryCount}
//     ]

//     return (
//         <div className={Styles.analyticsBar}>
//             <div className={Styles.analyticsBarTitle}>
//                 <h3>System Product Overview</h3>
//             </div>

//             <div className={Styles.analyticsBarDatas}>
//                 {overviewData.map((data) => (
//                     <ProductDataAnalyticsComponent key={data.title} title={data.title} count={data.count}  />
//                 ))}
                
//             </div>
//         </div>
//     );

// }

// export function ProductDataAnalyticsComponent({title, count}) {
    
//     return (
//         <div className={Styles.analyticsComponent}>
//             <div className={Styles.analyticsTitle}>
//                 {title}
//             </div>
//             <div className={Styles.countContainer}>
//                 <span className={Styles.countWrapper}>
//                     {count}
//                 </span>
//             </div>
//         </div>
//     );
// }
