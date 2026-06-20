import { supabase } from "./supabase";

export function subscribeToMessages({ setMessages }) {
  return supabase
    .channel("realtime-chat")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "MESSAGES_T" },
      async (payload) => {
        const newMessage = payload.new;

        setMessages((prev) => [...prev, newMessage]);
      },
    )
    .subscribe();
}
