import { getUserInfo } from "@/app/_lib/data-services";
import { getUser } from "@/app/_lib/auth";

import styles from "./BuyerChatNavBar.module.css";
import Image from "next/image";
import Link from "next/link";

async function BuyerChatNavBar() {
  const user = await getUser();

  const menu = [
    { path: "/buyer", name: "Home" },
    { path: "#", name: "My Orders" },
    { path: "#", name: "Report a Concern" },
    { path: "#", name: "Settings" },
  ];

  const { avatar, username } = await getUserInfo(user.id);
  return (
    <div className={styles.main}>
      <div className={styles.userInfo}>
        <div className={styles.avatarContainer}>
          <Image src={avatar} alt="avatar" fill className={styles.avatar} />
        </div>
        <Link href="#" className={styles.username}>
          {username}
        </Link>
      </div>

      <div className={styles.menu}>
        {menu.map((item) => (
          <Link key={item.name} href={item.path} className={styles.link}>
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default BuyerChatNavBar;
