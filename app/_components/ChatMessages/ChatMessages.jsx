"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/_lib/supabase";

import styles from "./ChatMessages.module.css";

function ChatMessages({ messages, currentUserInfo, selectedUserInfo }) {
  const [messageRecords, setMessageRecords] = useState(messages);
  const currentUserID = currentUserInfo.user_id;
  const selectedUserID = selectedUserInfo.user_id;

  const pair = {
    [currentUserID]: "Me",
    [selectedUserID]: selectedUserInfo.username,
  };

  // [pending] dont know why error like this, but can works
  useEffect(() => {
    setMessageRecords(messages);
  }, [messages]);

  useEffect(() => {
    const channel = supabase
      .channel(`chat-${currentUserID}-${selectedUserID}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "MESSAGES_T",
        },
        (payload) => {
          const newMessage = payload.new;

          // check the chatroom, prevent receive another channel message
          const isCurrentChat =
            (newMessage.sender_id === currentUserID &&
              newMessage.receiver_id === selectedUserID) ||
            (newMessage.sender_id === selectedUserID &&
              newMessage.receiver_id === currentUserID);

          if (!isCurrentChat) return;

          setMessageRecords((prev) => {
            if (prev.some((msg) => msg.message_id === newMessage.message_id)) {
              return prev;
            }
            return [...prev, newMessage];
          });
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [currentUserID, selectedUserID]);

  return (
    <>
      {messageRecords.map((msg) => (
        <MessageField
          key={msg.message_id}
          isMe={msg.sender_id === currentUserID}
          username={pair[msg.sender_id]}
          datetime={msg.created_at}
          message={msg.message}
        />
      ))}
    </>
  );
}

const MessageField = ({ isMe, username, datetime, message }) => {
  const localTime = formatDateTime(datetime);

  return (
    <div
      className={`${styles.messageField} ${isMe ? styles.right : styles.left}`}
    >
      <p className={styles.username}>{username}</p>
      <div className={styles.messageBox}>
        <p>{message}</p>
        <p className={styles.time}>{localTime}</p>
      </div>
    </div>
  );
};

const formatDateTime = (datetime) => {
  const date = new Date(datetime);
  return `${date.toLocaleDateString("en-CA")} ${date.toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    },
  )}`;
};

export default ChatMessages;
