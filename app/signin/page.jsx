import SignInForm from "../_components/SignInForm/SignInForm";
import LandingCard from "../_components/LandingCard/LandingCard";

import styles from "./page.module.css";

export const metadata = {
  title: "Sign In",
};

async function page({ searchParams }) {
  const { error, message } = await searchParams;

  return (
    <main className={styles.main}>
      <LandingCard
        Form={SignInForm}
        title="Sign in"
        message={message}
        error={error}
      />
    </main>
  );
}

export default page;
