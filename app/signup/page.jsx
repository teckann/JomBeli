import SignUpForm from "../_components/SignUpForm/SignUpForm";
import LandingCard from "../_components/LandingCard/LandingCard";

import styles from "./page.module.css";

export const metadata = {
  title: "Sign Up",
};

async function page({ searchParams }) {
  const { error, message } = await searchParams;

  return (
    <main className={styles.main}>
      <LandingCard
        Form={SignUpForm}
        title="Sign up"
        message={message}
        error={error}
      />
    </main>
  );
}

export default page;
