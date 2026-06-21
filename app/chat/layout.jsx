import BuyerChatNavBar from "../_components/BuyerChatNavBar/BuyerChatNavBar";
import styles from "./page.module.css";

export default function BuyerLayout({ children }) {
  return (
    <>
      <div className={styles.main}>
        <BuyerChatNavBar />

        {children}
      </div>
    </>
  );
}
