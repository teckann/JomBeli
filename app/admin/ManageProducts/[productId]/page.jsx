import { getProductDetails } from "@/app/_lib/data-services";
import Styles from './productDetails.module.css';
import { getProductSales, getProductReviews } from "@/app/_lib/analysis-serives";
import Image from "next/image";
import AdminItemCard from '@/app/_components/AdminItemCard/AdminItemCard';
import AdminDeactiveProductButton from "@/app/_components/AdminDeactiveProductButton/AdminDeactiveProductButton";
import AdminReactiveProductButton from "@/app/_components/AdminReactiveProductButton/AdminReactiveProductButton";
import AdminTable from '@/app/_components/AdminTable/AdminTable';

export default async function ProductDetails({params}) {
    const resolvedParams = await params;
    const productId = resolvedParams?.productId ? String(resolvedParams.productId).trim() : "";

    const product = await getProductDetails(productId);
    const sales = await getProductSales(productId);
    const reviews = await getProductReviews(productId);

    // data for table
    const titles = ["Review ID", "Reviewer Name", "Comment", "Rating", "Review Date", "status"];
    const actions = [{type: "viewReviewer"}];
    const fields = ["review_id", "USERS_T.username", "comment", "product_rating", "created_at", ""];

    const informationList = [{field: "Product Name", value: product.product_name}, {field: "Description", value: product.product_description},
        {field: "Current Stock", value: product.stock_quantity}, {field: "Normal Price", value: `RM ${product.price}`}, {field: "Discount Rate", value: `${product.discount === null ? "-" : product.discount}`},
        {field: "Available Price", value: (product.price * ((100 - product.discount) / 100))}
    ]


    return (<div className={ Styles.productDetailsPage }>
        <div className={ Styles.upperPart }>
            <div className={ Styles.backButtonPart }>
                <button>back</button>
            </div>
            <div className={ Styles.productDescription }>
                <h1>Product Details</h1>
                <p>View product details here</p>
            </div>
            <AdminItemCard id={productId} name={product.product_name} category={product.product_status} itemStatus={product.product_status} imageUrl={product.product_image_url} />
        </div>
        <div className={ Styles.middlePart }>
            <div className={ Styles.productInformationContainer }>
                <div className={ Styles.informationUpper }>
                    <div className={ Styles.informationLeft }>
                        <ShowItemInformationList itemTitle="Product Information" objectlist={informationList} />
                    </div>
                    <div className={ Styles.informationRight }>
                        <AdminTitle title="Product Related Information" />
                        <div className={ Styles.relatedInformation }>
                            <div>
                                ⭐Rating: {product.overall_product_rating}
                            </div>
                            <div>
                                ⌛Created at: {product.created_at}
                            </div>
                            <div>
                                🧑🏻Created by: {product.USERS_T.username}
                            </div>
                            <div>
                                📜Total Orders: {sales.totalOrders}
                            </div>
                            <div>
                                💵Total Sales: {sales.totalSales}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={ Styles.buttonPart }>
                    {product.product_status === "Active" ? <AdminDeactiveProductButton productId={productId} /> : <AdminReactiveProductButton productId={productId} />}
                </div>
            </div>
        </div>
        <div className={ Styles.bottomPart }>
            <h2>{product.product_name}'s Reviews</h2>
            <AdminTable titles={titles} fields={fields} actions={actions} datas={reviews} dataIdFormat="review_id" />
        </div>
    </div>);
}

export function ShowItemInformationList({ itemTitle, objectlist }) {
    
    return (
        <div className={ Styles.informationListFrame }>
            <AdminTitle title={itemTitle} />
            <div className={ Styles.informationSpace }>
                {objectlist.map((each) => {
                    return <div key={each.field} className={ Styles.informationRow }>
                        <div className={ Styles.informationField }>
                            {each.field}
                        </div>
                        <div className={ Styles.informationMiddleQuote }>:</div>
                        <div className={ Styles.informationValue}>
                            {each.value}
                        </div>
                    </div>
                })}
            </div>
        </div>
    )
}

export function getdataPath(data, path) {
    return path.split(".").reduce((acc, cur) => acc?.[cur], data);
}

export function AdminTitle({title}) {
    return (
        <div className={ Styles.titleBar }>
            <span classname={Styles.titleText}>{title}<hr className={Styles.hrLength} /></span>
        </div>
    )
}