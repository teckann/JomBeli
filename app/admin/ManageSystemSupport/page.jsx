import Styles from './ManageSystemSupport.module.css';
import Link from 'next/link';
import { getPendingSupport } from '@/app/_lib/data-services';
import { getNotProcessedBySeller, getRejectedBySeller } from '@/app/_lib/data-services';
import AdminSliceShow from '@/app/_components/AdminSliceShow/AdminSlideShow';
// import { getUserInfo, deactiveProduct } from '@/app/_lib/data-services';



export default async function manageSystemSupport() {

    const pendingSupports = await getPendingSupport();

    pendingSupports.map(support => {
        console.log(support.support_type);
    })

    const reportProductList = pendingSupports.filter(support => support.support_type === "Report Product");
    const reportSellerList = pendingSupports.filter(support => support.support_type === "Report Shop");
    const reportGeneralList = pendingSupports.filter(support => (support.support_type !== "Report Product" && support.support_type !== "Report Seller"));
    
    const allReportCount = pendingSupports.length;
    const reportProductCount = reportProductList.length;
    const reportSellerCount = reportSellerList.length;
    const reportGeneralCount = reportGeneralList.length;

    return ( 
        <div className={ Styles.contentPage}>
            <div className={Styles.upperPart}>
                <div className={Styles.pageDescription}>
                    <h1>Admin Refund Process</h1>
                    <p>Admin are able to manage the request that are rejected from seller or is not response from seller within certain period.</p>
                </div>
                <div className={Styles.generateReportPart}>
                    <button className="btn btn-primary"><Link className={ Styles.linkText } href="/admin/ManageSystemSupport/SupportTable">View Refund Records</Link></button>
                </div>
            </div>
            <div className={Styles.refundsOverviewContainer}>
               <ReportOverViewBar allReportCount={allReportCount} reportProductCount={reportProductCount} reportSellerCount={reportSellerCount} reportGeneralCount={reportGeneralCount} /> 
            </div>
            <div className={Styles.showSlicePart}>
                <div className={Styles.listingText}>
                    <h2>Product Report {"("}{reportProductCount}{")"}</h2>
                    <p>Manage product report by buyer.</p>
                </div>
                <div>
                    <AdminSliceShow datas={reportProductList} purpose="reportProduct" />
                </div>
            </div>
            <div className={Styles.showSlicePart}>
                <div className={Styles.listingText}>
                    <h2>Seller Report {"("}{reportSellerCount}{")"}</h2>
                    <p>Manage seller report by buyer.</p>
                </div>
                <div>
                    <AdminSliceShow datas={reportSellerList} purpose="reportSeller" />
                </div>
            </div>
            <div className={Styles.showSlicePart}>
                <div className={Styles.listingText}>
                    <h2>General Report {"("}{reportGeneralCount}{")"}</h2>
                    <p>Manage general report by user.</p>
                </div>
                <div>
                    <AdminSliceShow datas={reportGeneralList} purpose="reportGeneral" />
                </div>
            </div>
            <div>
                {/* <AdminTable titles={titles} fields={fields} actions={actions} datas={datas} slice={true} dataIdFormat="product_id" /> */}
            </div>
        </div>
    );
}

export async function ReportOverViewBar({allReportCount, reportProductCount, reportSellerCount, reportGeneralCount}) {


    const overviewData = [
        {title: "Current Pending Reports", count: allReportCount}, 
        {title: "Report Product", count: reportProductCount},
        {title: "Report Seller", count: reportSellerCount},
        {title: "System Support", count: reportGeneralCount}
    ]

    return (
        <div className={Styles.analyticsBar}>
            <div className={Styles.analyticsBarTitle}>
                <h3>System Report Overview</h3>
            </div>

            <div className={Styles.analyticsBarDatas}>
                {overviewData.map((data) => (
                    <ReportDataAnalyticsComponent key={data.title} title={data.title} count={data.count}  />
                ))}
            </div>
        </div>
    );

}

export function ReportDataAnalyticsComponent({title, count}) {
    
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