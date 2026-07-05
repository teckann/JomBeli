import React from 'react'
import SellerProfile from '@/app/_components/SellerProfile/SellerProfile';

import { getUser } from "@/app/_lib/auth";
import { getUserInfo } from "@/app/_lib/data-services";

const profile = async () => {

      const user = await getUser();
      // console.log(user);
    
      const userInfo = await getUserInfo(user.id);
    
  return (
    <SellerProfile userInfo={userInfo} />
  )
}

export default profile
