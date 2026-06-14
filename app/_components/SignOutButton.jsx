"use client";

import { signOutAction } from "../_lib/actions";
import Style from "@/app/_styles/globals.css"

export default function SignOutButton() {
  return <button className="btn btn-primary" onClick={() => signOutAction()}>Logout</button>;
}
