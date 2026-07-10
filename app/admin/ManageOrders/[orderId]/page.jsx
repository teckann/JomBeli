import { getRefundDetails, getOrderDetails } from "@/app/_lib/data-services";
import Styles from './OrderDetailsPage.module.css';
import AdminTable from '@/app/_components/AdminTable/AdminTable';
import ShowItemInformationList from '@/app/_components/AdminShowInformationList/AdminShowInformationList';
import AdminBackButton from '@/app/_components/AdminBackButton/AdminBackButton';
import EvidencesPhoto from '@/app/_components/EvidencesPhoto/EvidencesPhoto';
import AdminRemarks from '@/app/_components/AdminRemarks/AdminRemarks';
import Link from 'next/link';
import AdminRefundActionButtons from '@/app/_components/AdminRefundActionButtons/AdminRefundActionButtons';

export default async function reportDetails({params}) {
    const resolvedParams = await params;
    const orderId = resolvedParams?.orderId? String(resolvedParams.orderId).trim() : "";

    const order = await getOrderDetails(orderId);

    const orderStatus = order.order_status;

    let statusColor;

    if (orderStatus === "Ordered") {
    statusColor = "#3B82F6"; 
    } else if (orderStatus === "Packed By Seller") {
    statusColor = "#6366F1"; 
    } else if (orderStatus === "Shipped") {
    statusColor = "#8B5CF6"; 
    } else if (orderStatus === "Out For Delivery") {
    statusColor = "#F59E0B"; 
    } else if (orderStatus === "Delivered") {
    statusColor = "#22C55E"; 
    } else if (orderStatus === "Completed") {
    statusColor = "#15803D"; 
    } else if (orderStatus === "Applied For Refund") {
    statusColor = "#F97316"; 
    } else if (orderStatus === "Refunded") {
    statusColor = "#6B7280"; 
    } else {
    statusColor = "#6B7280"; 
    }

    const hubAssigned = order.shipping[0]?.hub ? order.shipping[0].hub.hub_name : "-";

    const skuDatas = order.ORDER_ITEMS_T;

    const hasVoucher = order.voucher?.VOUCHERS_T;
    // data for table
    const titles = ["Product ID", "Product Name", "Product Varient", "unitPrice", "Quantity", "Total (RM)"];
    const fields = ["PRODUCT_VARIANTS_T.PRODUCTS_T.product_id", "PRODUCT_VARIANTS_T.PRODUCTS_T.product_name", "PRODUCT_VARIANTS_T.sku", "unit_price", "quantity", "subtotal"];

    const orderDate = new Date (order.created_at).getDate() + "/" + (new Date (order.created_at).getMonth() + 1) + "/" + new Date (order.created_at).getFullYear();

    const generalList1 = [{field: "Buyer ID", value: order.buyer.user_id}, {field: "Seller ID", value: order.buyer.user_id}, {field: "Ordered Date", value: orderDate}, {field: "Address Area", value: order.address.city}, {field: "Shipping ID", value: order.shipping[0]?.shipping_id}];
    const generalList2 = [{field: "Buyer Name", value: order.buyer.username}, {field: "Seller Name", value: order.seller.username}, {field: "Total Product Type", value: skuDatas?.length}, {field: "Hub", value: hubAssigned}, {field: "Shipping Type", value: order.shipping[0]?.delivery_type}];

    return (<div className={ Styles.refundDetailsPage }>
        <div className={ Styles.upperPart }>
            <div className={ Styles.backButtonPart }>
                <AdminBackButton />
            </div>
            <div className={ Styles.productDescription }>
                <h1>Order Details</h1>
                <p>View order details here</p>
            </div>
        </div>
        <div className={ Styles.orderCard}>
            <div className={ Styles.upperPart }>
                <div className={ Styles.refundUp}>
                    <div className={ Styles.productDescription }>
                        <h2>#{order.order_id}</h2>
                        <p>Purchased by {order.buyer.username}</p>
                    </div>
                    <div className={ Styles.refundStatusContainer} style={{backgroundColor: statusColor}}>
                        <h4 className={ Styles.refundStatusText }>
                            <span className={ Styles.orderStatusText }>
                                {orderStatus}
                            </span>
                        </h4>
                    </div>
                </div>
            </div>
            <div className={ Styles.middlePart }>
                <div className={ Styles.tableShow}>
                    <h3>Order Overview</h3>
                    <AdminTable titles={titles} fields={fields} datas={skuDatas} slice={true} dataIdFormat="" />
                </div>
                <div className={ Styles.generalInformation }>
                    <div className={ Styles.generalInformationTitle }>
                        <AdminTitle title="Order Information" />
                    </div>
                    <div className={ Styles.generalInformationList }>
                        <ShowItemInformationList objectlist={generalList1} />
                        <ShowItemInformationList objectlist={generalList2} />
                    </div>
                </div>
                <div className={ Styles.feesAndMoreInfo}>
                    <div className={ Styles.orderFeeCalculation }>
                        <AdminTitle title="Order Fees Calculation" />
                        <div className={ Styles.calculationContainer}>
                            <div className={ Styles.calculateHeader}>
                                <div className={ Styles.calculateTitle }></div>
                                <div className={ Styles.numberInput}>RM</div>
                            </div>

                            <div className={ Styles.calculateRow}>
                                <div className={ Styles.calculateTitle }>Sum of Total</div>
                                <div className={ Styles.numberInput}>
                                    {hasVoucher
                                        ? Number(order.total_amount) -
                                        Number(order.shipping[0]?.delivery_fee) +
                                        Number(order.voucher.VOUCHERS_T.discount_value) +
                                        Number(order.discount_amount)
                                        : Number(order.total_amount) -
                                        Number(order.shipping[0]?.delivery_fee) +
                                        Number(order.discount_amount)
                                    }
                                </div>
                            </div>

                            <div className={ Styles.calculateRow}>
                                <div className={ Styles.calculateTitle }>Product Discount</div>
                                <div className={ Styles.numberInput}>
                                    - {Number(order.discount_amount).toFixed(2)}
                                </div>
                            </div>

                            <div className={ Styles.calculateRow}>
                                <div className={ Styles.calculateTitle }>Delivery Fee</div>
                                <div className={ Styles.numberInput}>
                                    + {Number(order.shipping[0]?.delivery_fee)}
                                    <div className={Styles.divider}></div>
                                </div>
                            </div>

                            <div className={ Styles.calculateRow}>
                                <div className={ Styles.calculateTitle }></div>
                                <div className={ Styles.numberInput}>
                                    {hasVoucher
                                        ? Number(order.total_amount) +
                                        Number(order.voucher.VOUCHERS_T.discount_value)
                                        : Number(order.total_amount)
                                    }
                                </div>
                            </div>

                            <div className={ Styles.calculateRow}>
                                <div className={ Styles.calculateTitle }><small>Applied Voucher</small></div>
                                <div className={ Styles.numberInput}>
                                </div>
                            </div>

                            <div className={ Styles.calculateRow}>
                                <div className={ Styles.calculateTitle }>
                                    {hasVoucher
                                        ? `${order.voucher.VOUCHERS_T.voucher_name} (${order.voucher.VOUCHERS_T.voucher_type} voucher)`
                                        : "-"}
                                </div>
                                <div className={ Styles.numberInput}>
                                    {hasVoucher
                                        ? `- ${order.voucher.VOUCHERS_T.discount_value}`
                                        : "0"}
                                    <div className={Styles.divider}></div>
                                </div>
                            </div>

                            <div className={ Styles.calculateRow}>
                                <div className={ Styles.calculateTitle }>Total Paid</div>
                                <div className={ Styles.numberInput}>
                                    {Number(order.total_amount)}
                                    <div className={Styles.divider}></div>
                                    <div className={Styles.divider}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={ Styles.moreInfo}>
                        <div className={ Styles.moreInfoComponent }>
                            <AdminTitle title="Delivery Details" />
                            <div className={ Styles.infoMore}>
                                <span>🚚 Delivery Status: {order.shipping[0]?.shipping_status}</span>
                                <span>📦 Delivered by: {order.shipping[0]?.courier ? order.shipping[0]?.courier.username : "-"}</span>
                                <span>👤 Assigned by: {order.shipping[0]?.admin ? order.shipping[0].admin.username : "-"}</span>
                            </div>
                        </div>
                        <div className={ Styles.moreInfoComponent }>
                            <AdminTitle title="Transactions Details" />
                            <div className={ Styles.infoMore}>
                                <span>💵 Transaction ID: {order.transaction[0].order_transaction_id}</span>
                                <span>🏦 Transaction Status: {order.transaction[0].order_transaction_status}</span>
                            </div>
                        </div>
                    </div>
                </div>
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