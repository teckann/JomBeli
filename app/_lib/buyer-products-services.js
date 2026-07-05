import { createClient } from "./server";

export async function getAllProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("PRODUCTS_T")
    .select("*")
    .eq("product_status", "Active")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch products:", error.message);
    throw new Error("Could not fetch products");
  }

  return data;
}
