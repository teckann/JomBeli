"use server";
import { revalidatePath } from "next/cache";
import { revalidate } from "../page";
import { createClient } from "./server";

export async function getHub(hubId) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("HUBS_T")
    .select("*")
    .eq("hub_id", hubId)
    .order("created_at", { ascending: false })
    .single();

  if (error) {
    console.error("Failed to fetch hubs:", error.message);
    throw new Error("Could not fetch hubs");
  }

  return data;
}

export async function updateHubStatus(hubId, newStatus) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("HUBS_T")
    .update({
      hub_status: newStatus,
    })
    .eq("hub_id", hubId);

  if (error) {
    console.error("Failed to update hub status:", error.message);
    throw new Error("Could not update hub status");
  }

  revalidatePath(`/admin/ManageHubs/${hubId}/HubProfile`);
}

export async function getTotalCourierMan(hubId) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("USERS_T")
    .select("available_status")
    .eq("hub_id", hubId)
    .eq("role", "Courier")
    .eq("user_status", "Active");

  if (error) {
    console.error("Failed to fetch couriers:", error.message);
    throw new Error("Could not fetch courier information");
  }

  const total_courier = data.length;

  const total_available_courier = data.filter(
    (courier) => courier.available_status === true,
  ).length;

  return {
    total_courier,
    total_available_courier,
  };
}

export async function updateHubInfo(formData) {
  const supabase = await createClient();

  const hubId = formData.get("hubId");
  const hubName = formData.get("hubName");
  const hubLocation = formData.get("hubLocation");
  const hubCapacity = formData.get("hubCapacity");

  console.log(hubId, hubName, hubLocation, hubCapacity);

  const { error } = await supabase
    .from("HUBS_T")
    .update({
      hub_name: hubName,
      hub_location: hubLocation,
      capacity: hubCapacity,
    })
    .eq("hub_id", hubId);

  if (error) {
    console.error("Failed to update hub:", error.message);
    throw new Error("Could not update hub information");
  }
}

export async function getTotalParcel(hubId) {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("SHIPPING_T")
    .select("*", { count: "exact", head: true })
    .eq("hub_id", hubId)
    .eq("shipping_status", "Created");

  if (error) {
    console.error("Failed to count created shipments:", error.message);
    throw new Error("Could not fetch total created shipments");
  }

  return count;
}
