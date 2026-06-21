import { getTransactions } from "@/app/_lib/data-services";
import styles from "./TransactionRecords.module.css";

async function TransactionRecords({ userID, month, type }) {
  // console.log(month, type);
  let records = [];

  if (!month && !type) records = await getTransactions(userID);

  const length = records.length;

  return (
    <div className={styles.main}>
      <h2>Transaction History</h2>

      <div className={styles.content}>
        {records.map((record, index) => (
          <>
            <Record
              key={record.wallet_transaction_id}
              title={record.transaction_type}
              direction={record.direction}
              amount={record.amount}
              datetime={record.created_at}
            />

            {index !== length - 1 && <Line />}
          </>
        ))}
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
  return (
    <div>
      <div className={styles.recordTitle}>
        <p>{title}</p>
        <p>{formatDate(datetime)}</p>
      </div>

      <div className={styles.recordDirection}>RM {amount}</div>
    </div>
  );
};

const Line = () => {
  return <div className={styles.line}></div>;
};

export default TransactionRecords;
