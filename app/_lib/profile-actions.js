"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "./server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import hashValue from "./bcrypt";

export async function updateUserProfile(formData) {
  const supabase = await createClient();

  const userId = formData.get("userId");
  const redirectPath = formData.get("redirectPath");
  const username = formData.get("username");
  const gender = formData.get("gender");
  const contact_number = formData.get("contact_number");

  const { error } = await supabase
    .from("USERS_T")
    .update({
      username,
      gender,
      contact_number,
    })
    .eq("user_id", userId);

  if (error) {
    console.error(error.message);
    throw new Error("Failed to update profile");
  }

  revalidatePath(redirectPath || "/");
}

export async function updateUserPassword(formData) {
  const userId = formData.get("userId");
  const redirectPath = formData.get("redirectPath");
  const newPassword = formData.get("newPassword");

  const supabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  const { error } = await supabase.auth.admin.updateUserById(userId, {
    password: newPassword,
  });

  if (error) {
    console.error(error.message);
    throw new Error("Failed to update password");
  }

  revalidatePath(redirectPath || "/");
}

export async function updateUserSecurity(formData) {
  const supabase = await createClient();

  const userId = formData.get("userId");
  const redirectPath = formData.get("redirectPath");

  const q1 = formData.get("q1");
  const a1 = await hashValue(formData.get("a1"));
  const q2 = formData.get("q2");
  const a2 = await hashValue(formData.get("a2"));

  const { error } = await supabase
    .from("USERS_T")
    .update({
      security_question1: q1,
      answer1: a1,
      security_question2: q2,
      answer2: a2,
    })
    .eq("user_id", userId);

  if (error) {
    console.error(error.message);
    throw new Error("Failed to update security questions & answers");
  }

  revalidatePath(redirectPath || "/");
}
