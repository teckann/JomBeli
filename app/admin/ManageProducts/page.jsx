import Styles from './ManageProducts.module.css';
import { getUser } from '@/app/_lib/auth';
import Link from 'next/link';
import { getTotalProductsCount, getMonthlyProductCreatedCount, getTotalAvailableProductsCount, getTotalCategoryCount, getFilterManageProducts } from '@/app/_lib/analysis-serives';
import AdminFilterProductsBar from '@/app/_components/AdminFilterProductsBars/AdminFilterProductsBars';
import { getYearsMonthsWithNewProduct } from '@/app/_lib/data-services';
import AdminTable from '@/app/_components/AdminTable/AdminTable';
import GenerateReportButton from '@/app/_components/AdminGenerateProductReport/AdminGenerateProductReport';
// import { getUserInfo, deactiveProduct } from '@/app/_lib/data-services';



export default async function manageProductsPage({ searchParams }) {

    const { category, status, productName } = await searchParams;

    const productList = await getFilterManageProducts(category, status, productName);

    const titles = ["Product Id", "Product Name", "Seller Name", "Price (RM)", "Category", "Status"];

    const actions = [{type: "viewProduct"}];
    const fields = ["product_id", "product_name", "USERS_T.username", "price", "category", "product_status"];
    const datas = productList;

    const yearMonthsSelect = await getYearsMonthsWithNewProduct();



    return (
        <div className={ Styles.contentPage}>
            <div className={Styles.upperPart}>
                <div className={Styles.pageDescription}>
                    <h1>Manage Products</h1>
                    <p>Manage System Products Right Now!</p>
                </div>
                <div className={Styles.generateReportPart}>
                    <GenerateReportButton yearMonths={yearMonthsSelect} />
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
                <div>
                    <AdminFilterProductsBar />
                </div>
            </div>
            <div>
                <AdminTable titles={titles} fields={fields} actions={actions} datas={datas} slice={true} dataIdFormat="product_id" />
            </div>
        </div>
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
                    <ProductDataAnalyticsComponent key={data.title} title={data.title} count={data.count}  />
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
