import { getUser } from "@/app/_lib/auth";
import { getUserInfo } from "@/app/_lib/data-services";
import BuyerNavBarClient from "./BuyerNavClient";

export default async function BuyerNavBar() {
  // get auth info (such as id, token, etc.)
  const user = await getUser();

  // get user profile info (USERS_T)
  const userInfo = await getUserInfo(user.id);

  return <BuyerNavBarClient user={userInfo} />;
}
