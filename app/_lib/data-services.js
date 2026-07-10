import { createClient } from "./server";
import { formatDateTime } from "./useful-func";

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
  const { data: { user } } = await supabase.auth.getUser();

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

  return formatData(data);
}

export async function getAdminInfo() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("USERS_T")
    .select(
      "user_id, username, email, contact_number, role, balances, user_status, ADDRESSES_T(street, city, state, postcode, country)",
    )
    .in("role", ["Admin"]); 

  if (error) {
    console.error("Failed to fetch users:", error.message);
    throw new Error("Could not fetch users");
  }

  return formatData(data);
}

export function formatData(data) {
  //to return an empty array so .map() function in table doesn't crash if supabase returns absolutely nothing
  if (!data || data.length === 0) {
    return [];
  }

  // Map through and format the data
  return data.map((data) => {
    let fullAddress = "-";

    // String the address together
    if (data.ADDRESSES_T && Array.isArray(data.ADDRESSES_T) && data.ADDRESSES_T.length > 0) {
      const count = data.ADDRESSES_T.length; //shows the first address
      if (count === 1) {
        fullAddress = "1 Address Used";
      } else if (count > 1){
        fullAddress = `${count} Addresses Used`;
      }
    }

    // Flatten the object to remove nested objects and assign the new address string
    const cleanedData = { ...data };

    delete cleanedData.ADDRESSES_T;
    cleanedData.full_address = fullAddress;

    cleanedData.created_at = data.created_at
      ? data.created_at.substring(0, 10)
      : "No date provided";

    cleanedData.start_date = data.start_date
      ? data.start_date.substring(0, 10)
      : "No date provided";
    
    cleanedData.end_date = data.end_date
      ? data.end_date.substring(0, 10)
      : "No date provided";
    
    for (const key in cleanedData) {
      if (cleanedData[key] === null) {
        cleanedData[key] = "-";
      }
    }
    return cleanedData;
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
    .select("*, temp_date:created_at::date, temp_time:created_at::time, start_date::date, end_date::date")
    .eq("user_id", id)
    .eq("voucher_type", "shop");

  if (error) {
    console.error("Failed to fetch vouchers:", error.message);
    throw new Error("Could not fetch vouchers");
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
    .select("*, ADDRESSES_T(*)")
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
    .eq("product_status", "Active")
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
    .eq("product_status", "Active")
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
    .eq("product_status", "Active")
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

  // console.log(result);

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
export async function getFilterProductsBySellerID(category, sellerID) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("PRODUCTS_T")
    .select("*")
    .eq("category", category)
    .eq("user_id", sellerID);

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

export async function getRefund() {
    const supabase = await createClient();

    const { data, error } = await supabase
    .from("REFUNDS_T")
    .select(`
      refund_id,
      refund_subject,
      seller_status,
      admin_status,
      created_at,

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

    if (error) {
        console.error(error);
        throw new Error("Could not fetch refund records.");
    }

    return data;
}

export async function getRefundDetails(refundId) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("REFUNDS_T")
    .select(`
      refund_id,
      refund_subject,
      seller_status,
      evidences,
      refund_description,
      seller_remarks,
      admin_remarks,
      refunded_at,
      admin_status,
      created_at,

      ORDERS_T!order_id (
        order_id,
        total_amount,
        buyer_id,
        seller_id,
        order_status,
        created_at,

        buyer:USERS_T!buyer_id (
          user_id,
          username,
          email
        ),

        seller:USERS_T!seller_id (
          user_id,
          username,
          email
        ),

        shipping:SHIPPING_T!SHIPPING_T_order_id_fkey (
          shipping_id,
          delivery_type,
          shipping_status
        ),

        ORDER_ITEMS_T!order_id (
          order_item_id,
          quantity,
          unit_price,
          subtotal,

          PRODUCT_VARIANTS_T!product_variant_id (
            product_variant_id,
            sku,
            product_variant_price,

            PRODUCTS_T!product_id (
              product_id,
              product_name,
              product_image_url,
              category
            )
          )
        )
      )
    `)
    .eq("refund_id", refundId)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error(error.message);
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
        .eq("admin_status", "Pending")
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
        .eq("admin_status", "Pending")
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
  const now = new Date().toISOString();

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
          min_spend,
          quantity,
          start_date,
          end_date,
          voucher_status,
          user_id
        )
      `)
      .eq('user_id', userId)
      .eq('user_voucher_status', 'Available')
      .eq('vouchers.voucher_status', 'active')
      .lte('vouchers.start_date', now)
      .gte('vouchers.end_date', now)
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

export async function updateAdminRemarksRefund(refundId, adminRemarks) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("REFUNDS_T")
    .update({
      admin_remarks: adminRemarks,
    })
    .eq("refund_id", refundId)
    .select();

  if (error) {
    console.error("Update admin refund remarks failed:", error);
    return { success: false, error };
  }

  return { success: true, data };
}

export async function updateAdminRemarksSupport(supportId, adminRemarks) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("SUPPORTS_T")
    .update({
      admin_remarks: adminRemarks,
    })
    .eq("support_id", supportId)
    .select();

  if (error) {
    console.error("Update admin support remarks failed:", error);
    return { success: false, error };
  }

  return { success: true, data };
}

export async function getCourierInfo() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("USERS_T")
    .select(
       `user_id, 
        username, 
        email, 
        contact_number, 
        role, balances, 
        user_status, 
        ADDRESSES_T(street, city, state, postcode, country)`,
    )
    .in("role", ["Courier"]); 

  if (error) {
    console.error("Failed to fetch users:", error.message);
    throw new Error("Could not fetch users");
  }

  return formatData(data);
}

export async function getVoucherInfo(){
  const supabase = await createClient();
  const {data,error} = await supabase
    .from("VOUCHERS_T")
    .select("*");

  if (error){
    console.error("Failed to fetch vouchers: ", error.message);
    throw new Error("Could not fetch vouchers!");
  };

  return formatData(data);
}

export async function getVoucherDetails(voucherId){
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("VOUCHERS_T")
    .select("*")
    .eq("voucher_id", voucherId)
    .single();

  // console.log("Raw Supabase Data:", JSON.stringify(data, null, 2))

  if (error) {
    console.error("Fetch voucher data error:", error);
    throw new Error("Could not find voucher");
  };

  const [formatted] = formatData([data]);
  
  return {
    ...formatted,
    raw_start_date: data.start_date,
    raw_end_date: data.end_date
  };
}

export async function getOrdersItems(buyerId, statusFilter) {

  const supabase = await createClient();
  try {
    let query = supabase
      .from('ORDERS_T')
      .select(`
        order_id,
        buyer_id,
        seller_id,
        address_id,
        original_price,
        discount_amount,
        total_amount,
        payment_status,
        order_status,
        created_at,
        ORDER_ITEMS_T (
          order_item_id,
          product_variant_id,
          quantity,
          subtotal,
          PRODUCT_VARIANTS_T (
            product_id,
            sku,
            PRODUCTS_T (
              product_name,
              product_image_url
            )
          )
        )
      `)
      .eq('buyer_id' , buyerId)
      if (statusFilter) {
        query = query.eq('order_status', statusFilter);
      }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error fetching grouped orders:', error.message)
    return null
  }
}

export async function getOrder(orderId, userId) {

  const supabase = await createClient();
  const { data, error } = await supabase
      .from('ORDERS_T')
      .select(`
        order_id,
        buyer_id,
        seller_id,
        address_id,
        original_price,
        discount_amount,
        total_amount,
        payment_status,
        order_status,
        created_at,
        ORDER_ITEMS_T (
          order_item_id,
          product_variant_id,
          quantity,
          subtotal,
          PRODUCT_VARIANTS_T (
            product_id,
            sku,
            PRODUCTS_T (
              product_name,
              product_image_url
            )
          )
        )
      `)
      .eq('order_id' , orderId)
      .eq('buyer_id', userId)
      .single();

    if (error) {
      console.error('Error fetching orders:', error.message)
      throw error
    }
    return data
}

export async function getProductReviews(productId) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("REVIEWS_T") 
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch reviews:", error.message);
    return [];
  }

  return data;
}

export async function getTransactionInfo(){
  const supabase = await createClient();
  const {data,error} = await supabase
    .from("WALLET_TRANSACTIONS_T")
    .select("*,USERS_T(username)");

  if (error){
    console.error("Failed to fetch transactions: ", error.message);
    throw new Error("Could not fetch transactions!");
  }  

  return data;
}

export async function getTransactionDetails(transactionId){
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("WALLET_TRANSACTIONS_T")
    .select("*, USERS_T(username)")
    .eq("wallet_transaction_id", transactionId)
    .single();

  if (error) {
    console.error("Error fetching transaction details:", error);
    return null;
  }

  return {
      ... data,
      created_at: formatDateTime(data.created_at),
    };
}

export async function getOrders() {

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ORDERS_T")
    .select(`
      order_id,
      total_amount,
      order_status,

      seller:USERS_T!ORDERS_T_seller_id_fkey (
        username
      ),

      ORDER_ITEMS_T (
        PRODUCT_VARIANTS_T (
          PRODUCTS_T (
            category
          )
        )
      )
    `);

    if (error) {
      console.error("Failed to fetch orders:", error.message);
      return [];
    }

    return data;
}

export async function getPendingSupport() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("SUPPORTS_T")
    .select(`
      *,
      reporter:USERS_T!SUPPORTS_T_reporter_id_fkey (
        username
      ),
      targetSeller:USERS_T!SUPPORTS_T_target_seller_id_fkey (
        username
      ),
      targetProduct:PRODUCTS_T!SUPPORTS_T_target_product_id_fkey (
        product_name
      )
    `)
    .eq("support_status", "Pending");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

export async function getSystemSupports() {

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("SUPPORTS_T")
    .select(`
      support_id,
      support_type,
      support_status,
      created_at,

      reporter:USERS_T!SUPPORTS_T_reporter_id_fkey (
        username
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

export async function getSupportDetails(supportId) {

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("SUPPORTS_T")
    .select(`
      support_id,
      support_type,
      support_description,
      support_status,
      admin_remarks,
      solved_at,
      created_at,

      reporter:USERS_T!reporter_id (
        user_id,
        username,
        email
      ),

      seller:USERS_T!target_seller_id (
        user_id,
        username,
        email,
        created_at,
        user_status,
        avatar
      ),

      admin:USERS_T!handle_admin_id (
        user_id,
        username,
        email
      ),

      product:PRODUCTS_T!target_product_id (
      product_id,
      product_name,
      product_image_url,
      product_status,
      category,

      seller:USERS_T!user_id (
        user_id,
        username,
        avatar
      ),

      REVIEWS_T (
        product_rating
      )
    )
    `)
    .eq("support_id", supportId)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  const sellerCountPromise = data.seller?.user_id
    ? supabase
        .from("SUPPORTS_T")
        .select("*", { count: "exact", head: true })
        .eq("target_seller_id", data.seller.user_id)
    : Promise.resolve({ count: 0 });

  const productCountPromise = data.product?.product_id
    ? supabase
        .from("SUPPORTS_T")
        .select("*", { count: "exact", head: true })
        .eq("target_product_id", data.product.product_id)
    : Promise.resolve({ count: 0 });

  const [
    { count: sellerReportCount },
    { count: productReportCount }
  ] = await Promise.all([
    sellerCountPromise,
    productCountPromise
  ]);

  return {data, sellerReportCount, productReportCount};
}

// export async function updateSystemSupportSolved(supportId, adminId) {

//   const supabase = await createClient();

//   const { data, error } = await supabase
//     .from("SUPPORTS_T")
//     .update({
//       support_status: "Solved",
//       handle_admin_id: adminId,
//       solved_at: new Date().toISOString(), // or use a database trigger if preferred
//     })
//     .eq("support_id", supportId)
//     .select();

//   if (error) {
//     console.error("Failed to solve support:", error);
//     return { success: false, error };
//   }

//   return { success: true, data };
// }

export async function checkProductReview(userId, orderId) {

  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('REVIEWS_T')
    .select('review_id')
    .eq('user_id', userId)
    .eq('order_id', orderId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching review status:', error.message);
    throw error;
  }

  return !!data;
}

export async function getOrderDetails(orderId) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ORDERS_T")
    .select(`
      order_id,
      created_at,
      total_amount,
      original_price,
      discount_amount,
      payment_status,
      order_status,

      buyer:USERS_T!buyer_id (
        user_id,
        username,
        email
      ),

      seller:USERS_T!seller_id (
        user_id,
        username,
        email
      ),

      address:ADDRESSES_T!address_id (
        address_id,
        recipient_name,
        street,
        city,
        state,
        postcode,
        country
      ),

      shipping:SHIPPING_T!order_id (
        shipping_id,
        delivery_type,
        delivery_fee,
        shipping_status,

        hub:HUBS_T!hub_id (
          hub_name,
          hub_location
        ),

        courier:USERS_T!courier_id (
          user_id,
          username,
          email
        ),

        admin:USERS_T!admin_id (
          user_id,
          username,
          email
        )
      ),

      transaction:ORDER_TRANSACTIONS_T!order_id (
        order_transaction_id,
        amount,
        order_transaction_status
      ),

      voucher:USER_VOUCHERS_T!user_voucher_id (
        user_voucher_status,

        VOUCHERS_T!voucher_id (
          voucher_name,
          voucher_type,
          discount_value
        )
      ),

      ORDER_ITEMS_T!order_id (
        order_item_id,
        quantity,
        unit_price,
        subtotal,

        PRODUCT_VARIANTS_T!product_variant_id (
          product_variant_id,
          sku,
          product_variant_price,

          PRODUCTS_T!product_id (
            product_id,
            product_name,
            category,
            product_image_url
          )
        )
      )
    `)
    .eq("order_id", orderId)
    .single();

  if (error) {

    console.error(error);
    throw error;
  }

  return data;
}

export async function getTotalActiveHubCount() {

  const supabase = await createClient();

  const { data, error, count } = await supabase
  .from('HUBS_T')
  .select('*', { count: 'exact', head: true })
  .eq('hub_status', 'Active');

  if (error) {

    console.error(error);
    throw error;
  }

  return count;
}

export async function getWaitingAssignParcelCount() {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from('SHIPPING_T')
    .select('*', { count: 'exact', head: true })
    .eq('shipping_status', 'Created');

  if (error) {
    console.error(error);
    throw error;
  }

  return count;
}

export async function getOutOfDeliveryParcelCount() {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from('SHIPPING_T')
    .select('*', { count: 'exact', head: true })
    .eq('shipping_status', 'Assigned');

  if (error) {
    console.error(error);
    throw error;
  }

  return count;
}

export async function getAssignedParcelsByAdminThisMonth(adminId) {
  const supabase = await createClient();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from('SHIPPING_T')
    .select('*', { count: 'exact', head: true })
    .eq('admin_id', adminId)
    .neq('shipping_status', 'Created')
    .gte('created_at', startOfMonth.toISOString());

  if (error) {
    console.error(error);
    throw error;
  }

  return count;
}

export async function getCourierDetails(userId){
  const supabase = await createClient();
  const { data,error } = await supabase
    .from("USERS_T")
    .select("*,HUBS_T(*)")
    .eq("user_id", userId)
    .single();

  if(error){
    console.error("Fetch courier data error: ", error);
    throw new Error("Could not find courier");
  }

  const cleanedData = {
    ...data, // copy all the original user data

    avatar: Array.isArray(data.avatar)
      ? data.avatar
      : data.avatar
        ? [data.avatar]
        : [],
    created_at: formatDateTime(data.created_at),
  };
  
  return cleanedData;
}

export async function getCourierHubs(){
  const supabase = await createClient();
  const {data,error} = await supabase
    .from("HUBS_T")
    .select(`*`)
    .order("hub_id", { ascending: true });

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}

export async function getFilteredHubs(hubStatus) {
  const supabase = await createClient();

  let query = supabase
    .from("HUBS_T")
    .select("*")
    .order("hub_id", { ascending: true });

  if (hubStatus && hubStatus !== "All") {
    query = query.eq("hub_status", hubStatus);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}


export async function getOneRefund(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("REFUNDS_T")
.select(`
      *,
      temp_date:created_at::date,
      temp_time:created_at::time,
      ref_temp_date:refunded_at::date,
      ref_temp_time:refunded_at::time,
      
      ORDERS_T!inner (
        seller_id,
        order_temp_date:created_at::date,
        order_temp_time:created_at::time,

        SHIPPING_T!order_id( *, create_date:created_at::date, shipped_date:shipped_at::date),

        
        
        buyer:USERS_T!buyer_id ( * ),
        
        ORDER_ITEMS_T!order_id (
          *,      

          PRODUCT_VARIANTS_T (
            *,

            PRODUCTS_T ( * )
          )
        )
      )
    `)
    .eq("refund_id", id)
    .single();

  if (error) {
    console.error("Failed to single refund:", error.message);
    throw new Error("Could not fetch single refund");
  }

  return data;
}


export async function getOneVoucher(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
  .from("VOUCHERS_T")
    .select(`
      *,
      
      starts_date:start_date::date,
      start_time:start_date::time,
      ends_date:end_date::date,
      starts_time:end_date::time,
      USER_VOUCHERS_T (
        user_voucher_status
      )
    `)
    .eq("voucher_id", id)
    .single();


  if (error) {
    console.error("Failed to fetch voucher:", error.message);
    throw new Error("Could not fetch voucher");
  }

  const totalClaimed = data.USER_VOUCHERS_T ? data.USER_VOUCHERS_T.length : 0;


  const totalUsed = data.USER_VOUCHERS_T 
    ? data.USER_VOUCHERS_T.filter(v => v.user_voucher_status === 'used').length : 0;

    
  return {
    ...data,
    total_claimed: totalClaimed,
    total_used: totalUsed
  };
}


export async function getUsedVoucher(id) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("USER_VOUCHERS_T")
    .select(`
      user_voucher_status,
      claimed_at,
      used_at,
      
      used_date:used_at::date,
      claimed_date:claimed_at::time,

      USERS_T ( username, avatar ),
      VOUCHERS_T !inner ( voucher_name, user_id )
    `)
    .eq("VOUCHERS_T.user_id", id)
    .order("claimed_at", { ascending: false })
    .limit(15); 

  if (error) {
    console.error("Failed to fetch activity:", error.message);
    return [];
  }

  return data;
}

export async function getHubDelivery(hubId) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("SHIPPING_T")
    .select(`
      *,
      order:ORDERS_T!order_id (
        address:ADDRESSES_T!address_id (
          *
        )
      )
    `)
    .is("courier_id", null)
    .eq("shipping_status", "Created")
    .eq("hub_id", hubId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}

export async function getUserOrders(userId){
  const supabase = await createClient();

    const { data, error } = await supabase
        .from("ORDERS_T")
        .select(`
            order_id,
            total_amount,
            order_status,
            created_at,
            seller:USERS_T!ORDERS_T_seller_id_fkey ( username ),
            buyer:USERS_T!ORDERS_T_buyer_id_fkey ( username )
        `)
        .or(`seller_id.eq.${userId},buyer_id.eq.${userId}`)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching user orders:", error);
        return [];
    }
    return data;
}


export async function getUserTransactions(userId) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("WALLET_TRANSACTIONS_T")
        .select("*, USERS_T(username)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching user transactions:", error);
        return [];
    }
    return data;
}

export async function getHubs() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("HUBS_T")
    .select(`*`)
    .order("hub_id", { ascending: true });

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}

// export async function getHubCourierMan(hubId) {
//   const supabase = await createClient();

//   const { data, error } = await supabase
//     .from("USERS_T")
//     .select(`
//       user_id,
//       username,
//       available_status,
//       HUBS_T (
//         hub_name
//       ),
//       SHIPPING_T (
//         shipping_id,
//         shipping_status
//       )
//     `)
//     .eq("role", "Courier")
//     .eq("hub_id", hubId);

//   if (error) {
//     console.error("Supabase error:", error);
//     throw error;
//   }

//   return data;
// }

export async function getHubCourierMan(hubId) {
  const supabase = await createClient();

  // Step 1: Get all active couriers in the hub
  const { data: couriers, error: courierError } = await supabase
    .from("USERS_T")
    .select("user_id, username, available_status")
    .eq("hub_id", hubId)
    .eq("role", "Courier")
    .eq("user_status", "Active");

  if (courierError) {
    console.error(courierError);
    throw new Error("Failed to fetch couriers");
  }

  // hubinfo
  const hubInfo = await supabase.from("HUBS_T").select("*").eq("hub_id", hubId).single();

  // Step 2: Count each courier's OutForDelivery shipments
  const result = await Promise.all(
    couriers.map(async (courier) => {
      const { count, error } = await supabase
        .from("SHIPPING_T")
        .select("*", { count: "exact", head: true })
        .eq("hub_id", hubId)
        .eq("courier_id", courier.user_id)
        .eq("shipping_status", "OutForDelivery");

      if (error) {
        throw error;
      }

      return {
        user_id: courier.user_id,
        username: courier.username,
        hub_name: hubInfo.data.hub_name,
        available_status: courier.available_status,
        total_shipping: count,
      };
    })
  );

  return result;
}

// export async function 

export async function hasPendingDelivery(courierId) {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("SHIPPING_T")
    .select("*", { count: "exact", head: true })
    .eq("courier_id", courierId)
    .neq("shipping_status", "Delivered");

  if (error) {
    console.error("Error checking pending deliveries:", error);
    return false; // fail-safe: don't block the admin if the check itself errors
  }

  return count > 0;
}