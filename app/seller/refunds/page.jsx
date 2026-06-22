import SellerTable from '@/app/_components/SellerTable/SellerTable';
import styles from './refunds.module.css'

import { getSellerVoucher } from "@/app/_lib/data-services";


async function Vouchers() {

    const Vdata = [
  {
    "refund_id": "2",
    "user_id": "928b6b94-3e25-4aba-93d1-2d3c8df29b40",
    "refund_subject": "eallalalalale",
    "voucher_type": "shop",
    "discount_value": 2,
    "max_spend": null,
    "min_spend": null,
    "quantity": null,
    "start_date": null,
    "end_date": null,
    "voucher_status": "inactive",
    "created_at": "2026-06-21T12:39:03.923235+00:00"
  },
  {
    "refund_id": "1",
    "user_id": "928b6b94-3e25-4aba-93d1-2d3c8df29b40",
    "refund_subject": "hhhahdfuwffhuihi",
    "voucher_type": "shop",
    "discount_value": 20,
    "max_spend": 34,
    "min_spend": 3,
    "quantity": null,
    "start_date": null,
    "end_date": null,
    "voucher_status": "active",
    "created_at": "2026-06-21T12:15:13.988595+00:00"
  }
];

  return (
    <div className={styles.fcon}>
        <span className={styles.head}>

            <h1 className={styles.h1}>Refunds Management</h1>

            
        </span>

        <div className={styles.scon}>

            

                <SellerTable tableHeader={[{header: 'Refund ID', data: 'refund_id'},
                                           {header: 'Refund subject', multiple: (row) => <> Refund Subject: {row.refund_subject} </>},
                                           {header: 'Value', data: 'discount_value'},
                                           {header: 'Refund by', multiple: (row) => `${row.start_date}`}, 
                                           {header: '', multiple: (row) => 
                                           <>
                                                <a href="">view</a>

                                           </>}]} 
                             data={Vdata} />

 
                
            



        </div>


    </div>
  )
}

export default Vouchers