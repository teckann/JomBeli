import { createClient } from "./server";
import {} from "./data-services";
import { discoverValidationDepths } from "next/dist/server/app-render/instant-validation/instant-validation";
import { formatData } from "./data-services"

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
                .select("*, ADDRESSES_T(street, city, state, postcode, country)")
                .in("role",["Buyer","Seller"]);

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

    return formatData(data);
}

export async function getFilterAdmin(status, username) {

    const supabase = await createClient();
    
    let query = supabase
                .from("USERS_T")
                .select("*, ADDRESSES_T(street, city, state, postcode, country)")
                .in("role",["Admin"]);

    if (username?.trim()){
      query = query.ilike("username", `%${username}%`);
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

    return formatData(data);
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
      user_id,
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

export async function getBuyerOrderCount(userId){
  const supabase = await createClient();
  const { count,error } = await supabase
    .from("ORDERS_T")
    .select("*",{count: 'exact', head:'true'})
    .eq("buyer_id",userId)

  if (error){
    console.error("Error fetching count:",error);
    return 0;
  }

  return count;
}

export async function getSellerOrderCount(userId){
  const supabase = await createClient();
  const { count,error } = await supabase
    .from("ORDERS_T")
    .select("*",{count: 'exact', head:'true'})
    .eq("seller_id",userId)

  if (error){
    console.error("Error fetching count:",error);
    return 0;
  }

  return count;
}

export async function getBuyerTotalSpent(userId){
  const supabase = await createClient();
  const { data: orders, error} = await supabase
  .from("ORDERS_T")
  .select("total_amount")
  .eq("buyer_id", userId);

  if (error){
    console.error("Error fetching prices:", error);
    return 0;
  }
  //This takes the current sum and adds the next order's price to it and starts from 0
  const totalAmount = orders.reduce((sum, order)=> sum + order.total_amount, 0);

  return totalAmount;
}

export async function getSellerGrossEarnings(userId){
  const supabase = await createClient();
  const { data: orders, error} = await supabase
  .from("ORDERS_T")
  .select("total_amount")
  .eq("seller_id", userId);

  if (error){
    console.error("Error fetching prices:", error);
    return 0;
  }
  //This takes the current sum and adds the next order's price to it and starts from 0
  const totalAmount = orders.reduce((sum, order)=> sum + order.total_amount, 0);

  return totalAmount;
}

export async function getTotalWaitingRefundCount() {
    const supabase = await createClient();

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { count, error } = await supabase
        .from("REFUNDS_T")
        .select("*", { count: "exact", head: true })
        .or(
            `and(seller_status.eq.Rejected,admin_status.eq.Pending),and(seller_status.eq.Pending,admin_status.eq.Pending,created_at.lte.${oneWeekAgo.toISOString()})`
        );

    if (error) {
        console.error(error);
        return 0;
    }

    return count;
}

export async function getFilterCouriers(status, username) {

    const supabase = await createClient();
    
    let query = supabase
                .from("USERS_T")
                .select("*, ADDRESSES_T(street, city, state, postcode, country)")
                .in("role",["Courier"]);

    if (username?.trim()){
      query = query.ilike("username", `%${username}%`);
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

    return formatData(data);
  
}

export async function getFilterManageRefunds(date, adminStatus, sellerStatus) {
    const supabase = await createClient();

    const dateState = !(date === "true");

    let query = supabase
        .from("REFUNDS_T")
        .select(`
            *,
            ORDERS_T (
                order_id,
                total_amount,
                buyer:USERS_T!ORDERS_T_buyer_id_fkey (
                    username
                ),
                seller:USERS_T!ORDERS_T_seller_id_fkey (
                    username
                )
            )
        `);

    if (adminStatus && adminStatus !== "All") {
        query = query.eq("admin_status", adminStatus);
    }

    if (sellerStatus && sellerStatus !== "All") {
        query = query.eq("seller_status", sellerStatus);
    }

    query = query.order("created_at", {
        ascending: dateState // let the status contrast
    });

    const { data, error } = await query;

    if (error) {
        console.error(error);
        throw new Error("Could not fetch refund records");
    }
    console.log(data);

    return data;
}

export async function getFilterVoucher(voucher_type, voucher, status){
  const supabase = await createClient();
  let query = supabase
    .from("VOUCHERS_T")
    .select("*");

    if (voucher?.trim()){
      query = query.ilike("voucher_name", `%${voucher}%`);
    }

    if (voucher_type && voucher_type !== "All"){
      query = query.eq("voucher_type",voucher_type)
    }

    if (status && status !== "All"){
      query = query.eq("voucher_status",status);
    }

    query = query.order("created_at", { ascending: true });

    const { data, error } = await query;

    if (error){
      console.error(error);
      return[]; // to prevent the whole app from crashing by passing an empty list to the table
    }

    return formatData(data);
    
}

export async function getFilterOrders(date, orderStatus) {
    const supabase = await createClient();

    const ascending = date !== "true";

    let query = supabase
        .from("ORDERS_T")
        .select(`
            order_id,
            total_amount,
            order_status,
            created_at,

            seller:USERS_T!ORDERS_T_seller_id_fkey (
                username
            ),

            buyer:USERS_T!ORDERS_T_buyer_id_fkey (
                username
            ),

            ORDER_ITEMS_T (
                quantity,
                PRODUCT_VARIANTS_T (
                    PRODUCTS_T (
                        product_name,
                        category
                    )
                )
            )
        `);

    // Filter order status
    if (orderStatus && orderStatus !== "All") {
        query = query.eq("order_status", orderStatus);
    }

    // Sort by date
    query = query.order("created_at", {
        ascending,
    });

    const { data, error } = await query;

    if (error) {
        console.error(error);
        throw new Error("Could not fetch orders");
    }

    return data;
}

export async function getFilterSupport(date, supportType, supportStatus) {
  const supabase = await createClient();

  const dateState = !(date === "true");

    let query = supabase
        .from("SUPPORTS_T")
        .select(`
            support_id,
            support_description,
            support_type,
            support_status,
            created_at,

            reporter:USERS_T!SUPPORTS_T_reporter_id_fkey (
                username
            )
        `);

    if (supportType && supportType !== "All") {
        query = query.eq("support_type", supportType);
    }

    if (supportStatus && supportStatus !== "All") {
        query = query.eq("support_status", supportStatus);
    }

    query = query.order("created_at", {
        ascending: dateState
    });

    const { data, error } = await query;

    if (error) {
        console.error(error);
        throw new Error("Could not fetch support records");
    }

    return data;
  }

  export async function getReportedSellerInfo(sellerId) {

    const supabase = await createClient();

    const { count: totalProducts } = await supabase
    .from("PRODUCTS_T")
    .select("*", { count: "exact", head: true })
    .eq("user_id", sellerId);

    const { data: reviews } = await supabase
    .from("REVIEWS_T")
    .select(`
      product_rating,
      PRODUCTS_T!inner (
        user_id
      )
    `)
    .eq("PRODUCTS_T.user_id", sellerId);
    
    return {totalProducts, reviews};
  }