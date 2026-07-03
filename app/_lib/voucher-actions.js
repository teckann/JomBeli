"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "./auth";
import { createClient } from "./server";

export async function claimVoucher(voucherId) {
  const user = await getUser();
  const supabase = await createClient();

  // insert voucher
  const { error: insertError } = await supabase.from("USER_VOUCHERS_T").insert({
    user_id: user.id,
    voucher_id: voucherId,
  });

  if (insertError) {
    console.error(insertError);
    throw new Error("Failed to claim voucher");
  }

  // update quantity
  const { data: voucher, error: fetchError } = await supabase
    .from("VOUCHERS_T")
    .select("quantity")
    .eq("voucher_id", voucherId)
    .single();

  if (fetchError) {
    console.error(fetchError);
    throw new Error("Failed to fetch voucher quantity");
  }

  const newQty = (voucher.quantity ?? 0) - 1;

  const { error: updateError } = await supabase
    .from("VOUCHERS_T")
    .update({ quantity: newQty })
    .eq("voucher_id", voucherId);

  if (updateError) {
    console.error(updateError);
    throw new Error("Failed to update voucher quantity");
  }

  // revalidatePath("/buyer/vouchers");
}
