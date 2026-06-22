"use client";

import Link from "next/link";
import { signInWithEmailAction } from "../../_lib/actions";
import styles from "./SignInForm.module.css";
import { useFormStatus } from "react-dom";
import SpinnerMini from "../SpinnerMini/SpinnerMini";

function SignInForm({ handleIsClicked }) {
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
            onClick={(e) => (e.target.value = "limjinming0609@gmail.com")}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            onClick={(e) => (e.target.value = "jimmy123")}
            required
          />
        </div>

        <Link href="/forgot" className={styles.forgotLink}>
          Forgot Password?
        </Link>

        <SubmitButton handleIsClicked={handleIsClicked} />
      </form>

      <p className={styles.signupText}>
        Don&apos;t have an account?{" "}
        <Link href="/signup" className={styles.signupLink}>
          Sign Up
        </Link>
      </p>
    </div>
  );
}

const SubmitButton = ({ handleIsClicked }) => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={styles.submitButton}
      onClick={handleIsClicked}
    >
      {pending ? <SpinnerMini /> : "Sign In"}
    </button>
  );
};

export default SignInForm;
