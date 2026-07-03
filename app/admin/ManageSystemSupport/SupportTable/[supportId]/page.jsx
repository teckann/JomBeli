import { getSupportDetails } from "@/app/_lib/data-services";
import Styles from './supportDetails.module.css';
import ShowItemInformationList from '@/app/_components/AdminShowInformationList/AdminShowInformationList';
import AdminBackButton from '@/app/_components/AdminBackButton/AdminBackButton';
import AdminRemarks from '@/app/_components/AdminRemarks/AdminRemarks';
import Link from 'next/link';
import { getProductReviews } from '@/app/_lib/data-services';
import AdminDeactivatteUserButton from '@/app/_components/AdminDeactivateUserButton/AdminDeactivateUserButton';
import { getReportedSellerInfo } from '@/app/_lib/analysis-serives';
import AdminSolveSupportButton from "@/app/_components/AdminSolveSupportButton/AdminSolveSupportButton";
import { getUser } from "@/app/_lib/auth";
import AdminDeactiveProductButton from "@/app/_components/AdminDeactiveProductButton/AdminDeactiveProductButton";
import AdminReactiveProductButton from "@/app/_components/AdminReactiveProductButton/AdminReactiveProductButton";

export default async function reportDetails({params}) {
    const resolvedParams = await params;
    const supportId = resolvedParams?.supportId? String(resolvedParams.supportId).trim() : "";

    const {data, sellerReportCount, productReportCount} = await getSupportDetails(supportId);
    const support = data;
    const supportType = support.support_type;

    const requestDate = new Date(support.created_at).getDate() + "/" + (new Date(support.created_at).getMonth() + 1) + "/" + new Date(support.created_at).getFullYear();
    let supportStatusColor = null;
    const supportStatus = support.support_status;

    if (supportStatus === "Pending") {
        supportStatusColor = Styles.yellow;
    }
    else if (supportStatus == "Solved") {
        supportStatusColor = Styles.green;
    }
    else {
        supportStatusColor = Styles.red;
    }

    const differentDay = Math.floor((Date.now() - new Date(support.created_at).getTime()) / (1000 * 60 * 60 * 24));

    let adminEditState = support.support_status === "Pending";

    const isGeneral = !["Report Product", "Report Seller"].includes(support.support_type);
    const isProduct = support.support_type === "Report Product";
    const isSeller = support.support_type === "Report Seller";

    const solvedDate = support.solved_at !== null ? new Date (support.solved_at).getDate() + "/" + (new Date (support.solved_at).getMonth() + 1) + "/" + new Date (support.solved_at).getFullYear() : "-";

    let productRating = "No Review Available";
    if (support.support_type === "Report Product") {
        const reviews = await getProductReviews(support.product.product_id);
        
        if (reviews.length > 0) {
            const sumOfReviews = reviews.reduce((acc, cur) => {
                return acc + Number(cur.product_rating);
            }, 0);
    
            productRating = (sumOfReviews / reviews.length).toFixed(1);
        }
    }

    let reportDurationText = "";
    let handleAdminText = "";
    let handleAdminTextColor = null;

    if (supportStatus === "Pending") {
        reportDurationText = `Reported ${differentDay} days ago`;
        handleAdminText = "Waiting for admin to handle this report";
        handleAdminTextColor = Styles.notAdmin;
    }
    else {
        reportDurationText = `Solved at ${solvedDate}`;
        handleAdminText = `handled by ${support.admin.username}`;
        handleAdminTextColor = Styles.haveAdmin;
    }


    const user = await getUser();

    let sellerTotalProducts = 0;
    let sellerReviews = 0;
    if (support.support_type === "Report Seller") {
        const {totalProducts, reviews} = await getReportedSellerInfo(support.seller.user_id);
        sellerTotalProducts = totalProducts;
        if (reviews && reviews.length > 0) {
            const sumOfReviews = reviews.reduce((acc, cur) => {
                return acc + Number(cur.product_rating);
            }, 0);
    
            sellerReviews = (sumOfReviews / reviews.length).toFixed(1);
        }
    }

    const handleAdmin = support.admin?.user_id ? support.admin.username : "Not handled by admin yet.";

    let productGeneralList1 = [];
    let productGeneralList2 = [];
    let sellerGeneralList1 = [];
    let sellerGeneralList2 = [];
    // product details
    if (isProduct) {
        productGeneralList1 = [{field: "Product Name", value: support.product.product_name}, {field: "Product ID", value: support.product.product_id}, {field: "Category", value: support.product.category}];
        productGeneralList2 = [{field: "Product Status", value: support.product.product_status}, {field: "Seller Name", value: support.product.seller.username}, {field: "Rating", value: productRating}];
    }

    if (isSeller) {
    // seller details
        sellerGeneralList1 = [{field: "Seller ID", value: support.seller.user_id}, {field: "Total Products", value: sellerTotalProducts}, {field: "Register Date", value: requestDate}];
        sellerGeneralList2 = [{field: "Seller Name", value: support.seller.username}, {field: "Rating", value: sellerReviews}, {field: "Seller Status", value: support.seller.user_status}];
    }

    const supportList1 = [{field: "Support ID", value: support.support_id}, {field: "Reporter ID", value: support.reporter.user_id}];
    const supportList2 = [{field: "Report Date", value: requestDate}, {field: "Reporter Name", value: support.reporter.username}];

    // display seller and product reported
    if (isProduct || isSeller) {
        return (<div className={ Styles.refundDetailsPage }>
            <div className={ Styles.upperPart }>
                <div className={ Styles.backButtonPart }>
                    <AdminBackButton />
                </div>
                <div className={ Styles.refundUp}>
                    <div className={ Styles.productDescription }>
                        <h1>Reported {isProduct ? "Product" : "Seller"} Details</h1>
                        <p>Review the details of reporter {isProduct? "Product" : "Seller"}</p>
                    </div>
                    <div className={` ${Styles.refundStatusContainer} ${supportStatusColor}`}>
                        <h2 className={ Styles.refundStatusText }>
                            <span>
                                {support.support_status}
                            </span>
                        </h2>
                    </div>
                </div>
            </div>
            <div className={ Styles.middlePart }>
                <div className={ Styles.specificInformationShow }>
                    
                </div>
                <div className={ Styles.showReportDetails}>
                    <div>
                        <AdminTitle title="Report Details" />
                    </div>
                    <div className={ Styles.generalInformationList }>
                        <ShowItemInformationList objectlist={supportList1} />
                        <ShowItemInformationList objectlist={supportList2} />
                    </div>
                    <div>
                        <div className={ Styles.refundDescription }>
                            <h4>Description</h4>
                            <div className={ Styles.refundDescriptionText }>
                                <p>{support.support_description}</p>
                            </div>
                        </div>
                    </div>
                    <div className={ Styles.generalInformationList }>
                        <ShowItemInformationList objectlist={[{field: "Handle Admin", value: handleAdmin}]} />
                        <ShowItemInformationList objectlist={[{field: "Solved Date", value: solvedDate}]} />
                    </div>
                    <div>
                    </div>
                </div>
                <div className={ Styles.anotherPart }>
                    <div className={ Styles.showNavLink}>
                        <div className={ Styles.navComponent }>
                            <div>
                                <AdminTitle title={`View Reporter ${isProduct ? "Product " : "Seller "}Further`} />
                            </div>
                            <div className={ Styles.navContainer }>
                                {isSeller && <span><Link className={Styles.linkText} href={`/admin/ManageUsers/${support.seller.user_id}`}>Seller Page</Link></span> }
                                {isProduct && <span><Link className={Styles.linkText} href={`/admin/ManageProducts/${support.product.product_id}`}>Product Page</Link></span> }
                                <span><Link className={Styles.linkText} href={`/admin/ManageUsers/${support.reporter.user_id}`}>Reporter Page</Link></span>
                            </div>
                        </div>
                        <div className={ Styles.navComponent }>
                            <div>
                                <AdminTitle title="Contact Info" />
                            </div>
                            <div className={ Styles.navContainer }>
                                <a className={ Styles.linkText } href={`mailto:${support.reporter.email}?subject=${`Inquiry about Report`}`}>
                                    Email Reporter
                                </a>
                                {isSeller && <a className={ Styles.linkText } href={`mailto:${support.seller.email}?subject=${`Inquiry about Report Related To You`}`}>
                                    Email Seller
                                </a> }
                            </div>
                        </div>
                        <AdminRemarks remarks={support.admin_remarks} modifyId={support.support_id} isAbleEdit={adminEditState} remarksFor="support" />
                    </div>
                </div>
                <div className={ Styles.buttonParts }>
                    {(isProduct && support.product.product_status === "Active") && <AdminDeactiveProductButton productId={support.product.product_id} />}
                    {(isProduct && support.product.product_status === "Inactive") && <AdminReactiveProductButton productId={support.product.product_id} />}
                    {isSeller && <AdminDeactivatteUserButton userId={support.seller.user_id} userStatus={support.seller.user_status} />}
                    <AdminSolveSupportButton supportId={support.support_id} adminId={user.id} supportStatus={support.support_status} />
                </div>
            </div>
        </div>);
    }
    return (
        <div className={ Styles.refundDetailsPage }>
            <div className={ Styles.upperPart }>
                <div className={ Styles.backButtonPart }>
                    <AdminBackButton />
                </div>
                <div className={ Styles.refundUp}>
                    <div className={ Styles.productDescription }>
                        <h1>Reported Seller Details</h1>
                        <p>Review the details of reporter {isProduct? "Product" : "Seller"}</p>
                    </div>
                    <div className={` ${Styles.refundStatusContainer} ${supportStatusColor}`}>
                        <h4 className={ Styles.refundStatusText }>
                            <span>
                                {support.support_status}
                            </span>
                        </h4>
                    </div>
                </div>
            </div>
            <div className={ Styles.middlePart }>
                <div className={ Styles.showGeneralInformation }>
                    <h3 className={ Styles.generalInformationTitle }>{supportType}</h3>
                    <p className={ Styles.generalInformationText }>{reportDurationText}</p>
                    <p className={`${handleAdminTextColor} ${ Styles.generalInformationText }`}>{handleAdminText}</p>
                </div>
                <div className={ Styles.showReportDetails}>
                    <div>
                        <AdminTitle title="Report Details" />
                    </div>
                    <div className={ Styles.generalInformationList }>
                        <ShowItemInformationList objectlist={supportList1} />
                        <ShowItemInformationList objectlist={supportList2} />
                    </div>
                    <div>
                        <div className={ Styles.refundDescription }>
                            <h4>Description</h4>
                            <div className={ Styles.refundDescriptionText }>
                                <p>{support.support_description}</p>
                            </div>
                        </div>
                    </div>
                    <div className={ Styles.generalInformationList }>
                        <ShowItemInformationList objectlist={[{field: "Handle Admin", value: handleAdmin}]} />
                        <ShowItemInformationList objectlist={[{field: "Solved Date", value: solvedDate}]} />
                    </div>
                </div>
                <div className={ Styles.anotherPart }>
                    <div className={ Styles.showNavLink}>
                        <div className={ Styles.navComponent }>
                            <div>
                                <AdminTitle title={`View Reporter ${isProduct ? "Product " : "Seller "}Further`} />
                            </div>
                            <div className={ Styles.navContainer }>
                                {isSeller && <span><Link className={Styles.linkText} href={`/admin/ManageUsers/${support.seller.user_id}`}>Seller Page</Link></span> }
                                {isProduct && <span><Link className={Styles.linkText} href={`/admin/ManageProducts/${support.product.product_id}`}>Product Page</Link></span> }
                                <span><Link className={Styles.linkText} href={`/admin/ManageUsers/${support.reporter.user_id}`}>Reporter Page</Link></span>
                            </div>
                        </div>
                        <div className={ Styles.navComponent }>
                            <div>
                                <AdminTitle title="Contact Info" />
                            </div>
                            <div className={ Styles.navContainer }>
                                <a className={ Styles.linkText } href={`mailto:${support.reporter.email}?subject=${`Inquiry about Report`}`}>
                                    Email Reporter
                                </a>
                                {isSeller && <a className={ Styles.linkText } href={`mailto:${support.seller.email}?subject=${`Inquiry about Report Related To You`}`}>
                                    Email Seller
                                </a> }
                            </div>
                        </div>
                    </div>
                    <div>
                        <AdminRemarks remarks={support.admin_remarks} modifyId={support.support_id} isAbleEdit={adminEditState} remarksFor="support" />
                    </div>
                </div>
                <div className={ Styles.buttonParts }>
                    {(isProduct && support.product.product_status === "Active") && <AdminDeactiveProductButton productId={support.product.product_id} />}
                    {(isProduct && support.product.product_status === "Inactive") && <AdminReactiveProductButton productId={support.product.product_id} />}
                    {isSeller && <AdminDeactivatteUserButton userId={support.seller.user_id} userStatus={support.seller.user_status} />}
                    <AdminSolveSupportButton supportId={support.support_id} adminId={user.id} supportStatus={support.support_status} />
                </div>
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