import { createClient } from "./server";

export async function getMyVouchers(userId) {
  const supabase = await createClient();

  const { data: userVouchers, error: userError } = await supabase
    .from("USER_VOUCHERS_T")
    .select("voucher_id, user_voucher_status")
    .eq("user_id", userId)
    .neq("user_voucher_status", "Used");

  if (userError) {
    console.error("Failed to fetch user vouchers:", userError.message);
    throw new Error("Could not fetch user vouchers");
  }

  const voucherIds = userVouchers.map((v) => v.voucher_id).filter(Boolean);

  if (!voucherIds.length) return [];

  const now = new Date().toISOString();

  const { data: vouchers, error: voucherError } = await supabase
    .from("VOUCHERS_T")
    .select("voucher_name, min_spend, discount_value, end_date")
    .in("voucher_id", voucherIds)
    .eq("voucher_status", "active")
    .gt("end_date", now)
    .order("end_date", { ascending: true });

  if (voucherError) {
    console.error("Failed to fetch vouchers:", voucherError.message);
    throw new Error("Could not fetch vouchers");
  }

  return vouchers;
}

export async function getPlatformExpiringSoonVouchers(userId) {
  const supabase = await createClient();

  const now = new Date();
  const in15Days = new Date();
  in15Days.setDate(now.getDate() + 15);

  // retrieve redeemed vouchers
  const { data: userVouchers, error: userError } = await supabase
    .from("USER_VOUCHERS_T")
    .select("voucher_id")
    .eq("user_id", userId);

  if (userError) {
    throw new Error("Could not fetch user vouchers");
  }

  const excludedSet = new Set(
    userVouchers?.map((v) => v.voucher_id).filter(Boolean) || [],
  );

  // platform vouchers
  const { data, error } = await supabase
    .from("VOUCHERS_T")
    .select("voucher_id, voucher_name, discount_value, min_spend, end_date")
    .eq("voucher_type", "platform")
    .eq("voucher_status", "active")
    .gt("quantity", 0)
    .not("quantity", "is", null)
    .lte("start_date", now.toISOString())
    .gte("end_date", now.toISOString())
    .lte("end_date", in15Days.toISOString())
    .order("end_date", { ascending: true });

  if (error) {
    console.error(error);
    throw new Error("Could not fetch platform vouchers");
  }

  // filter out redeemed vouchers
  const filtered = (data || []).filter((v) => !excludedSet.has(v.voucher_id));

  // combine
  return filtered.map((v) => ({
    voucher_id: v.voucher_id,
    voucher_name: v.voucher_name,
    discount_value: v.discount_value,
    min_spend: v.min_spend,
    end_date: v.end_date,
  }));
}

export async function getPlatformVouchers(userId) {
  const supabase = await createClient();
  const now = new Date().toISOString();

  // 1. get redeemed voucher ids
  const { data: userVouchers, error: userError } = await supabase
    .from("USER_VOUCHERS_T")
    .select("voucher_id")
    .eq("user_id", userId);

  if (userError) {
    throw new Error("Could not fetch user vouchers");
  }

  const redeemedIds = (userVouchers || [])
    .map((v) => v.voucher_id)
    .filter(Boolean);

  // 2. query platform vouchers
  let query = supabase
    .from("VOUCHERS_T")
    .select(
      "voucher_id, voucher_name, min_spend, discount_value, end_date, start_date",
    )
    .eq("voucher_type", "platform")
    .eq("voucher_status", "active")
    .gt("quantity", 0)
    .lte("start_date", now) // already started
    .gte("end_date", now) // not expired
    .order("end_date", { ascending: true });

  // 3. exclude redeemed vouchers (only if exists)
  if (redeemedIds.length > 0) {
    query = query.not("voucher_id", "in", `(${redeemedIds.join(",")})`);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw new Error("Could not fetch platform vouchers");
  }

  return (data || []).map((v) => ({
    voucher_id: v.voucher_id,
    voucher_name: v.voucher_name,
    discount_value: v.discount_value,
    min_spend: v.min_spend,
    end_date: v.end_date,
  }));
}

export async function getSellerVouchers(userId, sellerId) {
  const supabase = await createClient();
  const now = new Date().toISOString();

  // retrieve redeemed voucher ids
  const { data: userVouchers, error: userError } = await supabase
    .from("USER_VOUCHERS_T")
    .select("voucher_id")
    .eq("user_id", userId);

  if (userError) {
    throw new Error("Could not fetch user vouchers");
  }

  const redeemedIds = (userVouchers || [])
    .map((v) => v.voucher_id)
    .filter(Boolean);

  // query seller vouchers
  let query = supabase
    .from("VOUCHERS_T")
    .select(
      "voucher_id, voucher_name, min_spend, discount_value, end_date, start_date",
    )
    .eq("voucher_type", "shop")
    .eq("voucher_status", "active")
    .eq("user_id", sellerId) // seller filter
    .gt("quantity", 0)
    .lte("start_date", now)
    .gte("end_date", now)
    .order("end_date", { ascending: true });

  // 3. exclude redeemed vouchers
  if (redeemedIds.length > 0) {
    query = query.not("voucher_id", "in", `(${redeemedIds.join(",")})`);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw new Error("Could not fetch seller vouchers");
  }

  return (data || []).map((v) => ({
    voucher_id: v.voucher_id,
    voucher_name: v.voucher_name,
    discount_value: v.discount_value,
    min_spend: v.min_spend,
    end_date: v.end_date,
  }));
}

export async function createNewVoucher(userId, voucherId) {}
