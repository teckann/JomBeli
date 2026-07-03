import Styles from './ManageOrders.module.css';
import { getUser } from '@/app/_lib/auth';
import Link from 'next/link';
import AdminBackButton from '@/app/_components/AdminBackButton/AdminBackButton';
import { getFilterOrders } from '@/app/_lib/analysis-serives';
import AdminFilterOrderBar from '@/app/_components/AdminFIlterOrdersBars/AdminFilterOrderBars';
import AdminTable from '@/app/_components/AdminTable/AdminTable';
// import { getUserInfo, deactiveProduct } from '@/app/_lib/data-services';



export default async function manageProductsPage({ searchParams }) {

    const { date, orderStatus } = await searchParams;

    const orderList = await getFilterOrders(date, orderStatus);

    const titles = ["Order ID", "Seller Name", "Buyer Name", "Total Fee", "Order Date", "Status"];

    const actions = [{type: "viewOrder"}];
    const fields = ["order_id", "seller.username", "buyer.username", "total_amount", "created_at", "order_status"];
    const datas = orderList;

    // const yearMonthsSelect = await getYearsMonthsWithNewProduct();



    return (
        <div className={ Styles.contentPage}>
            <div className={Styles.showTablePart}>
                <div className={Styles.listingText}>
                    <h2>Manage Order</h2>
                    <p>Manage System Order here</p>
                </div>
                <div>
                    <AdminFilterOrderBar />
                </div>
            </div>
            <div>
                <AdminTable titles={titles} fields={fields} actions={actions} datas={datas} slice={false} dataIdFormat="order_id" />
            </div>
        </div>
    );
}