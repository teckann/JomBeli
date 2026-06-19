import { redirect } from "next/navigation";
import resetPasswordForm from "../_components/resetPasswordForm/resetPasswordForm";
import LandingCard from "../_components/LandingCard/LandingCard";

import styles from "./page.module.css";

export const metadata = {
  title: "Reset Password",
};

async function page({ searchParams }) {
  const { id, status, error, message } = await searchParams;

  if (!id && !status) redirect("/signin");

  if (status === "pass")
    return (
      <main className={styles.main}>
        <LandingCard
          Form={resetPasswordForm}
          title="Set New Password"
          message={message}
          error={error}
          userId={id}
        />
      </main>
    );
}

export default page;
