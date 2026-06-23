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

export async function getFilterManageProducts(category, status, productName) {

    const supabase = await createClient();

    console.log(`hhhhhhhhhhh ${productName}`);
    
    if (productName?.trim()) {
        const { data, error } = await supabase
            .from("PRODUCTS_T")
            .select("*")
            .ilike("product_name", `${productName}%`);

            if (error) {
                console.error(error);
                return [];
            }

            return data;
    }
    else {
        let query = supabase
        .from("PRODUCTS_T")
        .select("*");

        if (category && category !== "All") {
        query = query.eq("category", category);
        // console.log("category detected");
        }

        if (status) {
        query = query.eq("product_status", status);
        // console.log("status detected");
        }

        console.log(query);

        const { data, error } = await query;

        if (error) {
            console.error(error);
            throw new Error("Could not fetch product records");
        }

        return data;
        }
}

export async function getFilterUsers(role, status, username) {

    const supabase = await createClient();

    console.log(`hhhhhhhhhhh ${username}`);
    
    if (username?.trim()) {
        const { data, error } = await supabase
            .from("USERS_T")
            .select("*")
            .ilike("username", `${username}%`);

            if (error) {
                console.error(error);
                return [];
            }

            return data;
    }
    else {
        let query = supabase
        .from("USERS_T")
        .select("*");

        if (role && role !== "All") {
        query = query.eq("role", role);
        // console.log("category detected");
        }

        if (status) {
        query = query.eq("user_status", status);
        // console.log("status detected");
        }

        console.log(query);

        const { data, error } = await query;

        if (error) {
            console.error(error);
            throw new Error("Could not fetch user records");
        }

        return data;
        }
}