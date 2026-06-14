"use client";

import Link from "next/link";
import { signUpWithEmailAction } from "../../_lib/actions";
import styles from "./SignUpForm.module.css";

function SignUpForm() {
  return (
    <div className={styles.container}>
      <p className={styles.dividerText}>One step closer to getting started</p>
      <form action={signUpWithEmailAction} className={styles.form}>
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

        <div className={styles.inputGroup}>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
          />
        </div>

        <div className={styles.roleContainer}>
          <p className={styles.roleText}>Select your preferred role</p>

          <div className={styles.roleOptions}>
            <label>
              <input
                type="radio"
                className={styles.radio}
                name="role"
                value="Buyer"
                defaultChecked
              />
              Buyer
            </label>

            <label>
              <input
                type="radio"
                className={styles.radio}
                name="role"
                value="Seller"
              />
              Seller
            </label>
          </div>
        </div>

        <button type="submit" className={styles.submitButton}>
          Sign Up Now
        </button>
      </form>

      <p className={styles.signupText}>
        Have an account already?{" "}
        <Link href="/signin" className={styles.signupLink}>
          Sign In
        </Link>
      </p>
    </div>
  );
}

export default SignUpForm;
