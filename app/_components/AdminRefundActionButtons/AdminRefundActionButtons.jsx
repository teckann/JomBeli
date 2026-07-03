"use client";

import { useState } from 'react';
import Styles from './AdminRefundActionButtons.module.css';
import { handleAdminRefundAction } from '@/app/_lib/actions';

export default function ActionButtons({isAble, refundId}) {

    // const handleClick = () => {
    //     setIsAbleState(!isAbleState);
    // }

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     await handleAdminRefundAction(new FormData(e.target));

    //     setIsAbleState(!isAbleState);
    // }

    return (
        <div className={ Styles.buttonFrame }>
            <form className={ Styles.formStyle} action={handleAdminRefundAction}>
                <button name="action" type="submit" value="Rejected" disabled={!isAble} className={` ${!isAble && Styles.disable} ${Styles.rejectButton} ${Styles.button}`}>
                    Reject
                </button>
                <button name="action" type="submit" value="Approved" disabled={!isAble} className={` ${!isAble && Styles.disable} ${Styles.approveButton} ${Styles.button}`}>    
                    Approve
                </button>
                <input type="hidden" name="refundId" value={refundId} />
            </form>
        </div>
    )
}