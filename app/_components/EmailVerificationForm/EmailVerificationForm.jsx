"use client";

import Link from "next/link";
import { emailVerification } from "../../_lib/actions";
import styles from "./EmailVerificationForm.module.css";

function EmailVerificationForm({ handleIsClicked }) {
  return (
    <div className={styles.container}>
      <p className={styles.dividerText}>
        Don&apos;t worry! We will guide you to reset your password.
      </p>
      <form action={emailVerification} className={styles.form}>
        <div className={styles.inputGroup}>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email address"
            required
          />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          onClick={handleIsClicked}
        >
          Submit
        </button>

        <Link href="/signin">
          <button className={styles.backButton}>Back to Sign In</button>
        </Link>
      </form>
    </div>
  );
}

export default EmailVerificationForm;
