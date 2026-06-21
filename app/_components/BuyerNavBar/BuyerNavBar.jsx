import { getUser } from "@/app/_lib/auth";
import { getWalletBalance } from "@/app/_lib/data-services";
import BuyerNavBarClient from "./BuyerNavClient";

export default async function BuyerNavBar() {
  const user = await getUser();
  const balance = await getWalletBalance(user.id);

  return <BuyerNavBarClient user={user} balance={balance} />;
}