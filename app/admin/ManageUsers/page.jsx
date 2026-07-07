import Styles from './ManageUsers.module.css';
import AdminTable from '@/app/_components/AdminTable/AdminTable'
import { AdminFilterUser } from '@/app/_components/AdminFilterUsers/AdminFilterUsers';
import { getFilterUsers }from '@/app/_lib/analysis-serives';
import GenerateUserReport from '@/app/_components/AdminGenerateUserReport/AdminGenerateUserReport';

export const revalidate = 60;

export default async function manageUser({ searchParams }) {
    const { role, status, username } = await searchParams;

    const userList = await getFilterUsers(role, status, username);
    // console.log(userList);
    const titles = ["Full Name","Email","Contact Number","Address","Role","Balances","Status"];

    const actions = [{type:"viewUsers"}];

    const fields = ["username", "email", "contact_number", "full_address", "role", "balances", "user_status"];

    const datas = userList;
    
    return (
        <div className={Styles.contentPage}>
            <div className={Styles.upperPart}>
                <div className={Styles.pageDescription}>
                    <h1>Manage Users</h1>
                    <p>Manage System Users Right Now!</p>
                </div>
                <GenerateUserReport />
            </div>
            <div>
                <AdminFilterUser />
            </div>
            <div>
                <AdminTable titles={titles} fields={fields} actions={actions} datas={datas} dataIdFormat={"user_id"}/>
            </div>
        </div> 
    )
}



