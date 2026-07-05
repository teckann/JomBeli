"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "./auth";
import { createClient } from "./server";
import { GeneralIDGenerator } from '@/app/_lib/random-id-generator';
import { redirect } from "next/navigation";

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


export async function createNewVoucher(NewVoucher) {
  const supabase = await createClient();

  const startDate = NewVoucher.get('start_date') || null;
  const endDate = NewVoucher.get('end_date') || null;

  const newVoucher = {

      voucher_id: GeneralIDGenerator().toString(),


      user_id: NewVoucher.get('user_id'), 
      voucher_name: NewVoucher.get('voucher_name'),
      voucher_type: 'shop',
      discount_value: Number(NewVoucher.get('discount_value')),
      min_spend: Number(NewVoucher.get('min_spend')),
      quantity: Number(NewVoucher.get('quantity')),
      voucher_status: 'active',
      start_date: startDate,
      end_date: endDate
  };
  
  const { error } = await supabase
    .from('VOUCHERS_T')
    .insert([newVoucher]);

  if (error) {
    console.error("Failed to create new voucher:", error.message);
    throw new Error("Could not add new voucher");
  }

  revalidatePath('/seller/vouchers');

}

export async function sellerUpdateVoucher(id, newData) {
  const supabase = await createClient();
  const dbData = {
    voucher_name: newData.get('voucher_name'),
    discount_value: newData.get('discount_value'),
    min_spend: newData.get('min_spend'),
    quantity: newData.get('quantity'),
    start_date: newData.get('start_date'),
    end_date: newData.get('end_date'),
  };

  const { error } = await supabase
    .from("VOUCHERS_T")
    .update(dbData)
    .eq("voucher_id", id);

  if (error) throw new Error("Could not update voucher.");
  revalidatePath(`/seller/vouchers/${id}`);
}

export async function sellerVoucherActivation(id,newStatus) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("VOUCHERS_T")
    .update({ voucher_status: newStatus })
    .eq("voucher_id", id);

  if (error) throw new Error("Could not update voucher status.");
  revalidatePath(`/seller/vouchers/${id}`);
}