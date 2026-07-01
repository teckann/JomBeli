'use client';

import Styles from "./AdminDeactivateVoucherButton.module.css"
import { deactivateVoucher,reactivateVoucher } from "@/app/_lib/actions";
import { useRouter } from 'next/navigation';

export default function AdminDeactivatteVoucherButton({ voucherId,voucherStatus }){
    
    const router = useRouter();
    
    const isActive = voucherStatus === "active"

    const handleClick = async () => {
        if (isActive){
            await deactivateVoucher(voucherId);
            router.refresh();
        } else{
            reactivateVoucher(voucherId);
        }

        router.refresh();        
    }

    return(
        <button className={isActive? Styles.deactivateButton : Styles.activateButton} 
                title={isActive? "Deactivate" : "Activate"} 
                onClick={handleClick}
        >
            {isActive? "Deactivate" : "Activate"}
        </button> 
    )
}