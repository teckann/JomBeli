"use client";

import { signOutAction } from "../_lib/actions";

export default function LogoutButton() {
    return <button onClick={() => signOutAction()}>Logout</button>;
}
