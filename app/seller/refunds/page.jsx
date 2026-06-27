import RefundTable from '@/app/_components/SellerTable/refundTable';
import styles from './refunds.module.css'

import { getSellerRefund } from "@/app/_lib/data-services";



async function Vouchers() {


  
  const Vdata = await getSellerRefund('928b6b94-3e25-4aba-93d1-2d3c8df29b40');


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

export default Vouchers