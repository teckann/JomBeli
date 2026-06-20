import Image from "next/image";
import styles from "./ChatSpace.module.css";

function ChatSpace({ id }) {
  if (!id) return <TempCoverComponent />;

  return <div className={styles.main}>Developing....</div>;
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
        <h2>Select a chat to start messaging</h2>
        <p>Choose a conversation from the sidebar to begin.</p>
      </div>
    </div>
  );
};

export default ChatSpace;
