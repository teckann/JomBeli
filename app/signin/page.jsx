import SignInForm from "../_components/SignInForm";

async function page({ searchParams }) {
  const { error, message } = await searchParams;

  return (
    <div>
      <h1>Sign In</h1>
      <SignInForm />
    </div>
  );
}

export default page;
