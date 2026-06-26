import { createClient } from "./server";

export async function getContactList(user_id) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("MESSAGES_T")
    .select("sender_id, receiver_id")
    .or(`sender_id.eq.${user_id},receiver_id.eq.${user_id}`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  // filter out the repeat seller id & current user id
  const contactIDs = [
    ...new Set(
      data.map((item) =>
        item.sender_id === user_id ? item.receiver_id : item.sender_id,
      ),
    ),
  ];

  const { data: contactInfo, error: contactError } = await supabase
    .from("USERS_T")
    .select("user_id, username, avatar")
    .in("user_id", contactIDs);

  if (contactError) {
    console.error(contactError);
    return [];
  }

  return contactInfo;
}

export async function getMessages(sender_id, receiver_id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("MESSAGES_T")
    .select("*")
    .or(
      `and(sender_id.eq.${sender_id},receiver_id.eq.${receiver_id}),and(sender_id.eq.${receiver_id},receiver_id.eq.${sender_id})`,
    )
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch messages:", error.message);
    throw new Error("Could not fetch messages");
  }

  return data;
}

export async function createMessage(sender_id, receiver_id, message) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("MESSAGES_T")
    .insert([{ sender_id, receiver_id, message }])
    .select()
    .single();

  if (error) {
    console.error("Failed to create messages:", error.message);
    throw new Error(error.message);
  }

  return data;
}
