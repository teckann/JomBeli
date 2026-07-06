import { getRefundDetails } from "@/app/_lib/data-services";
import Styles from './RefundDetails.module.css';
import AdminTable from '@/app/_components/AdminTable/AdminTable';
import ShowItemInformationList from '@/app/_components/AdminShowInformationList/AdminShowInformationList';
import AdminBackButton from '@/app/_components/AdminBackButton/AdminBackButton';
import EvidencesPhoto from '@/app/_components/EvidencesPhoto/EvidencesPhoto';
import AdminRemarks from '@/app/_components/AdminRemarks/AdminRemarks';
import Link from 'next/link';
import AdminRefundActionButtons from '@/app/_components/AdminRefundActionButtons/AdminRefundActionButtons';
import { adminRejectRefundAction, adminApproveRefundAction } from '@/app/_lib/actions';

export default async function reportDetails({params}) {
    const resolvedParams = await params;
    const refundId = resolvedParams?.refundId? String(resolvedParams.refundId).trim() : "";

    const refund = await getRefundDetails(refundId);
    const skus = refund.ORDERS_T.ORDER_ITEMS_T.map((item) => {
        return item;
    })

    const requestDate = new Date(refund.created_at).getDate() + "/" + (new Date(refund.created_at).getMonth() + 1) + "/" + new Date(refund.created_at).getFullYear();
    const isOverOneWeek = (new Date() - new Date(refund.created_at)) / (1000 * 60 * 60 * 24) > 7;
    let refundStatus = "";
    let refundStatusColor = "";
    const adminStatus = refund.admin_status;
    const sellerStatus = refund.seller_status;
    let adminEditState = false;

    const buyerSubject = `Refund Request Related Question (${refund.refund_id})`
    const sellerSubject = `Buyer's Refund Request Related Question (${refund.refund_id})`
    const emailBuyerBody = 
    `Hello ${refund.ORDERS_T.buyer.username},`;

    const emailSellerBody = 
    `Hello ${refund.ORDERS_T.seller.username},`;
    
    if (sellerStatus === "Approved") {
    refundStatus = "Refund Approved";
    refundStatusColor = "green";
    }
    else if (sellerStatus === "Rejected") {

    if (adminStatus === "Approved") {
        refundStatus = "Refund Approved After Review";
        refundStatusColor = "green";
    } 
    else if (adminStatus === "Rejected") {
        refundStatus = "Refund Rejected";
        refundStatusColor = "red";
    } 
    else {
        refundStatus = "Under Admin Review";
        refundStatusColor = "orange";
        adminEditState = true;
    }
    }
    else if (sellerStatus === "Pending") {

    if (isOverOneWeek) {
        refundStatus = "Escalated To Admin";
        refundStatusColor = "red";
        adminEditState = true;
    } 
    else {
            refundStatus = "Waiting For Seller Response";
            refundStatusColor = "gray";
        }
    }
    else {
    refundStatus = "Unknown Status";
    refundStatusColor = "black";
    }
    
    // data for table
    const titles = ["Product ID", "Product Name", "Product Varient", "Quantity"];
    // const actions = [{type: "viewReviewer"}];
    const fields = ["PRODUCT_VARIANTS_T.PRODUCTS_T.product_id", "PRODUCT_VARIANTS_T.PRODUCTS_T.product_name", "PRODUCT_VARIANTS_T.sku", "quantity"];

    const orderDate = new Date (refund.ORDERS_T.created_at).getDate() + "/" + (new Date (refund.ORDERS_T.created_at).getMonth() + 1) + "/" + new Date (refund.ORDERS_T.created_at).getFullYear();

    const generalList1 = [{field: "Seller ID", value: refund.ORDERS_T.seller.user_id}, {field: "Total Paid", value: `RM ${parseFloat(refund.ORDERS_T.total_amount).toFixed(2)}`}];
    const generalList2 = [{field: "Seller Name", value: refund.ORDERS_T.seller.username}, {field: "Order Date", value: orderDate}];
    const generalList3 = [{field: "Shipping Type", value: refund.ORDERS_T.shipping[0].delivery_type}, {field: "Order Status", value: refund.ORDERS_T.order_status}];

    const refundList1 = [{field: "Refund ID", value: refund.refund_id}, {field: "Buyer ID", value: refund.ORDERS_T.buyer.user_id}];
    const refundList2 = [{field: "Refund Subject", value: refund.refund_subject}, {field: "Buyer Name", value: refund.ORDERS_T.buyer.username}];
    const refundList3 = [{field: "Request Date", value: requestDate}];
    console.log("refund",refund);

    return (<div className={ Styles.refundDetailsPage }>
        <div className={ Styles.upperPart }>
            <div className={ Styles.backButtonPart }>
                <AdminBackButton />
            </div>
            <div className={ Styles.refundUp}>
                <div className={ Styles.productDescription }>
                    <h1>Refund Details</h1>
                    <p>View and manage refund request here</p>
                </div>
                <div className={ Styles.refundStatusContainer}>
                    <h4 className={ Styles.refundStatusTextS }>
                        <span style={{color: refundStatusColor}}>
                            {refundStatus}
                        </span>
                    </h4>
                </div>
            </div>
        </div>
        <div className={ Styles.middlePart }>
            <div className={ Styles.evidencesShow}>
                <div className={ Styles.evidenceContainer}>
                    <EvidencesPhoto evidence={refund.evidences} />
                </div>
            </div>
            <div className={ Styles.generalInformation }>
                <div className={ Styles.generalInformationTitle }>
                    <AdminTitle title="General Information" />
                </div>
                <div className={ Styles.generalInformationList }>
                    <ShowItemInformationList objectlist={generalList1} />
                    <ShowItemInformationList objectlist={generalList2} />
                    <ShowItemInformationList objectlist={generalList3} />
                </div>
            </div>
            <div className={ Styles.refundTable }>
                <div className={ Styles.showProductSku }>
                    <div>
                        <h3>Order Review</h3>
                    </div>
                    <AdminTable titles={titles} fields={fields} datas={skus} slice={false} dataIdFormat="" />
                </div>
            </div>
            <div className={ Styles.refundInformation }>
                <div className={ Styles.generalInformationTitle }>
                    <AdminTitle title="Refund Details" />
                </div>
                <div className={ Styles.generalInformationList }>
                    <ShowItemInformationList objectlist={refundList1} />
                    <ShowItemInformationList objectlist={refundList2} />
                    <ShowItemInformationList objectlist={refundList3} />
                </div>
                <div className={ Styles.refundDescription }>
                    <h4>Description</h4>
                    <div className={ Styles.refundDescriptionText }>
                        <p>{refund.refund_description}</p>
                    </div>
                </div>
            </div>
            <div className={ Styles.showRemarks}>
                <div className={ Styles.sellerRemarks}>
                    <h4>Seller Remarks</h4>
                    <div className={ Styles.remarksContainer } >
                        <p>
                            {refund.seller_remarks ? refund.seller_remarks : "No remarks from seller"}
                        </p>
                    </div>
                </div>
                <AdminRemarks remarks={refund.admin_remarks} modifyId={refund.refund_id} isAbleEdit={adminEditState} remarksFor="refund" />
            </div>
        </div>
        <div className={ Styles.bottomPart }>
            <div className={Styles.redirectPart}>
                <div className={ Styles.navComponent }>
                    <div>
                        <AdminTitle title="View Refund Product Further" />
                    </div>
                    <div className={ Styles.navContainer }>
                        <span><Link className={Styles.linkText} href={`/admin/ManageOrders/${refund.ORDERS_T.order_id}`}>Order Page</Link></span>
                        <span><Link className={Styles.linkText} href={`/admin/ManageUsers/${refund.ORDERS_T.seller.user_id}`}>Seller Page</Link></span>
                        <span><Link className={Styles.linkText} href={`/admin/ManageUsers/${refund.ORDERS_T.buyer.user_id}`}>Buyer Page</Link></span>
                    </div>
                </div>
                <div className={ Styles.navComponent }>
                    <div>
                        <AdminTitle title="Contact Info" />
                    </div>
                    <div className={ Styles.navContainer }>
                        <a className={ Styles.linkText } href={`mailto:${refund.ORDERS_T.buyer.email}?subject=${buyerSubject}&body=${emailBuyerBody}`}>
                            Email Buyer
                        </a>
                        <a className={ Styles.linkText } href={`mailto:${refund.ORDERS_T.seller.email}?subject=${sellerSubject}&body=${emailSellerBody}`}>
                            Email Seller
                        </a>
                    </div>
                </div>
            </div>
            <div className={Styles.actionButtonPart}>
                <AdminRefundActionButtons isAble={adminEditState} refundId={refund.refund_id} remarkdsFor="refund" />
            </div>
        </div>
    </div>);
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