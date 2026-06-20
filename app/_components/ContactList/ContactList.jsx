import { getUser } from "@/app/_lib/auth";
import { getContactList } from "@/app/_lib/message-services";
import styles from "./ContactList.module.css";
import Link from "next/link";
import Image from "next/image";

async function ContactList() {
  const user = await getUser();

  const contacts = await getContactList(user.id);
  console.log(contacts);

  return (
    <div className={styles.main}>
      {contacts.map((contact) => (
        <div key={contact.user_id}>
          <Contact
            key={contact.user_id}
            user_id={contact.user_id}
            username={contact.username}
            avatar={contact.avatar}
          />
          <div className={styles.line}></div>
        </div>
      ))}
    </div>
  );
}
const Contact = ({ user_id, username, avatar }) => {
  return (
    <Link href={`/buyer/chat?id=${user_id}`} className={styles.link}>
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

export default ContactList;
