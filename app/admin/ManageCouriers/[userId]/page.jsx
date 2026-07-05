import { getCourierDetails, getHubs, hasPendingDelivery } from "@/app/_lib/data-services";
import Styles from "./CourierDetail.module.css";
import AdminItemCard from "@/app/_components/AdminItemCard/AdminItemCard";
import BackButton from "@/app/_components/AdminBackButton/AdminBackButton";
import { UserInformation,AccountActivityMonitoring,AccountSecurityAnalysis } from "@/app/_components/AdminUserDetails/AdminUserDetails";
import AdminDeactivateUserButton from "@/app/_components/AdminDeactivateUserButton/AdminDeactivateUserButton"
import AssignHub from "@/app/_components/AdminAssignCourierHub/AssignCourierHub";
import { getDeliveredCount } from "@/app/_lib/analysis-serives";

export const revalidate = 0;

export default async function UserDetail({params}){
    const resolvedParams = await params;
    const userId = resolvedParams?.userId ? String (resolvedParams.userId).trim() : ""

    const user = await getCourierDetails(userId);
    const country = user?.ADDRESSES_T?.[0]?.country || "No country provided";
    const hubs = await getHubs();
    const deliveredcount = await getDeliveredCount(userId);
    const hasPending = await hasPendingDelivery(userId);

    return(
        <div className={Styles.userDetailsPage}>
            <div className={Styles.upperContainer}>
                <div className={Styles.buttonContainer}>
                    <BackButton className={Styles.backButton} />
                </div>
                <div className={Styles.pageHeader}>
                    <h1 className={Styles.header}>Courier details</h1>
                </div>
                <div className={Styles.profileContainer}>
                    <AdminItemCard id={user.user_id} name={user.username} category={user.role} itemStatus={user.user_status} imageUrl={user.avatar}/>
                </div>
            </div>
            <div className={Styles.lowerContainer}>
                <div className={Styles.leftSide}>
                    <UserInformation user={user} country={country} />
                    <AdminDeactivateUserButton userId={user.user_id} userStatus={user.user_status}/>
                </div>
                <div className={Styles.rightSide}>
                    <AccountSecurityAnalysis user={user} />
                    <AccountActivityMonitoring user={user} DeliveredItems={deliveredcount}/>
                    <AssignHub userId={userId} currentHubId={user.hub_id} hubs={hubs} disabled={hasPending}/>
                </div>
            </div>
        </div>
    )
}

