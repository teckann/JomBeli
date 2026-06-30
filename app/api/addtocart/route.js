import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/app/_lib/dynamic-server";

export async function POST(req) {
  const supabase = createSupabaseServerClient(req);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { variantId, quantity } = await req.json();

  const { data, error: insertError } = await supabase
    .from("CART_ITEMS_T")
    .insert({
      user_id: user.id,
      product_variant_id: variantId,
      quantity,
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    cartItemId: data.cart_item_id,
  });
}
