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

export async function getAllUserInfo() {
  const supabase = await createClient();
  const { data, error } = await supabase
  .from("USERS_T")
  .select("user_id, username, email, contact_number, role, balances, user_status");

  if (error) {
    console.error("Failed to fetch users:", error.message);
    throw new Error("Could not fetch users");
  }
  //to return an empty array so .map() function in table doesn't crash if supabase returns absolutely nothing
  if (!data){
    return [];
  }

  //loop through the array of users to clean up missing data
  const cleanedData = data.map((user) => {
    const cleanedUser = {};
    
    for (const key in user){
      //put dash if an value inside the user is null, or else return the non-null value
      cleanedUser[key] = user[key] === null ? "-" : user[key];
    }

    return cleanedUser;
  })

  return cleanedData;
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
    (a, b) => new Date(b.year, b.month) - new Date(a.year, a.month),
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
    .eq("user_id", id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch transaction records:", error.message);
    throw new Error("Could not fetch transaction records");
  }

  return data;
}

export async function getFilterTransactions(id, month, type) {
  const supabase = await createClient();

  let query = supabase
    .from("WALLET_TRANSACTIONS_T")
    .select("*")
    .eq("user_id", id);

  // type filtering
  if (type && type !== "all") {
    query = query.eq("direction", type);
  }

  // month filtering (2026-1 || 2025-12)
  if (month && month !== "all") {
    const [year, m] = month.split("-");
    const safeMonth = `${year}-${m.padStart(2, "0")}`;

    const start = new Date(`${safeMonth}-01T00:00:00Z`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    query = query
      .gte("created_at", start.toISOString())
      .lt("created_at", end.toISOString());
  }

  // sorting
  query = query.order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch transaction records:", error.message);
    throw new Error("Could not fetch transaction records");
  }

  return data || [];
}


export async function getSellerVoucher(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("VOUCHERS_T")
    .select("*, temp_date:created_at::date, temp_time:created_at::time")
    .eq("user_id", id)
    .eq("voucher_type", "shop");

  if (error) {
    console.error("Failed to fetch balance:", error.message);
    throw new Error("Could not fetch balance");
  }

  return data;
}


export async function getSellerRefund(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("VOUCHERS_T")
    .select("*")
    .eq("user_id", id)
    .eq("voucher_type", "shop");

  if (error) {
    console.error("Failed to fetch balance:", error.message);
    throw new Error("Could not fetch balance");
  }

  return data;
}

