import { getUserDetails } from "@/app/_lib/data-services";
import Styles from "./AdminDetail.module.css";
import AdminItemCard from "@/app/_components/AdminItemCard/AdminItemCard";
import BackButton from "@/app/_components/AdminBackButton/AdminBackButton";
import { AdminInformation,AccountSecurityAnalysis } from "@/app/_components/AdminUserDetails/AdminUserDetails";
import AdminDeactivateUserButton from "@/app/_components/AdminDeactivateUserButton/AdminDeactivateUserButton"

export const revalidate = 0;

export default async function UserDetail({params}){
    const resolvedParams = await params;
    const userId = resolvedParams?.userId ? String (resolvedParams.userId).trim() : ""

    const admin = await getUserDetails(userId);
    const country = admin?.ADDRESSES_T?.[0]?.country || "No country provided";

    return(
        <div className={Styles.userDetailsPage}>
            <div className={Styles.upperContainer}>
                <div className={Styles.buttonContainer}>
                    <BackButton className={Styles.backButton} />
                </div>
                <div className={Styles.pageHeader}>
                    <h1 className={Styles.header}>View Admin Page</h1>
                </div>
                <div className={Styles.profileContainer}>
                    <AdminItemCard id={admin.user_id} name={admin.username} category={admin.role} itemStatus={admin.user_status} imageUrl={admin.avatar}/>
                </div>
            </div>
            <div className={Styles.lowerContainer}>
                <div className={Styles.leftSide}>
                    <AdminInformation user={admin} country={country} />
                    <AdminDeactivateUserButton userId={admin.user_id} userStatus={admin.user_status}/>
                </div>
                <div className={Styles.rightSide}>
                    <AccountSecurityAnalysis user={admin} />
                </div>
            </div>
        </div>
    )
}

