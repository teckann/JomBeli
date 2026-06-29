"use server";

import { createClient } from "./server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import { getUserInfo, setBalances } from "./data-services";
import { createMessage } from "./message-services";
import { GeneralIDGenerator, IDGenerator } from "./random-id-generator";
import { supabase } from "./supabase";
import { processPayment } from "./processpayment";

const weakPasswordWarning =
  "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";

const checkStrongPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  if (!passwordRegex.test(password)) {
    return false;
  }

  return true;
};

export async function signInWithGoogleAction() {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
      flowType: "pkce",
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.error("Sign in error:", error.message);
    redirect("/signin?error=Sign in failed. Please try again.");
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signInWithEmailAction(formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Sign in error:", error.message);
    redirect("/signin?error=Invalid email or password. Please try again.");
  }

  // here got redirect problem
  redirect("/");
}

export async function signOutAction() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Sign out error:", error);
  }

  revalidatePath("/");
  redirect("/signin");
}

export async function updateProfileAction(formData) {
  const supabase = await createClient();
  const fullName = formData.get("fullName");

  const { error } = await supabase.auth.updateUser({
    data: { full_name: fullName },
  });

  if (error) throw new Error("Could not update profile");

  revalidatePath("/profile");
}

export async function signUpWithEmailAction(formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const role = formData.get("role");
  const supabase = await createClient();

  if (password !== confirmPassword) {
    return redirect("/signup?error=Passwords do not match.");
  }

  if (!checkStrongPassword(password)) {
    return redirect(`/signup?error=${weakPasswordWarning}`);
  }

  // register user in auth table
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("Sign up error:", error.message);
    // debug
    // return redirect(`/signup?error=${encodeURIComponent(error.message)}`);

    return redirect(
      "/signup?error=This email is already registered. Try signing in instead.",
    );
  }

  // retrieve user data from auth table
  const user = data.user;

  if (!user) {
    return redirect("/signup?error=User creation failed.");
  }

  const { error: insertError } = await supabase.from("USERS_T").insert([
    {
      user_id: user.id,
      email: email,
      role: role,
    },
  ]);

  if (insertError) {
    console.error("Insert USER_T error:", insertError.message);

    return redirect("/signup?error=Failed to create user profile.");
    // return redirect(`/signup?error=${encodeURIComponent(insertError.message)}`);
  }

  return redirect("/signin?message=Your account is ready. Sign in now!");
}

export async function emailVerificationAction(formData) {
  const email = formData.get("email");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("USERS_T")
    .select("user_id, security_question1")
    .eq("email", email)
    .single();

  if (!data) {
    return redirect(
      "/forgot?error=Email not found. Please enter a valid email address.",
    );
    // return redirect(`/forgot?error=${encodeURIComponent(error.message)}`);
  }

  if (!data.security_question1) {
    return redirect(
      "/forgot?error=Unable to proceed to the next step, safety questions not set. Please contact support@jombeli.com for support.",
    );
  }

  return redirect(`/forgot/verification?id=${data.user_id}`);
}

export async function safetyQuestionValidationAction(formData) {
  const id = formData.get("id");
  const input1 = formData.get("answer1");
  const input2 = formData.get("answer2");

  const { answer1, answer2 } = await getUserInfo(id);

  const isMatch1 = await bcrypt.compare(input1, answer1);
  const isMatch2 = await bcrypt.compare(input2, answer2);

  if (isMatch1 && isMatch2) {
    return redirect(`/resetpassword?id=${id}&status=pass`);
  }

  return redirect(
    `/forgot/verification?id=${id}&error=Verification failed. Please try again.`,
  );
}

export async function resetPasswordAction(formData) {
  const id = formData.get("id");
  const newPassword = formData.get("newPassword");
  const confirmNewPassword = formData.get("confirmNewPassword");
  const defaultPath = `/resetpassword?id=${id}&status=pass`;

  // give the highest access control
  const supabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  if (newPassword !== confirmNewPassword) {
    return redirect(`${defaultPath}&error=Passwords do not match.`);
  }

  if (!checkStrongPassword(newPassword)) {
    return redirect(`${defaultPath}&error=${weakPasswordWarning}`);
  }

  const { error } = await supabase.auth.admin.updateUserById(id, {
    password: newPassword,
  });

  if (error) {
    console.error("Reset password error:", error.message);
    return redirect(
      `${defaultPath}&error=Unable to reset your password at the moment. Please try again later.`,
    );
  }

  return redirect(
    "/signin?message=Your password has been reset. You can now sign in.",
  );
}

export async function sendMessageAction(formData) {
  const message = formData.get("content");
  const sender_id = formData.get("senderID");
  const receiver_id = formData.get("receiverID");

  await createMessage(sender_id, receiver_id, message);

  revalidatePath("/chatbox");
}

export async function topUpAction(formData) {
  const wallet_transaction_id = await IDGenerator();
  const user_id = formData.get("userID");
  const transaction_type = "Top Up";
  const direction = "Credit";
  const payment_method = formData.get("payment");
  const amount = Number(formData.get("amount"));
  const supabase = await createClient();

  const { error } = await supabase.from("WALLET_TRANSACTIONS_T").insert([
    {
      wallet_transaction_id,
      user_id,
      transaction_type,
      direction,
      payment_method,
      amount,
    },
  ]);

  if (error) {
    console.error("Insert error:", error);
    throw new Error("Top up failed");
  }

  await setBalances(user_id, amount);
  revalidatePath("/buyer/wallet");
}

export async function BuyerContactForm(formData) {
  const supabase = await createClient();
  const category = formData.get("category");
  const message = formData.get("description");
  const userID = formData.get("id");
  const supportId = GeneralIDGenerator();

  if (!category || !message) {
    return { error: "All fields are required." };
  }

  const { error } = await supabase.from("SUPPORTS_T").insert([
    {
      support_id: supportId,
      support_type: category,
      support_description: message,
      support_status: "pending",
      reporter_id: userID,
    },
  ]);

  if (error) {
    console.error("Supabase Error:", error.message);
    throw new Error("Failed to submit form. Please try again.");
  }

  redirect("/buyer/helpcentre");
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

export async function reactiveProduct(productId) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("PRODUCTS_T")
    .update({ product_status: "Active" })
    .eq("product_id", productId)
    .select();

  if (error) {
    console.error("Deactivate product error:", error);
    throw new Error("Could not deactive product");
  }

  return data;
}

export async function redirectMonthlyReport(formData) {

  const month = Number(formData.get("reportMonthSelect"));
  const year = Number(formData.get("reportYearSelect"));

  redirect(`/admin/AdminProductReportPage?month=${month}&year=${year}`);

  // const startDate = new Date(year, month, 1);
  // const endDate = new Date(year, month + 1, 1);

  // const monthlyProducts = await getProductReportData(startDate, endDate);

  // let categoriesCount = {};

  // monthlyProducts.forEach((product) => {
  //   const category = product.category;

  //   categoriesCount[category] = (categoriesCount[category] || 0) + 1;
  // })

  // // change object into key value key and sort them by ascending and get the first
  // const mostCategory = Object.entries(categoriesCount).sort((a, b)  => 
  //   b[1] - a[1])[0];

        
}


export async function removeCartItems(cartItemId) {

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('CART_ITEMS_T')
    .delete()
    .eq('cart_item_id', cartItemId);

  if(error) {
    throw new Error(error.message);
  }

  return data;

}

export async function checkoutAction(payload) {
  let orderID = null;
  let paymentSuccess = false;
  try {
    const result = await processPayment(payload);
    orderID = result.orderId
    paymentSuccess = true;
  } catch (err) {
    console.error("Checkout failed:", err.message);
    return { success: false, error: err.message };
  }

  if(paymentSuccess && orderID){
    redirect(`/buyer/ordercomplete`)
  }
}

