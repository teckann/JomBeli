"use client";

import { signOutAction } from "../_lib/actions";

function SignOutButton() {
  return (
    <button className="btn btn-primary" onClick={() => signOutAction()}>
      Logout
    </button>
  );
}

export default SignOutButton;
