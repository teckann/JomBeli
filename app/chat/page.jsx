import BuyerChatNavBar from "@/app/_components/BuyerChatNavBar/BuyerChatNavBar";
import ContactList from "@/app/_components/ContactList/ContactList";
import ChatSpace from "@/app/_components/ChatSpace/ChatSpace";

import styles from "./page.module.css";

export const metadata = {
  title: "Chat",
};

async function chat({ searchParams }) {
  const { id } = await searchParams;

  return (
    <div className={styles.content}>
      <ContactList paramID={id} />

      <ChatSpace id={id} />
    </div>
  );
}

export default chat;
