import Image from "next/image";

import styles from "./ProfileHeader.module.css";
import { getUserInfo } from "@/app/_lib/data-services";
import { getAccountSecurityLevel } from "@/app/_lib/profile-services";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import LogoutButton from "../LogoutButton/LogoutButton";

async function ProfileHeader({ userId, lastSignin, createdat }) {
  const { avatar, username, email } = await getUserInfo(userId);

  return (
    <div className={styles.profileHeader}>
      <Image
        className={styles.avatar}
        src={avatar}
        alt="Profile Photo"
        width={200}
        height={200}
      />

      <div className={styles.subProfileHeader}>
        <div className={styles.subDiv1}>
          <div className={styles.div1General}>
            <p className={styles.username}>{username}</p>

            <div className={styles.specificInfo}>
              <p>UID: {userId}</p>
              <p>Email: {email}</p>
            </div>
          </div>

          <AccountSecurityDetection userId={userId} />
        </div>

        <div className={styles.subDiv2}>
          <div className={styles.actions}>
            <ThemeToggle />
            <LogoutButton />
          </div>

          <div className={styles.lastSignin}>
            <p>Last sign in at {lastSignin}</p>
            <p>Account created at {createdat}</p>
            <p></p>
          </div>
        </div>
      </div>
    </div>
  );
}

const AccountSecurityDetection = async ({ userId }) => {
  const { status, message } = await getAccountSecurityLevel(userId);

  return (
    <div className={`${styles.securityCard} ${styles[status]}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        className={styles.infoIcon}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.25 11.25h1.5v4.5h-1.5m.75-8.25h.008v.008H12V7.5z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p>{message}</p>
    </div>
  );
};

export default ProfileHeader;
