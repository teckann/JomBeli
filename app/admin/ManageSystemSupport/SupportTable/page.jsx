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