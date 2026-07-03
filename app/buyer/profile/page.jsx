import ProfileHeader from "@/app/_components/ProfileHeader/ProfileHeader";

import styles from "./page.module.css";
import { getUser } from "@/app/_lib/auth";
import ProfileInfo from "@/app/_components/ProfileInfo/ProfileInfo";
import { getUserInfo } from "@/app/_lib/data-services";
import ProfileSecurity from "@/app/_components/ProfileSecurity/ProfileSecurity";

export const metadata = {
  title: "Profile",
};

async function page() {
  const {
    id,
    last_sign_in_at: lastSignin,
    confirmed_at: confirmedat,
  } = await getUser();

  const user = await getUserInfo(id);

  return (
    <main className={styles.main}>
      <ProfileHeader
        userId={id}
        lastSignin={formatDateTime(lastSignin)}
        createdat={formatDateTime(confirmedat)}
      />

      <ProfileInfo user={user} />

      <ProfileSecurity user={user} />
    </main>
  );
}

const formatDateTime = (datetime) => {
  const date = new Date(datetime);
  return `${date.toLocaleDateString("en-CA")} ${date.toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    },
  )}`;
};

export default page;
