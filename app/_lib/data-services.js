import { createClient } from "./server";

export async function getUserInfo(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("USERS_T")
    .select("*")
    .eq("user_id", id)
    .single();

  if (error) return null;
  return data;
}

export async function initializeNewUser(id, fullName) {
  const existing = await getUserInfo(id);

  if (!existing) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("USERS_T")
      .insert([{ user_id: id, username: fullName }])
      .select()
      .single();

    if (error) {
      console.error("Failed to Create New User", error.message);
      throw new Error("Could not create new user");
    }

    return data;
  }
  return existing;
}

export async function getProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("PRODUCTS_T").select("*");

  if (error) {
    console.error("Failed to fetch products:", error.message);
    throw new Error("Could not fetch products");
  }

  return data;
}

export async function getWalletBalance(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("USERS_T")
    .select("balances")
    .eq("user_id", id)
    .single();

  if (error) {
    console.error("Failed to fetch balance:", error.message);
    throw new Error("Could not fetch balance");
  }

  return data;
}
