"use client";

import Image from "next/image";
import styles from "./LandingCard.module.css";
import LandingWarningBanner from "../LandingWarningBanner/LandingWarningBanner";
import { useState } from "react";
import GoogleLoginButton from "../GoogleLoginButton/GoogleLoginButton";

function LandingCard({ Form, title, message, error }) {
  // const [validationStatus, setValidationStatus] = useState(false);
  // const [validationFailMessage, setValidationFailMessage] = useState("");
  const [isClicked, setIsClicked] = useState(false);

  const handleIsClicked = () => {
    setIsClicked(true);
  };

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
            <h1 className={styles.title}>{title}</h1>

            {/* account successful created message, it will disappear when user click the signin button */}
            {message && !isClicked && (
              <p className={styles.success_msg}>{message}</p>
            )}

            {/* error message when login credential incorrect */}
            {error && <p className={styles.error_msg}>{error}</p>}
          </div>

          {/* signin & signup & forgot share one component, so I do like this to make sure google login will be hidden in signup & forgot page */}
          {title === "Sign in" && <GoogleLoginButton />}

          {/* pass to form to handle the message disappear logic */}
          <Form handleIsClicked={handleIsClicked} />
        </div>
      </div>
    </div>
  );
}

export default LandingCard;
