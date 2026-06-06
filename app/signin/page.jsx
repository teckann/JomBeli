import SignInForm from "../_components/SignInForm";
import Image from "next/image";

import styles from "./page.module.css";

async function page({ searchParams }) {
  const { error, message } = await searchParams;

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.landing_img_container}>
          <Image
            className={styles.landing_img}
            src="/landing-3d.png"
            alt="Signin Landing Image"
            fill
            priority
          />
        </div>

        <div className={styles.form_container}>
          <SignInForm />
        </div>
      </div>
    </main>
  );
}

export default page;
