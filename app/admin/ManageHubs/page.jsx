import Styles from './ManageHubs.module.css';
import Link from 'next/link';
import { getTotalWaitingRefundCount } from '@/app/_lib/analysis-serives';
import { getTotalActiveHubCount, getWaitingAssignParcelCount, getOutOfDeliveryParcelCount, getAssignedParcelsByAdminThisMonth, getNotProcessedBySeller, getRejectedBySeller } from '@/app/_lib/data-services';
import AdminFilterHubsBar from '@/app/_components/AdminFilterHubsBars/AdminFlterHubsBars';
import { getUser } from "@/app/_lib/auth";
import AdminTable from "@/app/_components/AdminTable/AdminTable";
// import { getUserInfo, deactiveProduct } from '@/app/_lib/data-services';



export default async function ManageDelivery() {

    const user = await getUser();

    const totalActiveHubs = await getTotalActiveHubCount();
    const totalWaiting = await getWaitingAssignParcelCount();
    const totalOutOfDeliveryParcel = await getOutOfDeliveryParcelCount();
    const totalAssignedParcelMonth = await getAssignedParcelsByAdminThisMonth(user.id);

    // const rejectedBySeller = await getRejectedBySeller();
    // const notProcessBySeller = await getNotProcessedBySeller();
    
    // const rejectedBySellerCount = rejectedBySeller.length;
    // const notProcessBySellerCount = notProcessBySeller.length;

    return (
        <div className={ Styles.contentPage}>
            <div className={Styles.upperPart}>
                <div className={Styles.pageDescription}>
                    <h1>Manage Delivery & Hubs</h1>
                    <p>Manage system delivery and hubs here.</p>
                </div>
                <div className={Styles.generateReportPart}>
                    <button className="btn btn-primary">Add Hub</button>
                </div>
            </div>
            <div className={Styles.smallPartContainer}>
                <HubInsightComponent title="Total Hubs" count={totalActiveHubs} />
                <HubInsightComponent title="Tota Parcels Waiting Assign" count={totalWaiting} />
                <HubInsightComponent title="Out of Delivery" count={totalOutOfDeliveryParcel} />
                <HubInsightComponent title="Weekly Personal Delivery" count={totalAssignedParcelMonth} />
            </div>
            <div className={Styles.showTablePart}>
                <div className={Styles.listingText}>
                    <h2>Hub Listing For Assigning Delivery</h2>
                    <p>View and manage Hub and assign delivery</p>
                </div>
                <div>
                    <AdminFilterHubsBar />
                </div>
            </div>
            <div>
                {/* <AdminTable titles={titles} fields={fields} actions={actions} datas={datas} slice={true} dataIdFormat="product_id" /> */}
            </div>
        </div>
    );
}

export async function RefundOverViewBar({rejectedBySellerCount, notProcessBySellerCount}) {

    const totalCount = await getTotalWaitingRefundCount();



    const overviewData = [
        {title: "Total Waiting Refund Request", count: totalCount}, 
        {title: "Rejected by Seller", count: rejectedBySellerCount},
        {title: "Not ProcessBySeller", count: notProcessBySellerCount}
    ]

    return (
        <div className={Styles.analyticsBar}>
            <div className={Styles.analyticsBarTitle}>
                <h3>Refund Request Overview</h3>
            </div>

            <div className={Styles.analyticsBarDatas}>
                {overviewData.map((data) => (
                    <ProductDataAnalyticsComponent key={data.title} title={data.title} count={data.count}  />
                ))}
            </div>
        </div>
    );

}

export function HubInsightComponent({title, count}) {
    return (
        <div className={ Styles.showComponent }>
            <div className={ Styles.smallPartTitle }><h3 className={ Styles.smallTitleText}>{title}</h3></div>
            <div><h2>{count}</h2></div>
        </div>
    )
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
