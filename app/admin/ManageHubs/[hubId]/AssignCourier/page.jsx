import Styles from './AssignCourier.module.css';
import { getUser } from '@/app/_lib/auth';
import Link from 'next/link';
import AdminBackButton from "@/app/_components/AdminHubBackButton/AdminHubBackButton";
// import AdminBackButton from '@/app/_components/AdminBackButton/AdminBackButton';
import { getFilterSupport } from '@/app/_lib/analysis-serives';
import { getHubDelivery, getHubCourierMan } from '@/app/_lib/data-services';
import AssignCourierClient from './AssignCourierClient';



export default async function AssignCorierPage({ params }) {

    const { hubId } = await params;
    const user = await getUser();
    
    const hub = await getHubDelivery(hubId);

    // const supportList = await getFilterSupport(date, supportType, supportStatus);

    const titles = ["Shipping ID", "Shipping Area", "Status", "Delivery Type", "Created Date"];

    const actions = [{type: "assignDelivery"}];
    const fields = ["shipping_id", "order.address.city", "shipping_status", "delivery_type", "created_at"];
    // const datas = hub;

    // const yearMonthsSelect = await getYearsMonthsWithNewProduct();

    const datas = hub;
    const couriers = await getHubCourierMan(hubId);


    return (
        <div className={ Styles.contentPage}>
            <div className={ Styles.backButtonComponent }><AdminBackButton /></div>
            <div className={Styles.showTablePart}>
                <div className={ Styles.upperPart}>
                    <div className={Styles.listingText}>
                        <h2>Assign Delivery Page</h2>
                        <p>Assign delivery to courier man at here</p>
                    </div>
                    <div>
                        <button className="btn btn-primary"><Link className={ Styles.linkText } href={`/admin/ManageHubs/${hubId}/HubProfile`}>Hub Profile</Link></button>
                    </div>
                </div>
                <div>
                    {/* <AdminFilterSupportsBar /> */}
                </div>
            </div>
            <div>
                <AssignCourierClient datas={datas} fields={fields} titles={titles} actions={actions} couriers={couriers} user={user} />
            </div>
        </div>
    );
}

