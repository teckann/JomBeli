"use server";

import { createClient } from "./server";
import { createClient as createSupabaseClient} from "@supabase/supabase-js";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import { getUserInfo, setBalances, updateAdminRemarksRefund, updateAdminRemarksSupport, getUserOrders, getUserTransactions } from "./data-services";
import { createMessage } from "./message-services";
import { GeneralIDGenerator, IDGenerator } from "./random-id-generator";
import { supabase } from "./supabase";
import { processPayment } from "./processpayment";
import { getUser } from "./auth";
import hashValue from "./bcrypt";

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
  const shopID = formData.get("shopID");
  const productID = formData.get("productID");

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
      target_product_id: productID? productID : null,
      target_seller_id: shopID? shopID : null
    },
  ]);

  if (error) {
    console.error("Supabase Error:", error.message);
    throw new Error("Failed to submit form. Please try again.");
  }

  redirect("/buyer/contactus/submitted");
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

export async function handleRefundRemarksChange(formData) {
  const remark = formData.get("adminRemarks");
  const modifyId = formData.get("modifyId");

  await updateAdminRemarksRefund(modifyId, remark);
}

export async function handleSupportRemarksChange(formData) {
  const remark = formData.get("adminRemarks");
  const modifyId = formData.get("modifyId");

  await updateAdminRemarksSupport(modifyId, remark);
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
  
  redirect('/buyer/review/success')
}

export async function addCourier(formData){

  const username = formData.get("username");
  const gender = formData.get("gender");
  const email = formData.get("email");
  const contactNumber = formData.get("contact_number");
  const hubId = formData.get("hub_id")

  const supabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  const temporaryPassword = "CourierDefault@123456";
  const availableStatus = "TRUE";

  const { data,error } = await supabase.auth.signUp({ 
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
      available_status: availableStatus,
      user_status: "Active",
      balances: 0.00,
      hub_id: hubId
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

export async function handleAdminRefundAction(formData) {

  
  const action = formData.get("action");
  const refundId = formData.get("refundId");

  console.log("refund id", refundId);

  const isApprove = action === "Approved";

  const supabase = await createClient();

  const updateData = {
    admin_status: action,
  };

  if (isApprove) {
    updateData.refunded_at = new Date().toISOString();
  }

  const { data: refund, error } = await supabase
    .from("REFUNDS_T")
    .update(updateData)
    .eq("refund_id", refundId)
    .select('order_id')
    .single();

  if (error) {
    console.error(error);
    throw new Error("Failed to update refund status.");
  }

  const orderId = refund.order_id;

  // send money
  if (isApprove) {
    await adminApproveRefundAction(orderId);
  }
  else {
    await adminRejectRefundAction(orderId);
  }

  return redirect(`/admin/ManageRefunds/RefundsTable/${refundId}`);
}

export async function updateSystemSupportSolved(supportId, adminId) {

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("SUPPORTS_T")
    .update({
      support_status: "Solved",
      handle_admin_id: adminId,
      solved_at: new Date().toISOString(), // or use a database trigger if preferred
    })
    .eq("support_id", supportId)
    .select();

  if (error) {
    console.error("Failed to solve support:", error);
    return { success: false, error };
  }

  return { success: true, data };
}

export async function createRefundAction(formData) {

  const orderId = formData.get('order_id');
  const refundSubject = formData.get('refund_subject');
  const refundDescription = formData.get('refund_description');
  const sellerStatus = formData.get('seller_status');
  const adminStatus = formData.get('admin_status');

  const fileEntries = formData.getAll('evidences'); 
  const evidenceUrls = [];

  const supabase = await createClient();

  try {
    for (const file of fileEntries) {
      if (file && file.size > 0) {
        const fileExt = file.name.split('.').pop();
        const uniqueFileName = `${orderId}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('refund-evidences')
          .upload(uniqueFileName, file);

        if (uploadError) {
          console.error('Storage Upload Error:', uploadError);
          throw new Error(`Failed to upload file: ${file.name}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('refund-evidences')
          .getPublicUrl(uniqueFileName);
          
        evidenceUrls.push(publicUrl);
      }
    }

    const { error: dbError } = await supabase
      .from('REFUNDS_T')
      .insert([
        {
          order_id: orderId,
          refund_subject: refundSubject,
          refund_description: refundDescription,
          seller_status: sellerStatus,
          admin_status: adminStatus,
          evidences: evidenceUrls 
        }
      ]);

    if (dbError) {
      console.error('Database Error:', dbError);
      throw new Error('Could not save refund request to database.');
    }
    const { error: orderUpdateError } = await supabase
          .from('ORDERS_T')
          .update({ order_status: 'Applied For Refund' })
          .eq('order_id', orderId);

    if (orderUpdateError) {
      console.error('Order Update Error:', orderUpdateError);
      throw new Error('Failed to update order status to Applied For Refund.');
    }
  } catch (error) {
    console.error('Action failure:', error);
    return { error: error.message || 'An unexpected error occurred.' };
  }

  revalidatePath('/buyer/orders');
  redirect('/buyer/orders');
}


export async function confirmOrder(formData) {

  const order_id = formData.get('orderID');

  const supabase = await createClient();

  try {
    const { data: order, error: orderError } = await supabase
      .from('ORDERS_T')
      .update({ order_status: 'Completed' })
      .eq('order_id', order_id)
      .select('seller_id, total_amount')
      .single();

    if (orderError) throw new Error(`Failed to update order status: ${orderError.message}`);
    if (!order) throw new Error('Order not found.');

    const { seller_id, total_amount } = order;

    const { data: shipping, error: shippingError } = await supabase
      .from('SHIPPING_T')
      .select('delivery_fee')
      .eq('order_id', order_id)
      .single();

    if (shippingError && shippingError.code !== 'PGRST116') {
      throw new Error(`Failed to fetch shipping fee: ${shippingError.message}`);
    }
    
    const deliveryFee = shipping?.delivery_fee ? Number(shipping.delivery_fee) : 0;

    const sellerEarn = Number(total_amount) - deliveryFee;

    const { data: seller, error: sellerFetchError } = await supabase
      .from('USERS_T')
      .select('balances')
      .eq('user_id', seller_id)
      .single();

    if (sellerFetchError) throw new Error(`Failed to fetch seller balance: ${sellerFetchError.message}`);

    const currentBalance = seller.balances ? Number(seller.balances) : 0;
    const newBalance = currentBalance + sellerEarn;

    const { error: balanceUpdateError } = await supabase
      .from('USERS_T')
      .update({ balances: newBalance })
      .eq('user_id', seller_id);

    if (balanceUpdateError) throw new Error(`Failed to update seller balance: ${balanceUpdateError.message}`);

    const transactionID = await IDGenerator();

    const { error: transactionError } = await supabase
      .from('WALLET_TRANSACTIONS_T')
      .insert({
        wallet_transaction_id: transactionID,
        user_id: seller_id,
        transaction_type: `Payment for order: #${order_id}`,
        direction: 'Debit',
        payment_method: 'Wallet Balance',
        amount: sellerEarn,
        wallet_transaction_status: 'Success'
      });

    if (transactionError) throw new Error(`Failed to log wallet transaction: ${transactionError.message}`);

    revalidatePath('/buyer/orders')

    return {
      success: true,
      message: 'Order confirmed',
    };

  } catch (error) {
    console.error('Error executing confirmOrder:', error.message);
    return { success: false, error: error.message };
  }
}

export async function adminRejectRefundAction(orderID) {

  const supabase = await createClient();

  try {
    // update order to completed
    const { data: order, error: orderError } = await supabase
      .from('ORDERS_T')
      .update({ order_status: 'Completed' })
      .eq('order_id', orderID)
      .select('seller_id, total_amount')
      .single();

    if (orderError) throw new Error(`Failed to update order status: ${orderError.message}`);
    if (!order) throw new Error('Order not found.');

    const { seller_id, total_amount } = order;

    // retrieve delivery fee
    const { data: shipping, error: shippingError } = await supabase
      .from('SHIPPING_T')
      .select('delivery_fee')
      .eq('order_id', orderID)
      .single();

    if (shippingError && shippingError.code !== 'PGRST116') {
      throw new Error(`Failed to fetch shipping fee: ${shippingError.message}`);
    }
    
    const deliveryFee = shipping?.delivery_fee ? Number(shipping.delivery_fee) : 0;

    const sellerEarn = Number(total_amount) - deliveryFee;

    // sellect seller current balances
    const { data: seller, error: sellerFetchError } = await supabase
      .from('USERS_T')
      .select('balances')
      .eq('user_id', seller_id)
      .single();

    if (sellerFetchError) throw new Error(`Failed to fetch seller balance: ${sellerFetchError.message}`);

    const currentBalance = seller.balances ? Number(seller.balances) : 0;
    const newBalance = currentBalance + sellerEarn;

    // update new balances for seller
    const { error: balanceUpdateError } = await supabase
      .from('USERS_T')
      .update({ balances: newBalance })
      .eq('user_id', seller_id);

    if (balanceUpdateError) throw new Error(`Failed to update seller balance: ${balanceUpdateError.message}`);

    const transactionID = await IDGenerator();

    // create new transaction record for seller
    const { error: transactionError } = await supabase
      .from('WALLET_TRANSACTIONS_T')
      .insert({
        wallet_transaction_id: transactionID,
        user_id: seller_id,
        transaction_type: `Payment for rejected order: #${orderID}`,
        direction: 'Debit',
        payment_method: 'Wallet Balance',
        amount: sellerEarn,
        wallet_transaction_status: 'Success'
      });

    if (transactionError) throw new Error(`Failed to log wallet transaction: ${transactionError.message}`);

    // revalidatePath('/buyer/orders')

    return {
      success: true,
      message: 'Refund Rejected',
    };

  } catch (error) {
    console.error('Error executing confirmOrder:', error.message);
    return { success: false, error: error.message };
  }
}

export async function adminApproveRefundAction(orderID) {

  const supabase = await createClient();

  try {
    // update order to Refunded
    const { data: order, error: orderError } = await supabase
      .from('ORDERS_T')
      .update({ order_status: 'Refunded' })
      .eq('order_id', orderID)
      .select('buyer_id, total_amount')
      .single();

    if (orderError) throw new Error(`Failed to update order status: ${orderError.message}`);
    if (!order) throw new Error('Order not found.');

    const { buyer_id, total_amount } = order;

    // sellect buyer current balances
    const { data: buyer, error: sellerFetchError } = await supabase
      .from('USERS_T')
      .select('balances')
      .eq('user_id', buyer_id)
      .single();

    if (sellerFetchError) throw new Error(`Failed to fetch buyer balance: ${sellerFetchError.message}`);

    const currentBalance = buyer.balances ? Number(buyer.balances) : 0;
    const newBalance = currentBalance + Number(total_amount);
    console.log("Total Amount",Number(total_amount));

    console.log("Current Balance", currentBalance);
    console.log("New Balance", newBalance);

    console.log(buyer_id);
    console.log(newBalance);

    // update new balances for buyer
    const { error: balanceUpdateError } = await supabase
      .from('USERS_T')
      .update({ balances: newBalance })
      .eq('user_id', buyer_id);

    if (balanceUpdateError) throw new Error(`Failed to update buyer balance: ${balanceUpdateError.message}`);

    const transactionID = await IDGenerator();

    // create new transaction record for seller
    const { error: transactionError } = await supabase
      .from('WALLET_TRANSACTIONS_T')
      .insert({
        wallet_transaction_id: transactionID,
        user_id: buyer_id,
        transaction_type: `Refund for order: #${orderID}`,
        direction: 'Credit',
        payment_method: 'Wallet Balance',
        amount: Number(total_amount),
        wallet_transaction_status: 'Success'
      });

    if (transactionError) throw new Error(`Failed to log wallet transaction: ${transactionError.message}`);

    // revalidatePath('/buyer/orders')

    return {
      success: true,
      message: 'Refund Approved',
    };

  } catch (error) {
    console.error('Error executing confirmOrder:', error.message);
    return { success: false, error: error.message };
  }
}

export async function assignHubToCourier(userId, hubId) {
  const supabase = await createClient();

  const { count, error: checkError } = await supabase
    .from("SHIPPING_T")
    .select("*", { count: "exact", head: true })
    .eq("courier_id", userId)
    .neq("shipping_status", "Delivered");

  if (checkError) {
    console.error("Error checking pending deliveries:", checkError);
    return { success: false, error: "Failed to verify delivery status" };
  }

  if (count > 0) {
    return { success: false, error: "Cannot reassign hub while a delivery is pending." };
  }

  const { error } = await supabase
    .from("USERS_T")
    .update({ hub_id: hubId })
    .eq("user_id", userId);

  if (error) {
    console.error("Error assigning hub:", error);
    return { success: false, error: "Failed to assign hub" };
  }
  return { success: true };
}

const SECURITY_QUESTIONS = [
  "What is your secondary school name?",
  "What is the middle name of your mother?",
  "What is your favorite color?",
  "What is your first car brand?",
  "What is the city name were you born in?",
];

export async function setSecurityQuestions(userId, formData){
  const question1 = formData.get("security_question_1");
  const answer1 = formData.get("security_answer_1");
  const question2 = formData.get("security_question_2");
  const answer2 = formData.get("security_answer_2");

  if (!question1 || !answer1 || !question2 || !answer2) {
        return { success: false, error: "All fields are required." };
    }

  if (question1 === question2) {
        return { success: false, error: "Please choose two different questions." };
    }

  const hashedAnswer1 = await hashValue(answer1);
  const hashedAnswer2 = await hashValue(answer2);

  const supabase = await createClient();
  const { error } = await supabase
      .from("USERS_T")
      .update({
          security_question1: question1,
          answer1: hashedAnswer1,
          security_question2: question2,
          answer2: hashedAnswer2,
      })
      .eq("user_id", userId);

  if (error) {
      console.error("Error setting security questions:", error);
      return { success: false, error: "Failed to save security questions." };
  }

  return { success: true };
}

export async function verifySecurityQuestions(userId, questionNumber, submittedAnswer){
  const supabase = await createClient();
  const {data, error} = await supabase
    .from("USERS_T")
    .select(`answer${questionNumber}`)
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    return false;
  }

  const storedHash = data[`answer${questionNumber}`];

  const isMatch = await bcrypt.compare(submittedAnswer, storedHash);
  return isMatch;
}

export async function fetchUserOrders(userId){
    return await getUserOrders(userId);
}

export async function fetchUserTransactions(userId){
    return await getUserTransactions(userId);
}

export async function withdrawalAction(formData) {
  const wallet_transaction_id = await IDGenerator();
  const user_id = formData.get("userID");
  const transaction_type = "Withdraw";
  const direction = "Debit";
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
    throw new Error("Withdrawal failed");
  }

  await setBalances(user_id, -amount);
  revalidatePath("/seller/wallet");
}

export async function addAdmin(formData){

  const username = formData.get("username");
  const gender = formData.get("gender");
  const email = formData.get("email");
  const contactNumber = formData.get("contact_number");

  const supabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  const temporaryPassword = "AdminDefault@123456";
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password: temporaryPassword,
  });

  if (error) {
    console.error("Admin authentication generation error:", error.message);
    return redirect("/admin/ManageAdmins?error=This email is already registered.");
  }

  const user = data.user;
  if (!user) {
    return redirect("/admin/ManageAdmins?error=Admin authentication creation failed.");
  }

  const { error: insertError } = await supabase
    .from("USERS_T")
    .insert([
      {
        user_id: user.id,
        username: username,
        gender: gender,
        email: email,
        contact_number: contactNumber,
        role: "Admin",
        user_status: "Active",
        balances: 0.00,
      },
    ]);

  if (insertError) {
    console.error("Insert USER_T error for admin: ", insertError.message);
    return redirect("/admin/ManageAdmins?error=Failed to populate database row");
  }

  revalidatePath("/admin/ManageAdmins");
  return redirect("/admin/ManageAdmins?message=Admin account successfully added.");
}

export async function createHubAction(hubName, hubLocation, capacity) {

  const supabase = await createClient();

  const newId = await GeneralIDGenerator();

  const { data, error } = await supabase
    .from("HUBS_T")
    .insert({
      hub_id: newId,
      hub_name: hubName,
      hub_location: hubLocation,
      capacity: Number(capacity),
      hub_status: "Active",
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}

export async function adminAssignCourier(adminId, shippingId, courierId, orderId) {
  const supabase = await createClient();

  // uupdate shipping table
  const { error: shippingError } = await supabase
    .from("SHIPPING_T")
    .update({
      admin_id: adminId,
      courier_id: courierId,
      shipping_status: "Assigned",
    })
    .eq("shipping_id", shippingId)
    .select()
    .single();

  if (shippingError) {
    console.error("Error assigning courier:", error);
    throw error;
  }

  // update order table (!BUG)
  const { error: orderError } = await supabase
    .from("ORDERS_T")
    .update({
      order_status: "Out For Delivery"
    })
    .eq("order_id", orderId)

  if (orderError) {
    console.error("Error assigning courier:", error);
    throw error;
  }
}

export async function updateCourierStatus(courierID){

  const supabase = await createClient();

  const { error } = await supabase
    .from("USERS_T")
    .update({
      available_status: false
    })
    .eq("user_id", courierID)
  
  if (error) {
    console.error("Error assigning courier:", error);
    throw error;
  }

}