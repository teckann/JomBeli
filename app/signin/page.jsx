import LoginButton from "../_components/LoginButton";
import LoginForm from "../_components/LoginForm";

async function page({ searchParams }) {
  const { error, message } = await searchParams;

  return (
    <div>
      <h1>Sign In</h1>

      <LoginForm />

      <div>OR</div>

      <LoginButton />
    </div>
  );
}

export default page;
