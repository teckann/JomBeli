import Link from "next/link";
import styles from "./not-found.module.css";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className={styles.main}>
      <div className={styles.img_container}>
        <Image
          className={styles.img}
          src="/page-not-found.png"
          alt="Signin Landing Image"
          fill
          priority
        />
      </div>
      <h1 className={styles.title}>This page could not be found :(</h1>
      <Link href="/signin" className={styles.button}>
        Go back home
      </Link>
    </main>
  );
}
