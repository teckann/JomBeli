import Styles from './ManageProducts.module.css';
import { getUser } from '@/app/_lib/auth';
import { getUserInfo } from '@/app/_lib/data-services';
import Link from 'next/link';
import { getTotalProductsCount, getMonthlyProductCreatedCount, getTotalAvailableProductsCount, getTotalCategoryCount } from '@/app/_lib/analysis-serives';
import AdminFilterProductsBar from '@/app/_components/AdminFilterProductsBars/AdminFilterProductsBars';

export default async function manageProductsPage() {

    const user = await getUser();

    return (
        <div className={ Styles.contentPage}>
            <div className={Styles.upperPart}>
                <div className={Styles.pageDescription}>
                    <h1>Manage Products</h1>
                    <p>Manage System Products Right Now!</p>
                </div>
                <div className={Styles.generateReportPart}>
                    <GenerateReportButton />
                </div>
            </div>
            <div className={Styles.productsOverviewContainer}>
                <ProductOverViewBar />
            </div>
            <div className={Styles.showTablePart}>
                <div className={Styles.listingText}>
                    <h2>Product Listing</h2>
                    <p>View and manage system products through this table</p>
                </div>
                <AdminFilterProductsBar />
            </div>
        </div>
    );
}

export function GenerateReportButton() {
    return (
        <button className="btn btn-primary">
            <Link className={ Styles.linkText } href="#">
                Generate Product Report
            </Link>
        </button>
    );
}

export async function ProductOverViewBar() {

    const totalProductsCount = await getTotalProductsCount();
    const monthlyCreatedProductsCount = await getMonthlyProductCreatedCount();
    const totalAvailableProductsCount = await getTotalAvailableProductsCount();
    const totalCategoryCount = await getTotalCategoryCount();

    const overviewData = [
        {title: "Total Products", count: totalProductsCount}, 
        {title: "New Products (Monthly)", count: monthlyCreatedProductsCount},
        {title: "Total Active Products", count: totalAvailableProductsCount},
        {title: "Product Category", count: totalCategoryCount}
    ]

    return (
        <div className={Styles.analyticsBar}>
            <div className={Styles.analyticsBarTitle}>
                <h3>System Product Overview</h3>
            </div>

            <div className={Styles.analyticsBarDatas}>
                {overviewData.map((data) => (
                    <ProductDataAnalyticsComponent key={data.id} title={data.title} count={data.count}  />
                ))}
                
            </div>
        </div>
    );

}

export function ProductDataAnalyticsComponent({title, count}) {
    
    return (
        <div className={Styles.analyticsComponent}>
            <div className={Styles.analyticsTitle}>
                {title}
            </div>
            <div className={Styles.countContainer}>
                <span className={Styles.countWrapper}>
                    {count}
                </span>
            </div>
        </div>
    );
}
