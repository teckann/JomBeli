import { getAllUserInfo } from "@/app/_lib/data-services";
import Styles from './AdminFilterUsers.module.css';
import FilterUser from "./AdminFilterUsersClient";

export default async function AdminFilterUser(){

    const users = await getAllUserInfo();

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