import { NextResponse } from "next/server";
import { createClient } from "@/app/_lib/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    const yearOnly = searchParams.get("yearOnly") === "true";

    if (!year) {
        return NextResponse.json({ error: "Missing year" }, { status: 400 });
    }

    let startDate, endDate;

    if (yearOnly) {
        startDate = `${year}-01-01T00:00:00+08:00`;
        endDate = `${year}-12-31T23:59:59+08:00`;
    } else {
        if (!month){
        return NextResponse.json({ error: "Missing month" }, { status: 400 });
    }
        const paddedMonth = String(month).padStart(2, "0");
        const lastDay = new Date(year, month, 0).getDate();
        startDate = `${year}-${paddedMonth}-01T00:00:00+08:00`;
        endDate = `${year}-${paddedMonth}-${lastDay}T23:59:59+08:00`;
    }

    startDate = new Date(startDate).toISOString();
    endDate = new Date(endDate).toISOString();

    const supabase = await createClient();

    const { data: users, error: userError } = await supabase
        .from("USERS_T")
        .select("*")
        .gte("created_at", startDate)
        .lte("created_at", endDate);

    if (userError) {
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }

    const { data: reportedSellers, error: reportError } = await supabase
        .from("SUPPORTS_T")
        .select("*")
        .eq("support_type", "Report Seller")
        .gte("created_at", startDate)
        .lte("created_at", endDate);
        
    if (reportError) {
        return NextResponse.json({ error: "Failed to fetch reported sellers" }, { status: 500 });
    }

    const { data: approvedRefunds, error: refundError } = await supabase
        .from("REFUNDS_T")
        .select("*")
        .eq("admin_status", "Approved")
        .gte("created_at", startDate)
        .lte("created_at", endDate);

    if (refundError) {
        return NextResponse.json({ error: "Failed to fetch approved refunds" }, { status: 500 });
    }

    const refundedOrderIds = new Set(approvedRefunds.map((r) => r.order_id));

    const { data: orderItems, error: itemsError } = await supabase
        .from("ORDER_ITEMS_T")
        .select("order_id, quantity, created_at, PRODUCT_VARIANTS_T(product_id, PRODUCTS_T(product_name, category))")
        .gte("created_at", startDate)
        .lte("created_at", endDate);

    if (itemsError) { 
        return NextResponse.json({ error: "Failed to fetch order items" }, { status: 500 });
    }

    const productTotals = {};
    for (const item of orderItems) {
        if (refundedOrderIds.has(item.order_id)) continue;
        
        const product = item.PRODUCT_VARIANTS_T?.PRODUCTS_T;
        if (!product) continue;

        const key = item.PRODUCT_VARIANTS_T.product_id;
        if (!productTotals[key]) {
            productTotals[key] = {
                product_id: key,
                product_name: product.product_name,
                category: product.category,
                total_sold: 0,
            };
        }
        productTotals[key].total_sold += item.quantity;
    }

    const topItems = Object.values(productTotals).sort((a, b) => b.total_sold - a.total_sold).slice(0, 5);

    return NextResponse.json({
        totalNewUsers: users.length,
        totalReportedSellers: reportedSellers.length,
        totalApprovedRefunds: approvedRefunds.length,
        topItems,
    });
}