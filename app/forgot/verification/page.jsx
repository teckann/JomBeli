import { redirect } from "next/navigation";
import { getUserInfo } from "@/app/_lib/data-services";
import EmailVerificationForm from "@/app/_components/SecurityQuestionVerificationForm/SecurityQuestionVerificationForm";
import LandingCard from "@/app/_components/LandingCard/LandingCard";

import styles from "./page.module.css";

export const metadata = {
  title: "Forgot Password",
};

async function page({ searchParams }) {
  const { id, error, message } = await searchParams;

  if (!id) redirect("/signin");

  const userInfo = await getUserInfo(id);

  return (
    <main className={styles.main}>
      <LandingCard
        Form={EmailVerificationForm}
        title="Verify Your Identity"
        userId={id}
        securityQuestion1={userInfo.security_question1}
        securityQuestion2={userInfo.security_question2}
        message={message}
        error={error}
      />
    </main>
  );
}

export default page;
