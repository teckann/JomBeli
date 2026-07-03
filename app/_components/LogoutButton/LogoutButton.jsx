"use client";

import { signOutAction } from "@/app/_lib/actions";
import styles from "./LogoutButton.module.css";

function LogoutButton() {
  return (
    <button className={styles.btn} onClick={() => signOutAction()}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
        className={styles.icon}
      >
        <path d="M3.75 3A.75.75 0 003 3.75v16.5c0 .414.336.75.75.75h9.5a.75.75 0 000-1.5H4.5V4.5h8.75a.75.75 0 000-1.5h-9.5z" />
        <path d="M13.47 7.97a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9.75a.75.75 0 010-1.5h5.44l-1.72-1.72a.75.75 0 010-1.06z" />
      </svg>

      <p>Logout</p>
    </button>
  );
}

export default LogoutButton;
