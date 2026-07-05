import Styles from "./DashboardInfoBar.module.css";
import { getTotalOrdersCount, getAvailableCourierCount, getTotalUsersCount, getAllTimePlatformDeliveryRevenue } from "@/app/_lib/analysis-serives"
import AdminStatCard from "../AdminFinanceOverviewData/OverviewData";

export default async function AdminDashboardInfoBar(){

    const totalUsers = await getTotalUsersCount();
    const totalOrders = await getTotalOrdersCount();
    const availableCouriers = await getAvailableCourierCount();
    const totalDeliveryRevenue = await getAllTimePlatformDeliveryRevenue();

    return (
        <>
            <div className={Styles.upperContainer}>
                <div className={Styles.infoBox}> 
                    <AdminStatCard title="Total Users" value={totalUsers} detailsHref="/admin/ManageUsers"/>
                </div>
                <div className={Styles.infoBox}> 
                    <AdminStatCard title="Total Orders" value={totalOrders} detailsHref="/admin/ManageOrders"/>
                </div>
                <div className={Styles.infoBox}> 
                    <AdminStatCard title="Available Courier" value={availableCouriers} detailsHref="/admin/ManageCouriers"/>
                </div>
                <div className={Styles.infoBox}> 
                    <AdminStatCard title="Platform Total Delivery Revenue" value={totalDeliveryRevenue} isCurrency={true} detailsHref="/admin/ManageFinance"/>
                </div>
            </div>
        </>

    )
}