import SignOutButton from "../_components/SignOutButton";
import StarRating from "../_components/StarRating/StarRating";
import ThemeToggleButton from "../_components/ThemeToggleButton";
import { getUser } from "../_lib/auth";
import { getUserInfo } from "../_lib/data-services";
import { getWalletBalance } from "@/app/_lib/data-services";

export const revalidate = 0;

export default async function Home() {
  const user = await getUser();
  // console.log(user);

  const userInfo = await getUserInfo(user.id);
  const balance = await getWalletBalance(user.id);
  console.log(balance);

  return (
    <div>
      <h1>[Buyer] Home Page</h1>

      <p>
        User ID: <span>{user.id}</span>
      </p>

      <p>
        Status: <span>{user.aud}</span>
      </p>

      <p>
        Name: <span>{userInfo.username}</span>
      </p>

      <p>
        Email: <span>{user.email}</span>
      </p>

      <p>
        Balance: <span>RM{balance.balances}</span>
      </p>

      <SignOutButton />
      <br />
      <ThemeToggleButton />
      <br />

      {/* testing */}
      <StarRating />
    </div>
  );
}
