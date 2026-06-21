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
  const { data, error } = await supabase.from("products").select("*");

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

export async function getTransactionMonths(id) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("WALLET_TRANSACTIONS_T")
    .select("created_at")
    .eq("user_id", id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  // month mapping (after filter)
  const monthsMap = new Map();

  for (const item of data) {
    const created_at = item.created_at;
    const date = new Date(created_at);

    const year = date.getFullYear();
    // [0-11]  0=Jan,...，11=Dec
    const month = date.getMonth();

    // format the pair (2026 Jan = 2026-0)
    const key = `${year}-${month}`;

    // filter out the repeat months
    if (!monthsMap.has(key)) {
      // key-value (key = 2026-0, value = {year: 2026, month: 0})
      monthsMap.set(key, { year, month });
    }
  }

  // sorting logic
  const months = Array.from(monthsMap.values()).sort(
    (a, b) => new Date(a.year, a.month) - new Date(b.year, b.month),
  );

  // check if there have another years
  // filter out month, just keep year
  const uniqueYears = [...new Set(months.map((m) => m.year))];
  const isMultiYear = uniqueYears.length > 1;

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // format the data
  const result = months.map(({ year, month }) => {
    return {
      value: `${year}-${month + 1}`,
      label: isMultiYear ? `${monthNames[month]} ${year}` : monthNames[month],
    };
  });

  return result;
}

export async function getTransactions(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("WALLET_TRANSACTIONS_T")
    .select("*")
    .eq("user_id", id);

  if (error) {
    console.error("Failed to fetch transaction records:", error.message);
    throw new Error("Could not fetch transaction records");
  }

  return data;
}
