"use client";

import Link from "next/link";
import { signInWithEmailAction } from "../../_lib/actions";
import styles from "./SignInForm.module.css";

export default function SignInForm() {
  return (
    <div className={styles.container}>
      <p className={styles.dividerText}>Or continue with email address</p>
      <form action={signInWithEmailAction} className={styles.form}>
        <div className={styles.inputGroup}>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email address"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            required
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Sign In
        </button>
      </form>

      <p className={styles.signupText}>
        Don&apos;t have an account?{" "}
        <Link href="#" className={styles.signupLink}>
          Sign Up
        </Link>
      </p>
    </div>
  );
}
