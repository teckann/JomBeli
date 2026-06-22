import VoucherTable from '@/app/_components/SellerTable/voucherTable';
import styles from './vouchers.module.css'

import { getSellerVoucher } from "@/app/_lib/data-services";


async function Vouchers() {

    const Vdata = await getSellerVoucher('928b6b94-3e25-4aba-93d1-2d3c8df29b40');

  return (
    <div className={styles.fcon}>
        <span className={styles.head}>

            <h1 className={styles.h1}>Vouchers Management</h1>

            <button className={styles.button}>Create New Vouchers</button>
            
        </span>

        <div className={styles.scon}>

            

                <VoucherTable data={Vdata} />

        <div className={styles.rightside}>
            
            <div className={styles.specialDay}>
                Today is lalalala day (with calendar)
            </div>

        <div className={styles.blockReal}>
            <div className={styles.realTime}>

                l***m used ticket name <br /> <br />
                l***m used ticket name with a long anme <br /> <br />
                l***m used ticket name <br /> <br />
                l***m used ticket name <br /> <br />
                l***m used ticket name <br /> <br />
                l***m used ticket name <br /> <br />
                l***m used ticket name <br /> <br />
                l***m used ticket name <br /> <br />
                l***m used ticket name <br /> <br />
                l***m used ticket name <br /> <br />
                l***m used ticket name <br /> <br />
                l***m used ticket name <br /> <br />
                l***m used ticket name <br /> <br />
                l***m used ticket name <br /> <br />


            </div>


        </div>
            

        </div>
                
            



        </div>


    </div>
  )
}

export default Vouchers