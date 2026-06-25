import { createClient } from "./server";
import {} from "./data-services";
import { discoverValidationDepths } from "next/dist/server/app-render/instant-validation/instant-validation";
import { formatUserData } from "./data-services"

export async function getTotalProductsCount() {
    const supabase = await createClient();

    const { count: totalProducts, error } = await supabase
    .from("PRODUCTS_T")
    .select("*", { count: "exact", head: true });

    if (error) {
        console.error(error);
        return 0;
    }

    return totalProducts;
}

export async function getMonthlyProductCreatedCount() {

    const supabase = await createClient();

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const startOfNextMonth = new Date(startOfMonth);
    startOfNextMonth.setMonth(startOfNextMonth.getMonth() + 1);

    const { count: monthlyProducts, error } = await supabase
    .from("PRODUCTS_T")
    .select("*", { count: "exact", head: true })
    .gte("created_at", startOfMonth.toISOString())
    .lt("created_at", startOfNextMonth.toISOString());

    if (error) {
        console.error(error);
        return 0;
    }

    return monthlyProducts;
}

export async function getTotalAvailableProductsCount() {

    const supabase = await createClient();

    const { count: activeProducts, error } = await supabase
    .from("PRODUCTS_T")
    .select("*", { count: "exact", head: true })
    .eq("product_status", "Active");

    if (error) {
        console.error(error);
        return 0;
    }

    return activeProducts;
}

export async function getTotalCategoryCount() {

    const supabase = await createClient();

    const { data, error } = await supabase
            .from("PRODUCTS_T")
            .select("category");

        if (error) {
            console.error(error);
            return 0;
        }

        const totalCategories = new Set(data.map(p => p.category)).size;

        return totalCategories;
}

export async function getFilterManageProducts(category, status, productName) {

    const supabase = await createClient();
    
    if (productName?.trim()) {
        const { data, error } = await supabase
        .from("PRODUCTS_T")
        .select(`
            *,
            USERS_T!PRODUCTS_T_user_id_fkey (
                username
            )
        `)
        .ilike("product_name", `${productName}%`)
        .order("created_at", { ascending: true });

            if (error) {
                console.error(error);
                return [];
            }

            return data;
    }
    else {
        let query = supabase
        .from("PRODUCTS_T")
        .select(`
            *,
            USERS_T!PRODUCTS_T_user_id_fkey (
                username
            )
        `);

        if (category && category !== "All") {
        query = query.eq("category", category);
        }

        if (status) {
        query = query.eq("product_status", status);
        }

        query = query.order("created_at", { ascending: true });

        console.log(query);

        const { data, error } = await query;

        if (error) {
            console.error(error);
            throw new Error("Could not fetch product records");
        }

        return data;
        }
}

export async function getFilterUsers(role, status, username) {

    const supabase = await createClient();
    
    let query = supabase
                .from("USERS_T")
                .select("*, ADDRESSES_T(street, city, state, postcode, country)");

    if (username?.trim()){
      query = query.ilike("username", `%${username}%`);
    }

    if (role && role !== "All"){
      query = query.eq("role",role);
    }

    if (status && status !== "All"){
      query = query.eq("user_status",status);
    }

    query = query.order("created_at", { ascending: true });

    const { data, error } = await query;

    if (error){
      console.error(error);
      return[];
    }

    return formatUserData(data);
}

export async function getProductSales(productId) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ORDER_ITEMS_T")
    .select(`
      quantity,
      subtotal,
      order_id,
      PRODUCT_VARIANTS_T!inner (
        product_id
      )
    `)
    .eq("PRODUCT_VARIANTS_T.product_id", productId);

  if (error) {
    console.error("Fetch sales error:", error);
    throw new Error("Could not fetch product sales");
  }

  const totalOrders = new Set(
    data.map(item => item.order_id)
  ).size;

  const totalQuantitySold = data.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  const totalSales = data.reduce(
    (sum, item) => sum + Number(item.subtotal || 0),
    0
  );

  return {
    totalOrders,
    totalQuantitySold,
    totalSales,
  };
}

export async function getProductReviews(productId) {
  const supabase = await createClient();

  // use product Id to get varient id first
  const { data: variants, error: variantError } = await supabase
    .from("PRODUCT_VARIANTS_T")
    .select("product_variant_id")
    .eq("product_id", productId);

  if (variantError) throw variantError;

  // change to iterable array
  const variantIds = variants.map(v => v.product_variant_id);

  // get orders containing those variants
  const { data: orderItems, error: orderError } = await supabase
    .from("ORDER_ITEMS_T")
    .select("order_id")
    .in("product_variant_id", variantIds);

  if (orderError) throw orderError;

  // remove the repetitive orderid
  const orderIds = [...new Set(orderItems.map(i => i.order_id))];

  // Get review
  const { data: reviews, error: reviewError } = await supabase
    .from("REVIEWS_T")
    .select(`
      review_id,
      product_rating,
      comment,
      created_at,
      USERS_T!REVIEWS_T_user_id_fkey (
        username,
        avatar
      )
    `)
    .in("order_id", orderIds)
    .order("created_at", { ascending: true });

  if (reviewError) throw reviewError;

  return reviews;
}