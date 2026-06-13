"use client";

import { signOutAction } from "../_lib/actions";

export default function SignOutButton() {
  return <button onClick={() => signOutAction()}>Logout</button>;
}
