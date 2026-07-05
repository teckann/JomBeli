import VoucherTable from '@/app/_components/SellerTable/voucherTable';
import styles from './vouchers.module.css'
import Link from 'next/link';

import Image from 'next/image';


import { getSellerVoucher } from "@/app/_lib/data-services";

import { getUsedVoucher } from "@/app/_lib/data-services";


import { getUser } from "@/app/_lib/auth";
import { getUserInfo } from "@/app/_lib/data-services";

async function Vouchers() {

      
      const user = await getUser();
    
      const userInfo = await getUserInfo(user.id);

      
    const used = await getUsedVoucher(user.id);
      

    const Vdata = await getSellerVoucher(user.id);

  return (
    <div className={styles.fcon}>
        <span className={styles.head}>

            <h1 className={styles.h1}>Vouchers Management</h1>

            <div className={styles.sticky}>

                
                    <Link href="/seller/vouchers/createvoucher" className={styles.button}>
                        Create New Vouchers
                    </Link>



            </div>


        </span>

        <div className={styles.scon}>

            

                <VoucherTable data={Vdata} />

        <div className={styles.rightside}>
            

        <div className={styles.blockReal}>
            <div className={styles.realTime}>

                {used.length === 0 ? (
                            <p className={styles.emptyFeed}>No Voucher yet.</p>
                        ) : (
                            used.map((usedVoucher, index) => {

                                
                                const buyer = usedVoucher.USERS_T;
                                const voucher = usedVoucher.VOUCHERS_T;
                                const isUsed = usedVoucher.user_voucher_status === 'used';

                                return (
                                    <div key={index} className={styles.feedItem}>
                                        <div className={styles.feedAvatar}>
                                            <Image 
                                                src={buyer?.avatar || '/default-avatar.png'} 
                                                alt="avatar" 
                                                width={35} 
                                                height={35} 
                                                className={styles.avatarImg}
                                            />
                                        </div>
                                        <div className={styles.feedText}>
                                            <p className={styles.feedDesc}>
                                                <strong>{(buyer?.username || 'User')}</strong> {isUsed ? 'used' : 'claimed'}{' '}
                                                <span className={styles.highlight}>{voucher?.voucher_name}</span>
                                            </p>
                                            <p className={styles.feedTime}>
                                                {isUsed ? usedVoucher.used_date : usedVoucher.claimed_date}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })
                        )}

            </div>


        </div>
            

        </div>
                
            



        </div>


    </div>
  )
}

export default Vouchers