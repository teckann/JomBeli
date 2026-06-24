import { getProductDetails } from "@/app/_lib/data-services";
import Styles from './productDetails.module.css';
import { getProductSales, getProductReviews } from "@/app/_lib/analysis-serives";
import Image from "next/image";

export default async function ProductDetails({params}) {
    const resolvedParams = await params;
    const productId = resolvedParams?.productId ? String(resolvedParams.productId).trim() : "";

    const product = await getProductDetails(productId);
    const sales = await getProductSales(productId);
    const reviews = await getProductReviews(productId);


    return (<div className={ Styles.productDetailsPage }>
        <div className={ Styles.upperPart }>
            <div className={ Styles.backButtonPart }>
                <button>back</button>
            </div>
            <div className={ Styles.productDescription }>
                <h1>Product Details</h1>
                <p>View product details here</p>
            </div>
            <div className={ Styles.itemCard }>
                <div>
                    <Image className={Styles.itemImage} src={product.product_image_url} alt="Product Image" width={300} height={300} />
                </div>
                <div className={ Styles.cardDescription }>
                    <div>
                        <h3>{product.product_name}</h3>
                    </div>
                    <div className={ Styles.smallDescripOne}>
                        <span className={ Styles.smallDescripDiv }>{productId}</span>
                        <span className={ Styles.smallDescripDiv }>{product.category}</span>
                    </div>
                    <div>
                        <span className={ `${Styles.smallDescripDiv} ${product.product_status === "Active" ? Styles.green : Styles.red}` }>{product.product_status}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>);
}