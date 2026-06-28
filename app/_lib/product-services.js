import { createClient } from "./server";

export async function getFilterProducts(category) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("PRODUCTS_T")
    .select("*")
    .eq("category", category);

  if (error) {
    console.error("Failed to fetch filter products:", error.message);
    return [];
  }

  return data;
}
