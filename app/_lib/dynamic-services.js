import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export async function getSingleProduct(productId) {
  const { data, error } = await supabase
    .from("PRODUCTS_T")
    .select("*")
    .eq("product_id", productId)
    .single();

  if (error) {
    console.error("Failed to fetch single product:", error.message);
    throw new Error("Could not Fetch Product Info");
  }

  return data;
}

export async function getProducts() {
  const { data, error } = await supabase
    .from("PRODUCTS_T")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch products:", error.message);
    throw new Error("Could not fetch products");
  }

  return data;
}

export async function getProductOptions(productId) {
  const { data, error } = await supabase
    .from("PRODUCT_OPTIONS_T")
    .select("option_id, option_name")
    .eq("product_id", productId);

  if (error) {
    console.error("Failed to fetch product options:", error.message);
    throw new Error("Could not fetch product options");
  }

  return data;
}

export async function getOptionValues(optionId) {
  const { data, error } = await supabase
    .from("PRODUCT_OPTION_VALUES_T")
    .select("option_value")
    .eq("option_id", optionId);

  if (error) {
    console.error("Failed to fetch product option values:", error.message);
    throw new Error("Could not fetch product option values");
  }

  return data;
}

export async function getSKU(productId) {
  const { data, error } = await supabase
    .from("PRODUCT_VARIANTS_T")
    .select(
      "product_variant_id, sku, product_variant_price, product_variant_stock, product_variant_status",
    )
    .eq("product_id", productId)
    .eq("product_variant_status", "Active");

  if (error) {
    console.error("Failed to fetch sku:", error.message);
    throw new Error("Could not fetch sku");
  }

  return data;
}
