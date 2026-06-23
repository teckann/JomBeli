import WalletFilterBar from "@/app/_components/WalletFilterBar/WalletFilterBar";
import styles from "./page.module.css";
import { getTransactionMonths, getUserInfo } from "@/app/_lib/data-services";
import { getUser } from "@/app/_lib/auth";
import TransactionRecords from "@/app/_components/TransactionRecords/TransactionRecords";
import TopUp from "@/app/_components/TopUp/TopUp";

export const metadata = {
  title: "Wallet",
};

async function page({ searchParams }) {
  const { month, type } = await searchParams;

  const user = await getUser();
  const availableMonths = await getTransactionMonths(user.id);
  const { balances } = await getUserInfo(user.id);
  // console.log(availableMonths);
  console.log(balances);

  return (
    <main className={styles.main}>
      <div className={styles.div1}>
        <WalletFilterBar availableMonths={availableMonths} />
        <TransactionRecords userID={user.id} month={month} type={type} />
      </div>

      <div className={styles.div2}>
        <Wallet>
          <WalletBalances balances={balances} />
          <TopUp userID={user.id} />
        </Wallet>
      </div>
    </main>
  );
}

const Wallet = ({ children }) => {
  return <div className={styles.wallet}>{children}</div>;
};

const WalletBalances = ({ balances }) => {
  return (
    <div className={styles.walletBalance}>
      <p className={styles.walletTitle}>Balance</p>

      <div className={styles.walletAmount}>
        <span>RM</span>
        <h2>{balances.toFixed(2)}</h2>
      </div>
    </div>
  );
};

export default page;
