import Styles from './ManageRefunds.module.css';
import { getUser } from '@/app/_lib/auth';
import Link from 'next/link';
import { getTotalWaitingRefundCount } from '@/app/_lib/analysis-serives';
import AdminFilterProductsBar from '@/app/_components/AdminFilterProductsBars/AdminFilterProductsBars';
import { getNotProcessedBySeller, getRejectedBySeller } from '@/app/_lib/data-services';
import AdminTable from '@/app/_components/AdminTable/AdminTable';
import GenerateReportButton from '@/app/_components/AdminGenerateProductReport/AdminGenerateProductReport';
import AdminSliceShow from '@/app/_components/AdminSliceShow/AdminSlideShow';
// import { getUserInfo, deactiveProduct } from '@/app/_lib/data-services';



export default async function manageReduns() {

    const rejectedBySeller = await getRejectedBySeller();
    const notProcessBySeller = await getNotProcessedBySeller();
    
    const rejectedBySellerCount = rejectedBySeller.length;
    const notProcessBySellerCount = notProcessBySeller.length;

    const actions = [{type: "viewProduct"}];

    return (
        <div className={ Styles.contentPage}>
            <div className={Styles.upperPart}>
                <div className={Styles.pageDescription}>
                    <h1>Admin Refund Process</h1>
                    <p>Admin are able to manage the request that are rejected from seller or is not response from seller within certain period.</p>
                </div>
                <div className={Styles.generateReportPart}>
                    {/* <GenerateReportButton yearMonths={yearMonthsSelect} /> */}
                </div>
            </div>
            <div className={Styles.refundsOverviewContainer}>
                <RefundOverViewBar rejectedBySellerCount={rejectedBySellerCount} notProcessBySellerCount={notProcessBySellerCount} />
            </div>
            <br />
            <div className={Styles.showTablePart}>
                <div className={Styles.listingText}>
                    <h2>Refund Rejected by Seller {"("}{rejectedBySellerCount}{")"}</h2>
                    <p>Monitor and ensure that sellers provide reasonable justifications when rejecting refund requests.</p>
                </div>
                <div>
                    <AdminSliceShow datas={rejectedBySeller} />
                </div>
            </div>
            <div className={Styles.showTablePart}>
                <div className={Styles.listingText}>
                    <h2>Not Process by Seller {"("}{notProcessBySellerCount}{")"}</h2>
                    <p>Manage refund requests that have not been processed by sellers within 7 days.</p>
                </div>
                <div>
                    <AdminSliceShow datas={notProcessBySeller} />
                </div>
            </div>
            <div>
                {/* <AdminTable titles={titles} fields={fields} actions={actions} datas={datas} slice={true} dataIdFormat="product_id" /> */}
            </div>
        </div>
    );
}

// export function GenerateReportButton() {
//     return (
//         <button className="btn btn-primary">
//             <Link className={ Styles.linkText } href="#">
//                 Generate Product Report
//             </Link>
//         </button>
//     );
// }

// export async function 

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
