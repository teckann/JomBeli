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
    .eq("product_status", "Active")
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
    .eq("product_status", "Active")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch products:", error.message);
    throw new Error("Could not fetch products");
  }

  return data;
}
export async function getProductsBySellerID(sellerID) {
  const { data, error } = await supabase
    .from("PRODUCTS_T")
    .select("*")
    .order("created_at", { ascending: false })
    .eq("product_status", "Active")
    .eq("user_id", sellerID);

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

export async function getSellerInfo(userId) {
  const { data, error } = await supabase
    .from("USERS_T")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Failed to fetch seller info:", error.message);
    throw new Error("Could not fetch seller info");
  }

  return data;
}

export async function getSellerRating(userId) {
  const { data: products, error: productError } = await supabase
    .from("PRODUCTS_T")
    .select("product_id")
    .eq("user_id", userId);

  if (productError) {
    throw new Error(productError.message);
  }

  if (!products || products.length === 0) {
    return 0;
  }

  const productIds = products.map((p) => p.product_id);

  const { data: reviews, error: reviewError } = await supabase
    .from("REVIEWS_T")
    .select("product_rating")
    .in("product_id", productIds);

  if (reviewError) {
    throw new Error(reviewError.message);
  }

  if (!reviews || reviews.length === 0) {
    return 0;
  }

  const ratings = reviews
    .map((r) => Number(r.product_rating))
    .filter((r) => !isNaN(r));

  if (ratings.length === 0) {
    return 0;
  }

  const sum = ratings.reduce((acc, r) => acc + r, 0);
  const avg = sum / ratings.length;

  return Number(avg.toFixed(1));
}

export async function getSellerTotalReviews(sellerId) {
  // all the seller products
  const { data: products, error: productError } = await supabase
    .from("PRODUCTS_T")
    .select("product_id")
    .eq("user_id", sellerId);

  if (productError) {
    throw new Error(productError.message);
  }

  if (!products || products.length === 0) {
    return 0;
  }

  const productIds = products.map((product) => product.product_id);

  // retrieve all the review records
  const { data: reviews, error: reviewError } = await supabase
    .from("REVIEWS_T")
    .select("review_id")
    .in("product_id", productIds);

  if (reviewError) {
    throw new Error(reviewError.message);
  }

  return reviews.length;
}

export async function getSellerTotalProduct(sellerId) {
  const { data, error } = await supabase
    .from("PRODUCTS_T")
    .select("product_id")
    .eq("user_id", sellerId);

  if (error) {
    throw new Error(error.message);
  }

  return data.length || 0;
}

export async function getSellerTotalDiscountProduct(sellerId) {
  const { data, error } = await supabase
    .from("PRODUCTS_T")
    .select("product_id")
    .eq("user_id", sellerId)
    .not("discount", "is", null);

  if (error) {
    throw new Error(error.message);
  }

  return data.length || 0;
}

export default async function getProductOverallRating(productId) {
  const { data, error } = await supabase
    .from("REVIEWS_T")
    .select("product_rating")
    .eq("product_id", productId);

  if (error) {
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    return null;
  }

  const sum = data.reduce((acc, review) => {
    return acc + (Number(review.product_rating) || 0);
  }, 0);

  const average = sum / data.length;

  return Number(average.toFixed(1));
}

export async function getTotalRatingRecords(productId) {
  const { data, error } = await supabase
    .from("REVIEWS_T")
    .select("product_rating")
    .eq("product_id", productId);

  if (error) {
    throw new Error(error.message);
  }

  const records = {
    all: 0,
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  if (!data || data.length === 0) {
    return records;
  }

  records.all = data.length;

  data.forEach((review) => {
    const rating = Number(review.product_rating);

    if (rating >= 1 && rating <= 5) {
      records[rating]++;
    }
  });

  return records;
}

export async function getProductReviews(productId) {
  const { data: reviews, error: reviewError } = await supabase
    .from("REVIEWS_T")
    .select("*")
    .eq("product_id", productId);

  if (reviewError) {
    throw new Error(reviewError.message);
  }

  if (!reviews || reviews.length === 0) {
    return [];
  }

  const userIds = [...new Set(reviews.map((r) => r.user_id))];

  const { data: users, error: userError } = await supabase
    .from("USERS_T")
    .select("user_id, username, avatar")
    .in("user_id", userIds);

  if (userError) {
    throw new Error(userError.message);
  }

  // map users by id
  const userMap = {};
  users.forEach((user) => {
    userMap[user.user_id] = user;
  });

  // combine the data
  const result = reviews.map((review) => {
    const user = userMap[review.user_id] || {};

    return {
      ...review,
      username: user.username || "Unknown",
      avatar: user.avatar || null,
    };
  });

  return result;
}

export async function getFilterReviews(productId, star) {
  const rating = Number(star || 0);

  const { data: reviews, error: reviewError } = await supabase
    .from("REVIEWS_T")
    .select("*")
    .eq("product_id", productId)
    .eq("product_rating", rating);

  if (reviewError) {
    console.error("Failed to fetch filter reviews:", reviewError.message);
    return [];
  }

  if (!reviews || reviews.length === 0) {
    return [];
  }

  const userIds = [...new Set(reviews.map((r) => r.user_id))];

  const { data: users, error: userError } = await supabase
    .from("USERS_T")
    .select("user_id, username, avatar")
    .in("user_id", userIds);

  if (userError) {
    throw new Error(userError.message);
  }

  const userMap = {};
  users.forEach((user) => {
    userMap[user.user_id] = user;
  });

  const result = reviews.map((review) => {
    const user = userMap[review.user_id] || {};

    return {
      ...review,
      username: user.username || "Unknown",
      avatar: user.avatar || null,
    };
  });

  return result;
}
