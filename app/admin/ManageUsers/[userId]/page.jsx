import { getUserDetails } from "@/app/_lib/data-services";
import { getBuyerOrderCount, getBuyerTotalSpent, getSellerOrderCount, getSellerGrossEarnings } from "@/app/_lib/analysis-serives"
import Styles from "./UserDetail.module.css";
import AdminItemCard from "@/app/_components/AdminItemCard/AdminItemCard";
import BackButton from "@/app/_components/AdminBackButton/AdminBackButton";
import { UserInformation,AccountActivityMonitoring,AccountSecurityAnalysis } from "@/app/_components/AdminUserDetails/AdminUserDetails";
import AdminDeactivateUserButton from "@/app/_components/AdminDeactivateUserButton/AdminDeactivateUserButton"
import AdminViewOrderHistoryButton from "@/app/_components/AdminViewOrderTransactionsButton/AdminViewOrderTransactionsButton";

export const revalidate = 0;

export default async function UserDetail({params}){
    const resolvedParams = await params;
    const userId = resolvedParams?.userId ? String (resolvedParams.userId).trim() : ""

    const user = await getUserDetails(userId);
    const country = user?.ADDRESSES_T?.[0]?.country || "No country provided";
    const OrderCount = await getBuyerOrderCount(userId);
    const TotalSpent = await getBuyerTotalSpent(userId);
    const SellerOrderCount = await getSellerOrderCount(userId); 
    const GrossEarnings = await getSellerGrossEarnings(userId);

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
                        <AdminViewOrderHistoryButton userId={userId} className={Styles.btnSecondary}/>
                    </div>
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
                    <AccountActivityMonitoring user={user} OrderCount={OrderCount} TotalSpent={TotalSpent} SellerItemsSold={SellerOrderCount} GrossEarnings={GrossEarnings}/>
                </div>
            </div>
        </div>
    )
}

