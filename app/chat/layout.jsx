import BuyerNavBar from "../_components/BuyerNavBar/BuyerNavBar";
import styles from "./page.module.css";

export default function BuyerLayout({ children }) {
  return (
    <>
      <div className={styles.main}>
        <BuyerNavBar />

        {children}
      </div>
    </>
  );
}
