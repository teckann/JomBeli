import LogoutButton from "./_components/LogoutButton";
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
        Name: <span>{userInfo.fullName}</span>
      </p>

      <p>
        Email: <span>{user.email}</span>
      </p>

      <LogoutButton /><br />
      <ThemeToggleButton/>
    </div>
  );
}
