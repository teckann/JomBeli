"use server";

import { createClient } from "./server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function signInWithGoogleAction() {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
      flowType: "pkce",
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.error("Sign in error:", error.message);
    redirect("/signin?error=Sign in failed. Please try again.");
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signInWithEmailAction(formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Sign in error:", error.message);
    redirect("/signin?error=Invalid email or password. Please try again.");
  }

  // here got redirect problem
  redirect("/");
}

export async function signOutAction() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Sign out error:", error);
  }

  revalidatePath("/");
  redirect("/signin");
}

export async function updateProfileAction(formData) {
  const supabase = await createClient();
  const fullName = formData.get("fullName");

  const { error } = await supabase.auth.updateUser({
    data: { full_name: fullName },
  });

  if (error) throw new Error("Could not update profile");

  revalidatePath("/profile");
}

export async function signUpWithEmailAction(formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const role = formData.get("role");
  const supabase = await createClient();

  if (password !== confirmPassword) {
    return redirect("/signup?error=Passwords do not match.");
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  if (!passwordRegex.test(password)) {
    return redirect(
      "/signup?error=Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
    );
  }

  // register user in auth table
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("Sign up error:", error.message);
    // debug
    // return redirect(`/signup?error=${encodeURIComponent(error.message)}`);

    return redirect(
      "/signup?error=This email is already registered. Try signing in instead.",
    );
  }

  // retrieve user data from auth table
  const user = data.user;

  if (!user) {
    return redirect("/signup?error=User creation failed.");
  }

  const { error: insertError } = await supabase.from("USERS_T").insert([
    {
      user_id: user.id,
      email: email,
      role: role,
    },
  ]);

  if (insertError) {
    console.error("Insert USER_T error:", insertError.message);

    // return redirect("/signup?error=Failed to create user profile.");
    return redirect(`/signup?error=${encodeURIComponent(insertError.message)}`);
  }

  return redirect("/signin?message=Your account is ready. Sign in now!");
}
