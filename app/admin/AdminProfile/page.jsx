import Styles from "./AdminProfile.module.css";
import { getUser } from "@/app/_lib/auth";
import { getUserDetails } from "@/app/_lib/data-services";
import { UserInformation } from "@/app/_components/AdminUserDetails/AdminUserDetails";
import AdminItemCard from "@/app/_components/AdminItemCard/AdminItemCard";
import EditProfileWidget from "@/app/_components/EditProfile/EditProfileWidget";

export default async function adminProfile(){

    const user = await getUser();
    const userInfo = await getUserDetails(user.id);
    const country = userInfo?.ADDRESSES_T?.[0]?.country || "No country provided";

    console.log(userInfo);

    return(
        <div className={Styles.profilePage}>
            <div className={Styles.upperContainer}>
                <div className={Styles.pageHeader}>
                    <h1 className={Styles.header}>Profile</h1>
                </div>
                <div className={Styles.profileContainer}>
                    <AdminItemCard id={userInfo.user_id} name={userInfo.username} category={userInfo.role} itemStatus={userInfo.user_status} imageUrl={userInfo.avatar}/>
                </div>
            </div>
            <div className={Styles.lowerContainer}>
                <div className={Styles.leftSide}>
                    <UserInformation user={userInfo} country={country} />
                    <EditProfileWidget userInfo={userInfo} country={country}/>
                </div>
            </div>
        </div>
    )
}