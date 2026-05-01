"use client";

import { signInWithGoogleAction } from "../_lib/actions";

export default function LoginButton() {
  return <button onClick={() => signInWithGoogleAction()}>Login with Google</button>;
}
