import { createClient } from "./server";
import {} from "./data-services";

export async function getTotalProductsCount() {
    const supabase = await createClient();

    const { count: totalProducts, error } = await supabase
    .from("PRODUCTS_T")
    .select("*", { count: "exact", head: true });

    if (error) {
        console.error(error);
        return 0;
    }

    return totalProducts;
}

export async function getMonthlyProductCreatedCount() {

    const supabase = await createClient();

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const startOfNextMonth = new Date(startOfMonth);
    startOfNextMonth.setMonth(startOfNextMonth.getMonth() + 1);

    const { count: monthlyProducts, error } = await supabase
    .from("PRODUCTS_T")
    .select("*", { count: "exact", head: true })
    .gte("created_at", startOfMonth.toISOString())
    .lt("created_at", startOfNextMonth.toISOString());

    if (error) {
        console.error(error);
        return 0;
    }

    return monthlyProducts;
}

export async function getTotalAvailableProductsCount() {

    const supabase = await createClient();

    const { count: activeProducts, error } = await supabase
    .from("PRODUCTS_T")
    .select("*", { count: "exact", head: true })
    .eq("product_status", "Active");

    if (error) {
        console.error(error);
        return 0;
    }

    return activeProducts;
}

export async function getTotalCategoryCount() {

    const supabase = await createClient();

    const { data, error } = await supabase
            .from("PRODUCTS_T")
            .select("category");

        if (error) {
            console.error(error);
            return 0;
        }

        const totalCategories = new Set(data.map(p => p.category)).size;

        return totalCategories;
}

