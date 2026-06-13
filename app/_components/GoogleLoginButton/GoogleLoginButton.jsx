"use client";

import { signInWithGoogleAction } from "../../_lib/actions";
import styles from "./GoogleLoginButton.module.css";
import Image from "next/image";

export default function GoogleLoginButton() {
  return (
    <div className={styles.container}>
      <p className={styles.title}>Sign in with open account</p>

      <button
        className={styles.googleButton}
        onClick={() => signInWithGoogleAction()}
      >
        <Image
          src="/google-logo.png"
          alt="Google"
          width={20}
          height={20}
          className={styles.icon}
        />
        Google
      </button>
    </div>
  );
}
