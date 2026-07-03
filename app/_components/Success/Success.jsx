"use client";

import Image from "next/image";
import styles from "./Success.module.css";
import { useRouter } from "next/navigation";

function Success({ alt, title, desc, specificRoute}) {
  const router = useRouter();

  return (
    <div className={styles.success}>
      <div className={styles.imageContainer}>
        <Image src="/success.png" alt={alt} fill className={styles.image} />
      </div>

      <div className={styles.titleContainer}>
        <h2>{title}</h2>
        <p>{desc}</p>
      </div>

      {!specificRoute
      ?
        <button className={styles.button} onClick={() => router.back()}>
          Go Back
        </button>
      :
        <button className={styles.button} onClick={() => router.replace(specificRoute)}>
          Confirm
        </button>
      }

    </div>
  );
}

export default Success;
