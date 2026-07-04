import Styles from './SupportTable.module.css';
import { getUser } from '@/app/_lib/auth';
import Link from 'next/link';
import AdminBackButton from '@/app/_components/AdminBackButton/AdminBackButton';
import { getFilterSupport } from '@/app/_lib/analysis-serives';
import AdminFilterSupportsBar from '@/app/_components/AdminFilterSupportBars/AdminFilterSupportBars';
import AdminTable from '@/app/_components/AdminTable/AdminTable';
// import { getUserInfo, deactiveProduct } from '@/app/_lib/data-services';



export default async function ManageSupportPage({ searchParams }) {

    const { date, supportType, supportStatus } = await searchParams;

    const supportList = await getFilterSupport(date, supportType, supportStatus);

    const titles = ["Support ID", "Reporter Name", "Report Type", "Report Status", "Request Date"];

    const actions = [{type: "viewSupport"}];
    const fields = ["support_id", "reporter.username", "support_type", "support_status", "created_at"];
    const datas = supportList;

    // const yearMonthsSelect = await getYearsMonthsWithNewProduct();



    return (
        <div className={ Styles.contentPage}>
            <AdminBackButton />
            <div className={Styles.showTablePart}>
                <div className={Styles.listingText}>
                    <h2>System Report Table</h2>
                    <p>Manage System Report here</p>
                </div>
                <div>
                    <AdminFilterSupportsBar />
                </div>
            </div>
            <div>
                <AdminTable titles={titles} fields={fields} actions={actions} datas={datas} slice={false} dataIdFormat="refund_id" />
            </div>
        </div>
    );
}