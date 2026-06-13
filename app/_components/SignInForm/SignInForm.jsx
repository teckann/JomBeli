"use client";

import { signInWithEmailAction } from "../../_lib/actions";
import { signInWithGoogleAction } from "../../_lib/actions";
import styles from "./SignInForm.module.css";

export default function SignInForm() {
  return (
    <form action={signInWithEmailAction} className={styles.form}>
      <p>Or continue with email address</p>
      <div>
        <label>Email</label>
        <input type="email" id="email" name="email" required />
      </div>

      <div>
        <label>Password</label>
        <input type="password" id="password" name="password" required />
      </div>

      <div>
        <a href="#">Forgot Password?</a>
      </div>

      <button type="submit">Sign In</button>

      <button onClick={() => signInWithGoogleAction()}>
        Login with Google
      </button>

      <p>
        Don&apos;t have an account? <a href="#">Sign Up</a>
      </p>
    </form>
  );
}
