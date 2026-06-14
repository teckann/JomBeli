import SignUpForm from "../_components/SignUpForm/SignUpForm";
import LandingCard from "../_components/LandingCard/LandingCard";

import styles from "./page.module.css";

export const metadata = {
  title: "Sign Up",
};

async function page() {
  return (
    <main className={styles.main}>
      <LandingCard Form={SignUpForm} />
    </main>
  );
}

export default page;
