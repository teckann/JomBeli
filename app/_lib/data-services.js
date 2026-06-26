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

export async function getBuyerSellerInfo() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("USERS_T")
    .select(
      "user_id, username, email, contact_number, role, balances, user_status, ADDRESSES_T(street, city, state, postcode, country)",
    )
    .in("role", ["Buyer", "Seller"]);

  // console.log("RAW SUPABASE DATA:", data.map(u => u.role));

  if (error) {
    console.error("Failed to fetch users:", error.message);
    throw new Error("Could not fetch users");
  }

  return formatUserData(data);
}

export function formatUserData(data) {
  //to return an empty array so .map() function in table doesn't crash if supabase returns absolutely nothing
  if (!data || data.length === 0) {
    return [];
  }

  // Map through and format the data
  return data.map((user) => {
    let fullAddress = "-";

    // String the address together
    if (user.ADDRESSES_T) {
      const addr = user.ADDRESSES_T;
      const addressParts = [
        addr.street,
        addr.city,
        addr.state,
        addr.postcode,
        addr.country,
      ].filter(Boolean);

      if (addressParts.length > 0) {
        fullAddress = addressParts.join(", ");
      }
    }

    // Flatten the object to remove nested objects and assign the new address string
    const cleanedUser = { ...user };

    delete cleanedUser.ADDRESSES_T;

    cleanedUser.full_address = fullAddress;

    // Replace any null values with dashes
    for (const key in cleanedUser) {
      cleanedUser[key] = cleanedUser[key] === null ? "-" : cleanedUser[key];
    }

    return cleanedUser;
  });
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
    .from("REFUNDS_T")
    .select(
      "*, ORDERS_T!inner(seller_id), temp_date:created_at::date, temp_time:created_at::time, ref_temp_date:refunded_at::date, ref_temp_time:refunded_at::time",
    )
    .eq("ORDERS_T.seller_id", id);

  if (error) {
    console.error("Failed to fetch balance:", error.message);
    throw new Error("Could not fetch balance");
  }

  return data;
}

export async function deactiveProduct(productId) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("PRODUCTS_T")
    .update({ product_status: "Inactive" })
    .eq("product_id", productId)
    .select();

  if (error) {
    console.error("Deactivate product error:", error);
    throw new Error("Could not deactive product");
  }

  return data;
}

export async function getBuyerSellerDetails(userId) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("USERS_T")
    .select("*, ADDRESSES_T(street, city, state, postcode, country)")
    .eq("user_id", userId)
    .single();

  // console.log("Raw Supabase Data:", JSON.stringify(data, null, 2))

  if (error) {
    console.error("Fetch user data error:", error);
    throw new Error("Could not find user");
  }
  const cleanedData = {
    ...data, // copy all the original user data

    // overwrites the created_at field with the cleaned 10-character date
    created_at: data.created_at
      ? data.created_at.substring(0, 10)
      : "No date provided",
  };

  return cleanedData;
}

export async function getProductDetails(productId) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("PRODUCTS_T")
    .select(
      `
      *,
      USERS_T!PRODUCTS_T_user_id_fkey (
        username
      ),
      PRODUCT_VARIANTS_T (
        product_variant_id,
        sku,
        product_variant_price,
        product_variant_stock,
        product_variant_status
      )
    `,
    )
    .eq("product_id", productId)
    .single();

  if (error) {
    console.error("Fetch product details error:", error);
    throw new Error("Could not fetch product details");
  }

  return data;
}

export async function setBalances(userID, amount) {
  const supabase = await createClient();
  const { balances: currentBalances } = await getUserInfo(userID);
  const updatedBalances = Number(currentBalances) + Number(amount);

  const { error } = await supabase
    .from("USERS_T")
    .update({
      balances: updatedBalances,
    })
    .eq("user_id", userID);

  if (error) {
    console.error("Insert error:", error);
    throw new Error("Update balances failed");
  }
}

export async function getTop4DiscountProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("PRODUCTS_T")
    .select("*")
    .order("created_at", { ascending: false })
    .order("discount", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Failed to fetch products:", error.message);
    throw new Error("Could not fetch discount products");
  }

  return data;
}
