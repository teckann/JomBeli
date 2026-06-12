"use client";

import Image from "next/image";
import styles from "../_component_styles/LandingCard.module.css";
import LandingWarningBanner from "./LandingWarningBanner";
import { useState } from "react";

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
          {validationStatus ? (
            <LandingWarningBanner message={validationFailMessage} />
          ) : null}
          <Form />
        </div>
      </div>
    </div>
  );
}

export default LandingCard;
