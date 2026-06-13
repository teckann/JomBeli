"use client";

import Image from "next/image";
import styles from "./LandingCard.module.css";
import LandingWarningBanner from "../LandingWarningBanner/LandingWarningBanner";
import { useState } from "react";
import GoogleLoginButton from "../GoogleLoginButton/GoogleLoginButton";

function LandingCard({ Form }) {
  const [validationStatus, setValidationStatus] = useState(false);
  const [validationFailMessage, setValidationFailMessage] = useState("");

  return (
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
        <div className={styles.form}>
          <div>
            <h1 className={styles.title}>Sign in</h1>
          </div>

          <GoogleLoginButton />
          <Form />
        </div>
      </div>
    </div>
  );
}

export default LandingCard;
