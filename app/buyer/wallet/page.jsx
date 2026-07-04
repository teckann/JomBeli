import WalletFilterBar from "@/app/_components/WalletFilterBar/WalletFilterBar";
import styles from "./page.module.css";
import {
  getTransactionMonths,
  getUserInfo,
  getFilterTransactions,
  getTransactions
} from "@/app/_lib/data-services";
import { getUser } from "@/app/_lib/auth";
import TransactionRecords from "@/app/_components/TransactionRecords/TransactionRecords";
import TopUp from "@/app/_components/TopUp/TopUp";

export const metadata = {
  title: "My Wallet",
};

async function page({ searchParams }) {
  const { month, type } = await searchParams;

  const user = await getUser();
  const availableMonths = await getTransactionMonths(user.id);
  const userInfo = await getUserInfo(user.id);

  // Fetch transactions for report
  let transactions = [];
  const normalizedMonth = month && month !== "all" ? month : null;
  const normalizedType = type && type !== "all" ? type : null;

  if (!normalizedMonth && !normalizedType) {
    transactions = await getTransactions(user.id);
  } else {
    transactions = await getFilterTransactions(user.id, normalizedMonth, normalizedType);
  }

  return (
    <main className={styles.main}>
      <div className={styles.div1}>
        <WalletFilterBar
          availableMonths={availableMonths}
          transactions={transactions}
          userInfo={userInfo}
        />
        <TransactionRecords userID={user.id} month={month} type={type} />
      </div>

      <div className={styles.div2}>
        <Wallet>
          <WalletBalances balances={userInfo.balances} />
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
