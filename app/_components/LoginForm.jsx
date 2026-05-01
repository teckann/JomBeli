"use client";

import { signInWithEmailAction } from "../_lib/actions";

export default function LoginForm() {
  return (
    <form action={signInWithEmailAction}>
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" required />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" required />
      </div>

      <button type="submit">Sign In</button>
    </form>
  );
}
