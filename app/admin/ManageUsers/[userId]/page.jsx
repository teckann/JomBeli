import { getBuyerSellerDetails, getBuyerOrderCount, getBuyerTotalSpent } from "@/app/_lib/data-services";
import Styles from "./UserDetail.module.css";
import AdminItemCard from "@/app/_components/AdminItemCard/AdminItemCard";
import BackButton from "@/app/_components/AdminBackButton/AdminBackButton";
import { UserInformation,AccountActivityMonitoring,AccountSecurityAnalysis } from "@/app/_components/AdminUserDetails/AdminUserDetails";
export default async function UserDetail({params}){
    const resolvedParams = await params;
    const userId = resolvedParams?.userId ? String (resolvedParams.userId).trim() : ""

    const user = await getBuyerSellerDetails(userId);
    const country = user?.ADDRESSES_T?.[0]?.country || "No country provided";
    const OrderCount = await getBuyerOrderCount(userId);
    const TotalSpent = await getBuyerTotalSpent(userId);

    return(
        <div className={Styles.userDetailsPage}>
            <div className={Styles.upperContainer}>
                <div className={Styles.buttonContainer}>
                    <BackButton className={Styles.backButton} />
                </div>
                <div className={Styles.pageHeader}>
                    <h1 className={Styles.header}>View User Page</h1>
                </div>
                <div className={Styles.profileContainer}>
                    <div className={Styles.actionButtons}>
                        <button className={Styles.btnSecondary}>View order history</button>
                        <button className={Styles.btnSecondary}>View transaction history</button>
                    </div>
                    <AdminItemCard id={user.user_id} name={user.username} category={user.role} itemStatus={user.user_status} imageUrl={user.avatar}/>
                </div>
            </div>
            <div className={Styles.lowerContainer}>
                <div className={Styles.leftSide}>
                    <UserInformation user={user} country={country} />
                </div>
                <div className={Styles.rightSide}>
                    <AccountSecurityAnalysis user={user} />
                    <AccountActivityMonitoring user={user} OrderCount={OrderCount} TotalSpent={TotalSpent}/>
                </div>
            </div>
        </div>
    )
}

