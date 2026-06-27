import Styles from './AdminProductReportPage.module.css';
import { getProductReportData } from '@/app/_lib/data-services';
import AdminTable from '@/app/_components/AdminTable/AdminTable';
import html2pdf from 'html2pdf.js';

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

    const element = document.querySelector("#tableFrame");


    return (<div id="tableFrame">
        <div>
            <h1>Jombeli Company</h1>
            <h3>Platform Product Review</h3>
            <h3>Report for {month}, {year}</h3>
        </div>
        <div>
            <table>
                <tbody>
                    <tr>
                        <td>Total Product</td>
                        <td>{(total || 0)}</td>
                    </tr>
                    <tr>
                        <td>New Product</td>
                        <td>{monthlyProducts.length}</td>
                    </tr>
                    <tr>
                        <td>Most Popular New Product Category</td>
                        <td>{mostCategory}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <AdminTable titles={titles} fields={fields} datas={monthlyProducts} dataIdFormat="product_id" />
    </div>);
}