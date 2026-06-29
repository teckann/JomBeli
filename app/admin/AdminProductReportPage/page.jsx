import Styles from './AdminProductReportPage.module.css';
import { getProductReportData } from '@/app/_lib/data-services';
import AdminReportClient from '@/app/_components/AdminReportClient/AdminReportClient';

export default async function AdminProductReportPage({searchParams}) {

    const resolvedParams = await searchParams;
    const month = resolvedParams?.month ? Number(resolvedParams.month) : "";
    const year = resolvedParams?.year ? String(resolvedParams.year).trim() : "";

    const titles = ["#", "Product ID", "Product Name", "Category", "Seller name", "Created Date"];
    const fields = ["number", "product_id", "product_name", "category", "USERS_T.username", "created_at"];

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 1);

    const {monthlyProducts, total} = await getProductReportData(startDate, endDate);
    
    let categoriesCount = {};

    monthlyProducts.forEach((product) => {
    const category = product.category;

    categoriesCount[category] = (categoriesCount[category] || 0) + 1;
    })

    // change object into key value key and sort them by ascending and get the first
    const mostCategory = Object.entries(categoriesCount).sort((a, b)  => 
    b[1] - a[1])[0][0];

    // add number to monthlyProducts
    monthlyProducts.map((product, index) => {
        product["number"] = index + 1;
        return product;
    })


    return (
        <AdminReportClient month={month} year={year} total={total} monthlyProducts={monthlyProducts} mostCategory={mostCategory} titles={titles} fields={fields} />
    );
}