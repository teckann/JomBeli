"use server";

import { createClient } from "./server";
import { createClient as createSupabaseClient} from "@supabase/supabase-js";
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
import { getUser } from "./auth";

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

export async function deactivateUser(userId){
  const supabase = await createClient();

  const { data,error } = await supabase
    .from("USERS_T")
    .update({user_status:"Inactive"})
    .eq("user_id",userId)
    .select();
  
    if(error){
      console.error("Deactivate user error:",error);
      throw new Error("Could not deactivate user");
    }

    return data;
}

export async function reactivateUser(userId){
  const supabase = await createClient();

  const { data,error } = await supabase
    .from("USERS_T")
    .update({user_status:"Active"})
    .eq("user_id",userId)
    .select();
  
    if(error){
      console.error("Deactivate user error:",error);
      throw new Error("Could not deactivate user");
    }

    return data;
}

export async function updateUserData(userId, updatedData){
  const requiredFields = ['username', 'gender', 'email', 'contact_number'];

  for (const field of requiredFields) {
    if (!updatedData[field] || updatedData[field].toString().trim() === "") {
      throw new Error(`The field "${field}" is required and cannot be empty.`);
    }
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("USERS_T")
    .update(updatedData)
    .eq("user_id", userId);

  if (error){
    console.error("Database update error: ", error);
    throw new Error("Could not update user profile");
  }
}

export async function uploadAvatar(file){
  const imageFile = file.get('file');

  if (!imageFile) throw new Error("No file uploaded");

  const supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY  // not the anon key
    );

  const fileName = `${Date.now()}-${imageFile.name}`;

  const { error } = await supabase
    .storage
    .from('avatars')
    .upload(fileName, imageFile, {
        cacheControl: '3600',
        upsert:false
    });

  if (error) {
    console.error("SUPABASE UPLOAD ERROR:", error.message, error.statusCode, error);
    throw new Error("Could not upload image to Bucket");
  }

  const { data: publicUrlData } = supabase
    .storage
    .from('avatars')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}

export async function checkoutAction(payload) {
  try {
    const result = await processPayment(payload);
    
    return { success: true, orderId: result.orderId };

  } catch (err) {
    console.error("Checkout failed:", err.message);
    return { success: false, error: err.message };
  }
}

export async function submitReviews(formData) {
  const supabase = await createClient();

  const { reviewsArray } = formData;

  if (!Array.isArray(reviewsArray) || reviewsArray.length === 0) {
    return { success: false, error: "No review items provided." };
  }

  const reviewsToInsert = reviewsArray.map((review) => ({
    review_id: GeneralIDGenerator(), 
    user_id: String(review.userId),               
    order_id: String(review.orderId),
    product_id: String(review.productId),
    product_rating: Number(review.rating.toFixed(1)),
    comment: review.comment,
  }));

  const { error } = await supabase
    .from("REVIEWS_T")
    .insert(reviewsToInsert);

  if (error) {
    console.error("review insert failed:", error.message);
    return { success: false, error: "Failed to submit reviews to the database." };
  }
  
  return { success: true };
}

export async function addCourier(formData){

  const username = formData.get("username");
  const gender = formData.get("gender");
  const email = formData.get("email");
  const contactNumber = formData.get("contact_number");

  const supabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  const temporaryPassword = "CourierDefault@123456";

  const { data,error } = await supabase.auth.admin.createUser({ 
    email,
    password:temporaryPassword })
  
  if(error){
    console.error("Courier authentication generation error:". error.message);
    return redirect("/admin/ManageCouriers?error=This email is already registered.");
  }

  const user = data.user;
  if (!user){
    return redirect("/admin/ManageCouriers?error=Courier authentication creation failed.");
  }

  const{ error:insertError } = await supabase
  .from("USERS_T")
  .insert([
    {
      user_id: user.id,
      username: username,
      gender: gender,
      email: email,
      contact_number: contactNumber,
      role: "Courier",
      user_status: "Active",
      balances: 0.00,
    },
  ]);
  
  if(insertError){
    console.error("Insert USER_T error for courier: ", insertError.message);
    return redirect("/admin/ManageCouriers?error=Failed to populate database row")
  }

  revalidatePath("/admin/ManageCouriers");
  return redirect("/admin/ManageCouriers?message=Courier account successfully added.")
}

export async function deactivateVoucher(voucherId){
  const supabase = await createClient();

  const { data,error } = await supabase
    .from("VOUCHERS_T")
    .update({voucher_status:"inactive"})
    .eq("voucher_id",voucherId)
    .select();
  
    if(error){
      console.error("Deactivate voucher error:",error);
      throw new Error("Could not deactivate voucher");
    }

    return data;
}

export async function reactivateVoucher(voucherId){
  const supabase = await createClient();

  const { data,error } = await supabase
    .from("VOUCHERS_T")
    .update({voucher_status:"active"})
    .eq("voucher_id",voucherId)
    .select();
  
    if(error){
      console.error("Deactivate voucher error:",error);
      throw new Error("Could not deactivate voucher");
    }

    return data;
}

export async function adminUpdateVoucher(voucherId,saveData){
  const requiredFields = ['voucherName', 'discountValue', 'maximumSpend', 'minimumSpend', 'quantity', 'startDate', 'endDate',];

  if (Number(saveData.minimumSpend) < Number(saveData.discountValue)) {
    throw new Error("Minimum spend cannot be less than the discount value.");
  }

  const startDate = new Date(saveData.startDate);
  const endDate = new Date(saveData.endDate);

  if (isNaN(startDate) || isNaN(endDate)){
    throw new Error("Invalid start or end date");
  }

  if (endDate <= startDate){
    throw new Error("Please ensure that the end date is later than start date");
  }

  for (const field of requiredFields) {
    if (!saveData[field] || saveData[field].toString().trim() === "") {
      throw new Error(`The field "${field}" is required and cannot be empty.`);
    }
  }

  const dbData = {
    voucher_name: saveData.voucherName,
    discount_value: saveData.discountValue,
    max_spend: saveData.maximumSpend,
    min_spend: saveData.minimumSpend,
    quantity: saveData.quantity,
    start_date: saveData.startDate,
    end_date: saveData.endDate,
  };

  const supabase = await createClient();

  const {error} = await supabase
    .from("VOUCHERS_T")
    .update(dbData)
    .eq("voucher_id",voucherId);

  if (error){
    console.error("Error saving data: ", error);
    throw new Error("Could not save data.");
  }

  revalidatePath(`/damin/ManageVoucher/${voucherId}`);
  revalidatePath('/admin/ManageVoucher')
}

export async function adminAddVoucher(formData){
  const requiredFields = ['voucherName', 'discountValue', 'maximumSpend', 'minimumSpend', 'quantity', 'startDate', 'endDate',];

  if (Number(formData.minimumSpend) < Number(formData.discountValue)) {
    throw new Error("Minimum spend cannot be less than the discount value.");
  }

  const startDate = new Date(formData.startDate);
  const endDate = new Date(formData.endDate);

  if (isNaN(startDate) || isNaN(endDate)){
    throw new Error("Invalid start or end date");
  }

  if (endDate <= startDate){
    throw new Error("Please ensure that the end date is later than start date");
  }

  const user = getUser();
  if (!user) {
    throw new Error("You must be logged in to create a voucher.")
  }
  for (const field of requiredFields) {
    if (!formData[field] || formData[field].toString().trim() === "") {
      throw new Error(`The field "${field}" is required and cannot be empty.`);
    }
  }

  const newVoucherId = GeneralIDGenerator().toString();

  const dbData = {
    voucher_id: newVoucherId,
    user_id: user.id,
    voucher_name: formData.voucherName,
    discount_value: formData.discountValue,
    max_spend: formData.maximumSpend,
    min_spend: formData.minimumSpend,
    quantity: formData.quantity,
    start_date: formData.startDate,
    end_date: formData.endDate,
    voucher_status: "active",
    voucher_type: "platform",
  };

  const supabase = await createClient();

  const {error} = await supabase
    .from("VOUCHERS_T")
    .insert(dbData)
    
  if (error){
    console.error("Error saving data: ", error);
    throw new Error("Could not save data.");
  }

  revalidatePath('/admin/ManageVoucher')
}