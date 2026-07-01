import { getBuyerSellerInfo,getAdminInfo,getCourierInfo } from "@/app/_lib/data-services";
import Styles from './AdminFilterUsers.module.css';
import { FilterUser,FilterAdmin, FilterCourier } from "./AdminFilterUsersClient";

export async function AdminFilterUser(){

    const users = await getBuyerSellerInfo();

    const distinctUsers = [...new Set(users.map((user) => user.role))]
    //... is used to take values out of the new Set() and insert them into the array
    return(
        <div className={Styles.tableRelatedContainer}>
            <div className={Styles.filterRelatedContainer}>
                <FilterUser role={distinctUsers} />
            </div>
        </div>
    )
}

export async function AdminFilterCourier(){

    const users = await getCourierInfo();

    // const distinctCouriers = [...new Set(users.map((user) => user.role))]
    //... is used to take values out of the new Set() and insert them into the array
    return(
        <div className={Styles.tableRelatedContainer}>
            <div className={Styles.filterRelatedContainer}>
                <FilterCourier />
            </div>
        </div>
    )
}

export async function SuperAdminFilterAdmin(){

    const users = await getAdminInfo();

    //... is used to take values out of the new Set() and insert them into the array
    return(
        <div className={Styles.tableRelatedContainer}>
            <div className={Styles.filterRelatedContainer}>
                <FilterAdmin/>
            </div>
        </div>
    )
}