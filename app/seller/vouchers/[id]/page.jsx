import React from 'react'

import styles from './voucher.module.css';

import { getUser } from "@/app/_lib/auth";
import { getUserInfo } from "@/app/_lib/data-services";
import { getOneVoucher } from "@/app/_lib/data-services";
import EditVoucher from '@/app/_components/SellerVoucher/EditVoucher';


const Voucher = async ({ params }) => {


    
  
    const user = await getUser();
    const userInfo = await getUserInfo(user.id);

    const { id } = await params;
    const oneVoucher = await getOneVoucher(id);

  return (
    <div className={styles.container}>
      <main className={styles.main}>


        <EditVoucher oneVoucher={oneVoucher} userInfo={userInfo} />


      </main>





    </div>
  )
}

export default Voucher