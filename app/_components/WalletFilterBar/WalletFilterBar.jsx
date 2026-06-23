"use client";

import { useRouter, useSearchParams } from "next/navigation";
import styles from "./WalletFilterBar.module.css";

function WalletFilterBar({ availableMonths }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentMonth = searchParams.get("month") || "all";
  const currentType = searchParams.get("type") || "all";

  const handleChange = (e) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set(e.target.name, e.target.value);

    router.push(`?${params.toString()}`);
  };

  return (
    <form className={styles.filterBar}>
      <div className={styles.filterDiv1}>
        <div className={styles.filter}>
          <label htmlFor="month">Month:</label>
          <select
            name="month"
            id="month"
            value={currentMonth}
            onChange={handleChange}
          >
            <option value="all">All</option>
            {availableMonths.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filter}>
          <label htmlFor="type">Type:</label>
          <select
            name="type"
            id="type"
            value={currentType}
            onChange={handleChange}
          >
            <option value="all">All</option>
            <option value="Credit">Credit</option>
            <option value="Debit">Debit</option>
          </select>
        </div>
      </div>

      <div className={styles.filterDiv2}>
        <button className={styles.button}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6zm7 1.5L18.5 9H13V3.5zM8 13h8v2H8v-2zm0 4h8v2H8v-2zm0-8h5v2H8V9z" />
          </svg>
          <p>Generate Report</p>
        </button>
      </div>
    </form>
  );
}

export default WalletFilterBar;
