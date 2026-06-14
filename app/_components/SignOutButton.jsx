"use client";

import { signOutAction } from "../_lib/actions";

function SignOutButton() {
  return <button onClick={() => signOutAction()}>Logout</button>;
}

export default SignOutButton;
