"use client";

import Link from "next/link";
import { safetyQuestionValidation } from "../../_lib/actions";
import styles from "./SecurityQuestionVerificationForm.module.css";

function SecurityQuestionVerificationForm({
  handleIsClicked,
  userId,
  securityQuestion1,
  securityQuestion2,
}) {
  return (
    <div className={styles.container}>
      <p className={styles.dividerText}>
        Please answer your security questions to proceed.
      </p>
      <form action={safetyQuestionValidation} className={styles.form}>
        <input type="hidden" name="id" value={userId} />

        <div className={styles.inputGroup}>
          <p>{securityQuestion1}</p> <br />
          <input
            type="text"
            id="answer1"
            name="answer1"
            placeholder="Enter your answer"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <p>{securityQuestion2}</p> <br />
          <input
            type="text"
            id="answer2"
            name="answer2"
            placeholder="Enter your answer"
            required
          />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          onClick={handleIsClicked}
        >
          Verify
        </button>

        <Link href="/forgot">
          <button className={styles.backButton}>Back to Previous Step</button>
        </Link>
      </form>
    </div>
  );
}

export default SecurityQuestionVerificationForm;
