"use client";

import Link from "next/link";
import { resetPasswordAction } from "../../_lib/actions";
import styles from "./resetPasswordForm.module.css";

function resetPasswordForm({ handleIsClicked, userId }) {
  return (
    <div className={styles.container}>
      <p className={styles.dividerText}>
        Perfect! Go ahead and reset your password.
      </p>
      <form action={resetPasswordAction} className={styles.form}>
        <input type="hidden" name="id" value={userId} />

        <div className={styles.inputGroup}>
          <p>New Password</p> <br />
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            placeholder="Enter new password"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <p>Confirm New Password</p> <br />
          <input
            type="password"
            id="confirmNewPassword"
            name="confirmNewPassword"
            placeholder="Enter new password again"
            required
          />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          onClick={handleIsClicked}
        >
          Reset Password
        </button>

        <Link href="/signin">
          <button className={styles.backButton}>Cancel</button>
        </Link>
      </form>
    </div>
  );
}

export default resetPasswordForm;
