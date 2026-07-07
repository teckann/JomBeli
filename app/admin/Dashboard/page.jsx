import Styles from './AdminDashboard.module.css';
import { getUser } from '@/app/_lib/auth';
import { getUserDetails } from '@/app/_lib/data-services';
import AdminDashboardInfoBar from '@/app/_components/AdminDashboardInfoBar/DashboardInfoBar';
import { AdminOrderStatusChart,AdminTopSellingProductsChart, AdminOrderTrendChart } from '@/app/_components/AdminDashboardCharts/DashboardCharts';
import { getDailyOrderStatusDistribution, getTopSellingProducts, getOrderTrendLast30Days } from '@/app/_lib/analysis-serives';
import ThemeToggle from '@/app/_components/ThemeToggle/ThemeToggle';

export default async function AdminDashboard(){
    const authUser = await getUser();
    const userDetails = await getUserDetails(authUser.id);
    const orderStatusCounts = await getDailyOrderStatusDistribution();
    const topProducts = await getTopSellingProducts(5);
    const trendData = await getOrderTrendLast30Days();

    return (
        <div className = {Styles.contentPage}>
            <div className = {Styles.upperPart}>
                <div className = {Styles.pageDescription}>
                    <h1>Welcome back, admin {userDetails.username}</h1>
                    <p>Track orders, deliveries, and performance here!</p>
                </div>
            </div>
            <div className = {Styles.infoBar}>
                <AdminDashboardInfoBar />
            </div> 
            <div className = {Styles.chartRow}>
                <div className={Styles.chartContainer}>
                    <h3 className={Styles.chartTitle}>Order Status Distribution</h3>
                    <div className={Styles.chartInner}>
                        <AdminOrderStatusChart counts={orderStatusCounts} />
                    </div>
                </div>
                <div className={Styles.chartContainer}>
                    <h3 className={Styles.chartTitle}>Platform Top Selling Products</h3>
                    <div className={Styles.chartInner}>
                        <AdminTopSellingProductsChart products={topProducts}/>
                    </div>
                </div>
            </div>
            <div className = {Styles.chartRow}>
                <div className={Styles.trendChartContainer}>
                    <h3 className={Styles.chartTitle}>Order Trend for last 30 days</h3>
                    <div className={Styles.trendChartInner} >
                        <AdminOrderTrendChart trendData={trendData}/>
                    </div>
                </div>
            </div>
        </div>
    )
}
