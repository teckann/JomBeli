import SignInForm from "../_components/SignInForm/SignInForm";
import LandingCard from "../_components/LandingCard/LandingCard";

import styles from "./page.module.css";

async function page({ searchParams }) {
  const { error, message } = await searchParams;

  return (
    <main className={styles.main}>
      <LandingCard Form={SignInForm} />
    </main>
  );
}

export default page;
