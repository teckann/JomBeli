import SignOutButton from "./_components/SignOutButton";
import ThemeToggleButton from "./_components/ThemeToggleButton";
import { getUser } from "./_lib/auth";
import { getUserInfo } from "./_lib/data-services";

export const revalidate = 0;

export default async function Home() {
  const user = await getUser();
  // console.log(user);

  const userInfo = await getUserInfo(user.id);

  return (
    <div>
      <h1>Home Page</h1>

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

      <SignOutButton />
      <br />
      <ThemeToggleButton />
    </div>
  );
}
