"use client";

import { useRouter, useSearchParams } from "next/navigation";
import styles from "./WalletFilterBar.module.css";

function SellerFilterBar({ availableMonths }) {
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

    </form>
  );
}

export default SellerFilterBar;
