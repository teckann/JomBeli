import Image from "next/image";
import styles from "./ChatSpace.module.css";
import { getMessages } from "@/app/_lib/message-services";
import { getUser } from "@/app/_lib/auth";
import { getUserInfo } from "@/app/_lib/data-services";
import ChatMessages from "../ChatMessages/ChatMessages";
import { sendMessageAction } from "@/app/_lib/actions";

async function ChatSpace({ id }) {
  if (!id) return <TempCoverComponent />;

  const user = await getUser();

  const messages = await getMessages(user.id, id);
  const currentUserInfo = await getUserInfo(user.id);
  const selectedUserInfo = await getUserInfo(id);

  return (
    <div className={styles.main}>
      <div className={styles.chatMessages}>
        <ChatMessages
          messages={messages}
          currentUserInfo={currentUserInfo}
          selectedUserInfo={selectedUserInfo}
        />
      </div>

      <InputForm
        sendMessageAction={sendMessageAction}
        receiverID={id}
        senderID={user.id}
      />
    </div>
  );
}

const TempCoverComponent = () => {
  return (
    <div className={styles.mainNoData}>
      <div className={styles.imageContainer}>
        <Image
          src="/data-not-found.png"
          alt="Data not found"
          fill
          className={styles.image}
        />
      </div>

      <div className={styles.noDataContainer}>
        <h2>Select a Chat to Start Messaging</h2>
        <p>Choose a conversation from the sidebar to begin.</p>
      </div>
    </div>
  );
};

const InputForm = ({ sendMessageAction, receiverID, senderID }) => {
  return (
    <form action={sendMessageAction} className={styles.form}>
      <input type="hidden" name="receiverID" value={receiverID} />
      <input type="hidden" name="senderID" value={senderID} />

      <div className={styles.inputGroup}>
        <input
          type="text"
          id="content"
          name="content"
          placeholder="Type a message..."
          required
        />
      </div>
      <button type="submit">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
        </svg>
      </button>
    </form>
  );
};

export default ChatSpace;
