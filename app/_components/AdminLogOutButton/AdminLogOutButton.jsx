"use client";

import { signOutAction } from "@/app/_lib/actions";
import Styles from "./AdminLogOutButton.module.css";

export default function AdminLogOutButton() {
    return (
        <button className={Styles.btn} title="Log Out" onClick={() => signOutAction()}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={24} height={24} className={Styles.logOutIcon}>
                <path fill="currentColor" fillRule="evenodd" d="M6 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h11a1 1 0 1 0 0-2H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h11a1 1 0 1 0 0-2H6Zm9.707 4.293a1 1 0 1 0-1.414 1.414L16.586 11H8a1 1 0 1 0 0 2h8.586l-2.293 2.293a1 1 0 0 0 1.414 1.414l4-4a1 1 0 0 0 0-1.414l-4-4Z" clipRule="evenodd" />
            </svg>
        </button>       
    );
}