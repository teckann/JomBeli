import WalletFilterBar from "@/app/_components/WalletFilterBar/WalletFilterBar";
import styles from "./page.module.css";
import { getTransactionMonths } from "@/app/_lib/data-services";
import { getUser } from "@/app/_lib/auth";
import TransactionRecords from "@/app/_components/TransactionRecords/TransactionRecords";

export const metadata = {
  title: "Wallet",
};

async function page({ searchParams }) {
  const { month, type } = await searchParams;

  const user = await getUser();
  const availableMonths = await getTransactionMonths(user.id);
  // console.log(availableMonths);

  return (
    <main className={styles.main}>
      <div className={styles.div1}>
        <WalletFilterBar availableMonths={availableMonths} />
        <TransactionRecords userID={user.id} month={month} type={type} />
      </div>

      <div className={styles.div2}>space 2</div>
    </main>
  );
}

const Transactions = () => {
  return <div>Transactions...</div>;
};

export default page;
