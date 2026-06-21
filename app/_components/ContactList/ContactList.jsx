import { getUser } from "@/app/_lib/auth";
import { getContactList } from "@/app/_lib/message-services";
import styles from "./ContactList.module.css";
import Link from "next/link";
import Image from "next/image";

async function ContactList({ paramID }) {
  const user = await getUser();

  const contacts = await getContactList(user.id);
  // console.log(contacts);

  if (!contacts || contacts.length === 0) return <TempCoverComponent />;

  return (
    <div className={styles.main}>
      {contacts.map((contact) => (
        <div key={contact.user_id}>
          <Contact
            user_id={contact.user_id}
            username={contact.username}
            avatar={contact.avatar}
            selected={paramID === contact.user_id}
          />
          <div className={styles.line}></div>
        </div>
      ))}
    </div>
  );
}
const Contact = ({ user_id, username, avatar, selected }) => {
  return (
    <Link
      href={`/chat?id=${user_id}`}
      className={`${styles.link} ${selected ? styles.hover : ""}`}
    >
      <div className={styles.avatarContainer}>
        <Image src={avatar} alt="avatar" fill className={styles.avatar} />
      </div>

      <div className={styles.contactInfo}>
        <p className={styles.username}>{username}</p>
        <p className={styles.lastOnline}>Last Online: xxx</p>
      </div>
    </Link>
  );
};

const TempCoverComponent = () => {
  return (
    <div className={styles.mainNoData}>
      <div className={styles.imageContainer}>
        <Image
          src="/contact-is-empty.png"
          alt="Chat is empty"
          fill
          className={styles.image}
        />
      </div>

      <div className={styles.noDataContainer}>
        <h2>Chat is Empty</h2>
        <p>No conversations yet.</p>
      </div>
    </div>
  );
};

export default ContactList;
