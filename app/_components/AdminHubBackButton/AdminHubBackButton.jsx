"use client";

import { useRouter } from "next/navigation";
import styles from "./AdminHubBackButton.module.css";

function AdminHubBackButton() {
  const router = useRouter();

  return (
    <button className={styles.button} onClick={() => router.back()}>
      <svg
        className={styles.backIcon}
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
      </svg>

      <span>Back</span>
    </button>
  );
}

export default AdminHubBackButton;
