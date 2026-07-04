import { createClient } from "./server";

export async function getContactList(userId) {
  const supabase = await createClient();

  // all messages related the current user
  const { data: messages, error } = await supabase
    .from("MESSAGES_T")
    .select("sender_id, receiver_id, message, created_at")
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  //  latest message for each contact
  const latestChats = new Map();

  for (const msg of messages) {
    const contactId =
      msg.sender_id === userId ? msg.receiver_id : msg.sender_id;

    if (!latestChats.has(contactId)) {
      latestChats.set(contactId, {
        user_id: contactId,
        last_message: msg.message,
        created_at: msg.created_at,
      });
    }
  }

  const contactIds = [...latestChats.keys()];

  if (contactIds.length === 0) return [];

  // user info
  const { data: users, error: userError } = await supabase
    .from("USERS_T")
    .select("user_id, username, avatar")
    .in("user_id", contactIds);

  if (userError) {
    console.error(userError);
    return [];
  }

  // merge user info and latest message
  const result = contactIds.map((id) => {
    const user = users.find((u) => u.user_id === id);
    const chat = latestChats.get(id);

    return {
      user_id: id,
      username: user?.username ?? "",
      avatar: user?.avatar ?? null,
      last_message: chat.last_message,
      created_at: chat.created_at,
    };
  });

  return result;
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
