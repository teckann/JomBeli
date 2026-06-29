'use client';

import Styles from "./AdminDeactivateUserButton.module.css"
import { deactivateUser,reactivateUser } from "@/app/_lib/actions";
import { useRouter } from 'next/navigation';

export default function AdminDeactivatteUserButton({ userId,userStatus }){
    
    const router = useRouter();
    
    const isActive = userStatus === "Active"

    const handleClick = async () => {
        if (isActive){
            await deactivateUser(userId);
            router.refresh();
        } else{
            reactivateUser(userId);
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