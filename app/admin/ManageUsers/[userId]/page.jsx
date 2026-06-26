import { getBuyerSellerDetails } from "@/app/_lib/data-services";
import Styles from "./UserDetail.module.css";
import Image from "next/image";

export default async function UserDetail({params}){
    const resolvedParams = await params;
    const userId = resolvedParams?.userId ? String (resolvedParams.userId).trim() : ""

    const user = await getBuyerSellerDetails(userId);
    const country = user?.ADDRESSES_T?.[0]?.country || "No country provided";

    return(
        <div className={Styles.userDetailsPage}>
            <div className={Styles.upperContainer}>
                <div classname={Styles.buttonContainer}>
                    <button className={Styles.backButton}>Back</button>
                </div>
                <div className={Styles.pageHeader}>
                    <h1 className={Styles.header}>View User Page</h1>
                </div>
                <div className={Styles.profileContainer}>
                    <div className={Styles.actionButtons}>
                        <button className={Styles.btnSecondary}>View order history</button>
                        <button className={Styles.btnSecondary}>View transaction history</button>
                    </div>
                    <Image className={Styles.avatarCircle} src={user.avatar} width={250} height={250}/>
                    <div className={Styles.userinfo}>
                        <h2 className={Styles.userName}>{user.username}</h2>
                        <div className={Styles.badgeRow}>
                            <span className={Styles.badge}>{user.user_id}</span>
                            <span className={Styles.badge}>{user.role}</span>
                        </div >   
                        <span className={Styles.badgeWide}>{user.user_status}</span>
                    </div>
                </div>
            </div>
            <div className={Styles.lowerContainer}>
                <div className={Styles.leftSide}>
                    <div className={Styles.headerWrapper}>
                        <h3 className={Styles.sectionTitle}>Personal Information</h3>
                    </div>
                    <div className={Styles.infoGrid}>
                        <span className={Styles.label}>User Name</span>
                        <span className={Styles.colon}>:</span>
                        <div className={Styles.value}>{user.username}</div>

                        <span className={Styles.label}>Gender</span>
                        <span className={Styles.colon}>:</span>
                        <div className={Styles.value}>{user.gender}</div>

                        <span className={Styles.label}>Nationality</span>
                        <span className={Styles.colon}>:</span>
                        <div className={Styles.value}>{country}</div>

                        <span className={Styles.label}>Email</span>
                        <span className={Styles.colon}>:</span>
                        <div className={Styles.value}>{user.email}</div>

                        <span className={Styles.label}>Contact Number</span>
                        <span className={Styles.colon}>:</span>
                        <div className={Styles.value}>{user.contact_number}</div>

                        <span className={Styles.label}>Registration Date</span>
                        <span className={Styles.colon}>:</span>
                        <div className={Styles.value}>{user.created_at}</div>
                    </div>
                </div>
                <div className={Styles.rightSide}>

                </div>
            </div>
        </div>
    )
}