"use client";

import { updateSystemSupportSolved } from '@/app/_lib/actions';
import Styles from './AdminSolveSupportButton.module.css';
import { useRouter } from 'next/navigation'

export default function AdminSolveSupportButton({supportId, adminId, supportStatus}) {

    const isAble = supportStatus === "Pending";
    const router = useRouter();

    const handleClick = async () => {
        await updateSystemSupportSolved(supportId, adminId);
        router.refresh();
    }

    return (
        <button onClick={handleClick} disabled={!isAble} className={`${isAble ? Styles.green : Styles.grey} btn btn-primary`}>
            {isAble ? "Solve" : "Solved"}
        </button>
    )
}