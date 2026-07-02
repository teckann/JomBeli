"use client";

import { useRouter } from "next/navigation";
import styles from "./VoucherCard.module.css";
import { claimVoucher } from "@/app/_lib/voucher-actions";

function VoucherCard({
  title,
  minSpend,
  expiredDate,
  discountValue,
  voucherId,
  buttonText,
}) {
  const router = useRouter();

  const handleOnClick = async (buttonText, voucherId) => {
    if (buttonText === "Use Now") {
      return router.push("/buyer/category");
    }

    if (buttonText === "Claim Now") {
      await claimVoucher(voucherId);
      router.refresh();
      router.push("/buyer/vouchers/success");
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.iconContainer}>
        <svg
          className={styles.icon}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M4 5a2 2 0 00-2 2v3a2 2 0 010 4v3a2 2 0 002 2h16a2 2 0 002-2v-3a2 2 0 010-4V7a2 2 0 00-2-2H4zm6 3a1 1 0 110 2 1 1 0 010-2zm0 4a1 1 0 110 2 1 1 0 010-2zm0 4a1 1 0 110 2 1 1 0 010-2z" />
        </svg>
      </div>

      <div className={styles.content}>
        <div className={styles.titleRow}>
          <p className={styles.title}>
            RM {discountValue} @ {title}
          </p>

          <div className={styles.subTitle}>
            <p className={styles.sub}>Min. Spend RM {minSpend}</p>
            <p className={styles.expired}>Expired: {formatDate(expiredDate)}</p>
          </div>
        </div>

        <button
          className={styles.button}
          onClick={() => handleOnClick(buttonText, voucherId)}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
};

export default VoucherCard;
