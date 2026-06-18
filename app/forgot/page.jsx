import EmailVerificationForm from "../_components/EmailVerificationForm/EmailVerificationForm";
import LandingCard from "../_components/LandingCard/LandingCard";

import styles from "./page.module.css";

export const metadata = {
  title: "Forgot Password",
};

async function page({ searchParams }) {
  const { error, message } = await searchParams;

  return (
    <main className={styles.main}>
      <LandingCard
        Form={EmailVerificationForm}
        title="Forgot Password?"
        message={message}
        error={error}
      />
    </main>
  );
}

export default page;
