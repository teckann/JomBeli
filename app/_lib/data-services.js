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

export async function getUserDetails(userId) {
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

    avatar: Array.isArray(data.avatar)
      ? data.avatar
      : data.avatar
        ? [data.avatar]
        : [],
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

export async function getBuyerOrderCount(userId) {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("ORDERS_T")
    .select("*", { count: "exact", head: "true" })
    .eq("buyer_id", userId);

  if (error) {
    console.error("Error fetching count:", error);
    return 0;
  }

  return count;
}

export async function getBuyerTotalSpent(userId) {
  const supabase = await createClient();
  const { data: orders, error } = await supabase
    .from("ORDERS_T")
    .select("total_amount")
    .eq("buyer_id", userId);

  if (error) {
    console.error("Error fetching prices:", error);
    return 0;
  }
  //This takes the current sum and adds the next order's price to it and starts from 0
  const totalAmount = orders.reduce(
    (sum, order) => sum + order.total_amount,
    0,
  );

  return totalAmount;
}

export async function getDiscountProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("PRODUCTS_T")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch products:", error.message);
    throw new Error("Could not fetch discount products");
  }

  const result = data
    .filter((p) => (p.discount ?? 0) > 0)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 5);

  return result;
}

export async function getHotProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("PRODUCTS_T")
    .select("*")
    .order("total_sold", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Failed to fetch products:", error.message);
    throw new Error("Could not fetch hot products");
  }

  return data;
}

export async function getDiscoverProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("PRODUCTS_T")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Failed to fetch products:", error.message);
    throw new Error("Could not fetch hot selling products");
  }

  return data;
}

export async function getBanners() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("BANNERS_T")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(10);

  if (error) {
    console.error("Failed to fetch banners:", error.message);
    return [];
  }

  return data;
}

export async function getCartItems(currentUserId) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("CART_ITEMS_T")
    .select(
      `
      cart_item_id,
      quantity,
      PRODUCT_VARIANTS_T (
        product_variant_price,
        sku,
        PRODUCTS_T (
          user_id,
          product_name,
          discount,
          product_image_url,
          USERS_T (
            username
          )
        )
      )
    `,
    )
    .eq("user_id", currentUserId);

  if (error) {
    console.error("Fail to retrieve cart item:", error);
    throw new Error("Could not fetch cart item");
  }
  return data;
}

export async function getCartItemsByCartItemID(cartItemId) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("CART_ITEMS_T")
    .select(
      `
      cart_item_id,
      quantity,
      PRODUCT_VARIANTS_T (
        product_variant_id,
        product_variant_price,
        sku,
        PRODUCTS_T (
          user_id,
          product_name,
          discount,
          product_image_url,
          USERS_T (
            username
          )
        )
      )
    `,
    )
    .in("cart_item_id", cartItemId);

  if (error) {
    console.error("Fail to retrieve cart item:", error);
    throw new Error("Could not fetch cart item");
  }
  return data;
}

export async function getYearsMonthsWithNewProduct() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("PRODUCTS_T")
    .select("created_at");

  if (error) {
    console.error("Select error:", error);
    throw new Error("Get year-month structure failed");
  }

  const result = [];

  data.forEach((product) => {
    const date = new Date(product.created_at);
    const year = date.getFullYear();
    const month = date.getMonth();

    // find if there are exist year in array or not
    let item = result.find((r) => r.year === year);

    // create a new object for that
    if (!item) {
      item = { year: year, months: [] };

      result.push(item);
    }

    // push month into months if there is not month in the item (Which reference to results)
    if (!item.months.includes(month)) {
      item.months.push(month);
    }
  });

  result.forEach((each) => each.months.sort((a, b) => a - b));
  result.sort((a, b) => b.year - a.year);

  console.log(result);

  return result;
}

export async function getProductReportData(startDate, endDate) {
  const supabase = await createClient();

  const { count: total, error } = await supabase
    .from("PRODUCTS_T")
    .select("*", { count: "exact", head: true })
    .lt("created_at", endDate.toISOString());

  if (error) {
    console.error("Fetch Total Products error:", error);
    throw new Error("Could not Fetch Total Products");
  }

  const { data: monthlyProducts, error: productError } = await supabase
    .from("PRODUCTS_T")
    .select(
      `
    product_id,
    product_name,
    category,
    price,
    stock_quantity,
    created_at,
    overall_product_rating,
    USERS_T (
      user_id,
      username
    )
  `,
    )
    .gte("created_at", startDate.toISOString())
    .lt("created_at", endDate.toISOString());

  if (productError) {
    console.error("Fetch Total Products error:", error);
    throw new Error("Could not Fetch Total Products");
  }

  return { monthlyProducts, total };
}

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

export async function validateCartItemOwnership(itemIds, userId) {
  if (!itemIds || itemIds.length === 0) return false;

  const supabase = await createClient();

  const { count, error } = await supabase
    .from('CART_ITEMS_T')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .in('cart_item_id', itemIds);

  if (error) {
    console.error('Error validating cart ownership:', error.message);
    throw error;
  }

  return count === itemIds.length;
}

export async function getUserAddresses(userId) {
  if (!userId) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ADDRESSES_T')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false }) 
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user addresses:', error.message);
    throw error;
  }

  return data;
}

export async function getAdminRefundRequests() {
    const supabase = await createClient();

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { data, error } = await supabase
        .from("REFUNDS_T")
        .select(`
            refund_id,
            refund_subject,
            evidences,
            seller_status,
            admin_status,
            created_at,
            ORDERS_T (
                order_id,
                buyer_id,
                seller_id,
                total_amount,
                order_status,
                created_at
            )
        `)
        .or(
            `seller_status.eq.Rejected,and(seller_status.eq.Pending,created_at.lte.${oneWeekAgo.toISOString()})`
        )
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        throw new Error("Could not fetch refund requests.");
    }

    return data;
}

export async function getRejectedBySeller() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("REFUNDS_T")
        .select(`
            refund_id,
            refund_subject,
            evidences,
            seller_status,
            admin_status,
            created_at,
            ORDERS_T (
                buyer_id,
                seller_id,
                total_amount,
                order_status,
                created_at,

                 BUYER:USERS_T!ORDERS_T_buyer_id_fkey (
                    username
                )
            )
        `)
        .eq("seller_status", "Rejected")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        return [];
    }

    return data;
}

export async function getNotProcessedBySeller() {
    const supabase = await createClient();

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { data, error } = await supabase
        .from("REFUNDS_T")
        .select(`
            refund_id,
            refund_subject,
            evidences,
            seller_status,
            admin_status,
            created_at,
            ORDERS_T (
                buyer_id,
                seller_id,
                total_amount,
                order_status,
                created_at,

                 BUYER:USERS_T!ORDERS_T_buyer_id_fkey (
                    username
                )
            )
        `)
        .eq("seller_status", "Pending")
        .lte("created_at", oneWeekAgo.toISOString())
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        return [];
    }

    return data;
}

export async function getUserVouchers(userId, shopId) {

  const supabase = await createClient();

  if (!userId || userId === 'undefined') {
      console.error("getUserVouchers aborted: userId is missing.");
      return [];
    }
    if (!shopId || shopId === 'undefined') {
      console.error("getUserVouchers aborted: shopId is missing.");
      return [];
    }

  try {
    const { data, error } = await supabase
      .from('USER_VOUCHERS_T')
      .select(`
        user_voucher_id,
        user_voucher_status,
        claimed_at,
        used_at,
        vouchers:VOUCHERS_T!inner (
          voucher_id,
          voucher_name,
          voucher_type,
          discount_value,
          max_spend,
          min_spend,
          quantity,
          start_date,
          end_date,
          voucher_status,
          user_id
        )
      `)
      .eq('user_id', userId)
      .or(`voucher_type.eq.platform,and(voucher_type.eq.shop,user_id.eq.${shopId})`, { foreignTable: 'VOUCHERS_T' });

    if (error) throw error;

    return data.map((item) => ({
      user_voucher_id: item.user_voucher_id,
      user_voucher_status: item.user_voucher_status,
      claimed_at: item.claimed_at,
      used_at: item.used_at,
      voucher_id: item.vouchers.voucher_id,
      voucher_name: item.vouchers.voucher_name,
      voucher_type: item.vouchers.voucher_type,
      discount_value: item.vouchers.discount_value,
      max_spend: item.vouchers.max_spend,
      min_spend: item.vouchers.min_spend,
      quantity: item.vouchers.quantity,
      start_date: item.vouchers.start_date,
      end_date: item.vouchers.end_date,
      voucher_status: item.vouchers.voucher_status,
      seller_id: item.vouchers.user_id,
    }));

  } catch (error) {
    console.error('Error fetching user vouchers:', error);
    throw error;
  }
}
