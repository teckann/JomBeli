import { getAllUserInfo } from '@/app/_lib/data-services';
import Link from 'next/link';
import Styles from './ManageUsers.module.css';
import AdminTable from '@/app/_components/AdminTable/AdminTable'
import AdminFilterUser from '@/app/_components/AdminFilterUsersSearch/AdminFilterUsers';
import { getFilterUsers }from '@/app/_lib/analysis-serives';

export default async function manageUser({ searchParams }) {
    const { role, status, username } = await searchParams;

    const userList = await getFilterUsers(role, status, username);
    console.log(userList);
    const titles = ["Full Name","Email","Contact Number","Role","Balances","Status"];
    const actions = [{title:"deactive",icon:"Deactive"},{title:"info",icon:"InfoIcon"}];
    const datas = userList.map((user) => [user.username, user.email, user.contact_number, user.role, user.balances, user.user_status]);
    
    return (
        <div className={Styles.contentPage}>
            <div className={Styles.upperPart}>
                <div className={Styles.pageDescription}>
                    <h1>Manage Users</h1>
                    <p>Manage System Users Right Now!</p>
                </div>
            </div>
            <div>
                <AdminFilterUser />
            </div>
            <div>
                <AdminTable titles={titles} actions={actions} datas={datas}/>
            </div>
        </div> 
    )

}



