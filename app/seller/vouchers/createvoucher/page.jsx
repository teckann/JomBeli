import React from 'react'
import styles from './createvoucher.module.css';
import VoucherForm from '@/app/_components/SellerVoucher/VoucherForm';
import Image from 'next/image';


import { getUser } from "@/app/_lib/auth";
import { getUserInfo} from "@/app/_lib/data-services";




const CreateVoucher = async() => {

    
    const user = await getUser();
    // console.log(user);

    const userInfo = await getUserInfo(user.id);



  return (
    <div className={styles.fcon}>
      
      <h1 className={styles.pageTitle}>Creating New Voucher</h1>

      <div className={styles.scon}>
        
        <div className={styles.left}>
          <div className={styles.profile}>
            <Image src={userInfo.avatar} alt={userInfo.username} width={100} height={100} className={styles.profileAvatar} />
          </div>
        </div>

        <div className={styles.right}>
            
            <VoucherForm id={user.id} />
        </div>

      </div>
    </div>
  )
}

export default CreateVoucher