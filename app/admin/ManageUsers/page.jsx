import { getAllUserInfo } from '@/app/_lib/data-services';
import Link from 'next/link';
import Styles from './ManageUsers.module.css';
import UserTable from '@/app/_components/AdminManageUsersTable/AdminManageUsersTable';

export default async function manageUser() {

    return (
        <div className={Styles.contentPage}>
            <div className={Styles.upperPart}>
                <div className={Styles.pageDescription}>
                    <h1>Manage Users</h1>
                    <p>Manage System Users Right Now!</p>
                </div>
            </div>
            <div className={Styles.showTablePart}>
                <UserTable />
            </div>
        </div>
        
    )

}



