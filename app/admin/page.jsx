import SignOutButton from "../_components/SignOutButton";
import ThemeToggleButton from "../_components/ThemeToggleButton";
import { getUser } from "../_lib/auth";
import { getUserInfo } from "../_lib/data-services";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function Home() {

    redirect("/admin/Dashboard");

}
