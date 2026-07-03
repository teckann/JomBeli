import ProfileHeader from "@/app/_components/ProfileHeader/ProfileHeader";

import styles from "./page.module.css";
import { getUser } from "@/app/_lib/auth";
import ProfileInfo from "@/app/_components/ProfileInfo/ProfileInfo";
import { getUserInfo } from "@/app/_lib/data-services";
import ProfileSecurity from "@/app/_components/ProfileSecurity/ProfileSecurity";
import { Suspense } from "react";
import Spinner from "@/app/_components/Spinner/Spinner";
import ProfileAddress from "@/app/_components/ProfileAddress/ProfileAddress";
import { getAddresses } from "@/app/_lib/profile-services";

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
  const addresses = await getAddresses(id);

  return (
    <main className={styles.main}>
      <Suspense fallback={<Spinner />}>
        <ProfileHeader
          userId={id}
          lastSignin={formatDateTime(lastSignin)}
          createdat={formatDateTime(confirmedat)}
        />
      </Suspense>

      <ProfileInfo user={user} />

      <ProfileSecurity user={user} />

      <ProfileAddress user={user} addresses={addresses} />
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
