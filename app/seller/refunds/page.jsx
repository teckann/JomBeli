import RefundTable from '@/app/_components/SellerTable/refundTable';
import styles from './refunds.module.css'


import { getUser } from "@/app/_lib/auth";
import { getUserInfo } from "@/app/_lib/data-services";

import { getSellerRefund } from "@/app/_lib/data-services";



async function Refunds() {

  
  const user = await getUser();

  const userInfo = await getUserInfo(user.id);

  
  const Vdata = await getSellerRefund(user.id);


  return (
    <div className={styles.fcon}>
        <span className={styles.head}>

            <h1 className={styles.h1}>Refunds Management</h1>

            
        </span>

        <div className={styles.scon}>

          <RefundTable data={Vdata} />


        </div>


    </div>
  )
}

export default Refunds