import { NextResponse } from "next/server";
import { createClient } from "@/app/_lib/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month"); // "06", optional if yearOnly
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
        if (!month) return NextResponse.json({ error: "Missing month" }, { status: 400 });
        const paddedMonth = String(month).padStart(2, "0");
        const lastDay = new Date(year, month, 0).getDate();
        startDate = `${year}-${paddedMonth}-01T00:00:00+08:00`;
        endDate = `${year}-${paddedMonth}-${lastDay}T23:59:59+08:00`;
    }

    const supabase = await createClient();
    const { data, error } = await supabase
        .from("WALLET_TRANSACTIONS_T")
        .select("*, USERS_T(username)")
        .gte("created_at", new Date(startDate).toISOString())
        .lte("created_at", new Date(endDate).toISOString())
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching period transactions:", error);
        return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
    }
    return NextResponse.json(data);
}