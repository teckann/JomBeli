import Styles from './ManageCourier.module.css';
import Link from 'next/link';
import AdminTable from '@/app/_components/AdminTable/AdminTable'
import { AdminFilterCourier } from '@/app/_components/AdminFilterUsers/AdminFilterUsers';
import { getFilterCouriers }from '@/app/_lib/analysis-serives';

export const revalidate = 0;

export default async function manageCouriers({ searchParams }) {
    const { status, username } = await searchParams;

    const userList = await getFilterCouriers(status, username);
    // console.log(userList);
    const titles = ["Full Name","Email","Contact Number","Address","Role","Status"];
    const actions = [{type:"viewCouriers"}];
    const fields = ["username", "email", "contact_number","full_address", "role","user_status"];
    const datas = userList;
    
    return (
        <div className={Styles.contentPage}>
            <div className={Styles.upperPart}>
                <div className={Styles.pageDescription}>
                    <h1>Manage Couriers</h1>
                    <p>Manage Couriers Right Now!</p>
                </div>
            </div>
            <div>
                <AdminFilterCourier />
            </div>
            <div>
                <AdminTable titles={titles} fields={fields} actions={actions} datas={datas} dataIdFormat={"user_id"}/>
            </div>
        </div> 
    )
}



