"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "./server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import hashValue from "./bcrypt";
import { GeneralIDGenerator } from "./random-id-generator";
import getLatLng from "./geo-code-api";

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

export async function makeDefault(userId, addressId, pathname) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("ADDRESSES_T")
    .update({
      is_default: false,
    })
    .eq("user_id", userId)
    .eq("address_status", "Active");

  if (error) {
    console.error(error.message);
    throw new Error("Failed to reset default address");
  }

  const { error: defaultError } = await supabase
    .from("ADDRESSES_T")
    .update({
      is_default: true,
    })
    .eq("user_id", userId)
    .eq("address_id", addressId)
    .eq("address_status", "Active");

  if (defaultError) {
    console.error(defaultError.message);
    throw new Error("Failed to set default address");
  }

  revalidatePath(pathname || "/");
}

export async function removeAddress(userId, addressId, pathname) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("ADDRESSES_T")
    .update({
      address_status: "Delected",
    })
    .eq("user_id", userId)
    .eq("address_id", addressId);

  if (error) {
    console.error(error.message);
    throw new Error("Failed to remove address");
  }

  revalidatePath(pathname || "/");
}

export async function createAddress(formData) {
  const userId = formData.get("userId");
  const redirectPath = formData.get("redirectPath");
  const name = formData.get("name");
  const contact = formData.get("contact");
  const street = formData.get("street");
  const city = formData.get("city");
  const postcode = formData.get("postcode");
  const state = formData.get("state");
  const country = "Malaysia";

  const supabase = await createClient();
  const addressId = GeneralIDGenerator();

  const { data: existingDefault, error: checkError } = await supabase
    .from("ADDRESSES_T")
    .select("address_id")
    .eq("user_id", userId)
    .eq("address_status", "Active")
    .eq("is_default", true);

  if (checkError) {
    console.error("Check default address failed:", checkError);
    throw new Error("Failed to check default address");
  }

  const hasDefault = existingDefault && existingDefault.length > 0;

  const fullAddress = [street, city, postcode, state, country]
    .filter(Boolean)
    .join(", ");

  const { lat, lng } = await getLatLng(fullAddress);

  if (!lat || !lng) {
    return "failed";
  }

  const { data, error } = await supabase
    .from("ADDRESSES_T")
    .insert({
      address_id: addressId,
      user_id: userId,
      recipient_name: name,
      recipient_contact_number: contact,
      street,
      city,
      state,
      postcode,
      country,
      is_default: !hasDefault,
      lat,
      lng,
    })
    .select()
    .single();

  if (error) {
    console.error("Insert address failed:", error);
    throw new Error("Failed to create address");
  }

  revalidatePath(redirectPath || "/");
  return data;
}
