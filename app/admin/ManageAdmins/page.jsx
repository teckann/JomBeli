import Styles from './ManageAdmins.module.css';
import Link from 'next/link';
import AdminTable from '@/app/_components/AdminTable/AdminTable'
import { SuperAdminFilterAdmin } from '@/app/_components/AdminFilterUsers/AdminFilterUsers';
import { getFilterAdmin }from '@/app/_lib/analysis-serives';

export const revalidate = 0;

export default async function manageAdmins({ searchParams }) {
    const { status, username } = await searchParams;

    const userList = await getFilterAdmin(status, username);
    // console.log(userList);
    const titles = ["Full Name","Email","Contact Number","Role","Status"];
    const actions = [{type:"viewAdmins"}];
    const fields = ["username", "email", "contact_number","role","user_status"];
    const datas = userList;
    
    return (
        <div className={Styles.contentPage}>
            <div className={Styles.upperPart}>
                <div className={Styles.pageDescription}>
                    <h1>Manage Admins</h1>
                    <p>Manage Admins Right Now!</p>
                </div>
            </div>
            <div>
                <SuperAdminFilterAdmin />
            </div>
            <div>
                <AdminTable titles={titles} fields={fields} actions={actions} datas={datas} dataIdFormat={"user_id"}/>
            </div>
        </div> 
    )
}



