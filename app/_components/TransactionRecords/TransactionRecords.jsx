import {
  getFilterTransactions,
  getTransactions,
} from "@/app/_lib/data-services";
import styles from "./TransactionRecords.module.css";
import Image from "next/image";
import TempCoverComponent from "../TempCoverComponent/TempCoverComponent";

async function TransactionRecords({ userID, month, type }) {
  // console.log(month, type);
  let records = [];

  if (!month && !type) records = await getTransactions(userID);

  if (month || type) records = await getFilterTransactions(userID, month, type);

  // console.log(records);
  const length = records.length;

  return (
    <div className={styles.main}>
      <h2>Transaction History</h2>

      <div className={styles.content}>
        {length === 0 ? (
          <TempCoverComponent
            imagePath="/data-not-found.png"
            alt="Data not found"
            title="No Transaction Records"
            desc="Your transaction history will appear here once you start using your wallet."
          />
        ) : (
          records.map((record, index) => (
            <div key={record.wallet_transaction_id}>
              <Record
                title={record.transaction_type}
                direction={record.direction}
                amount={record.amount}
                datetime={record.created_at}
              />

              {index !== length - 1 && <Line />}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function formatDate(datetime) {
  const date = new Date(datetime);

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

const Record = ({ title, direction, amount, datetime }) => {
  const flag = direction === "Credit";

  return (
    <div className={styles.record}>
      <div className={styles.recordTitle}>
        <p className={styles.title}>{title}</p>
        <p className={styles.datetime}>{formatDate(datetime)}</p>
      </div>

      <div
        className={`${styles.recordDirection} ${flag ? styles.greenColor : styles.redColor}`}
      >
        {flag ? "+" : "-"} RM {amount}
      </div>
    </div>
  );
};

const Line = () => {
  return <div className={styles.line}></div>;
};

export default TransactionRecords;
