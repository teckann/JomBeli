"use client";

import Styles from "./BuyerVoucherSelection.module.css";

export default function VoucherSelection({ vouchers = [], selectedVoucherId, onSelectVoucher, subtotal = 0,}){
  function getVoucherDiscount(voucher) {
    const discountValue = Number(voucher.discount_value || 0);
    return discountValue;
  }

  return (
    <div className={Styles.voucherSection}>
      <div className={Styles.header}>
        <h2>Voucher</h2>

        {selectedVoucherId && (
          <button
            type="button"
            className={Styles.clearButton}
            onClick={() => onSelectVoucher(null)}
          >
            Remove
          </button>
        )}
      </div>

      {vouchers.length === 0 ? (
        <p className={Styles.emptyText}>No vouchers available.</p>
      ) : (
        <div className={Styles.voucherList}>
          {vouchers.map((voucher) => {
            const isSelected =
              selectedVoucherId === voucher.user_voucher_id;

            const minimumSpend = Number(voucher.min_spend || 0);
            const isEligible = subtotal >= minimumSpend;
            const voucherDiscount = getVoucherDiscount(voucher);

            return (
              <label
                key={voucher.user_voucher_id}
                className={`${Styles.voucherCard} ${
                  isSelected ? Styles.selected : ""
                } ${!isEligible ? Styles.disabled : ""}`}
              >
                <input
                  type="radio"
                  name="voucher"
                  value={voucher.user_voucher_id}
                  checked={isSelected}
                  disabled={!isEligible}
                  onChange={() => onSelectVoucher(voucher.user_voucher_id)}
                  className={Styles.radioInput}
                />

                <div className={Styles.voucherInfo}>
                  <div className={Styles.voucherTopRow}>
                    <strong>{voucher.voucher_name}</strong>

                    <span className={Styles.discountBadge}>
                      -RM {voucherDiscount.toFixed(2)}
                    </span>
                  </div>

                  {minimumSpend > 0 && (
                    <p className={Styles.metaText}>
                      Min. spend RM {minimumSpend.toFixed(2)}
                    </p>
                  )}

                  {!isEligible && (
                    <p className={Styles.errorText}>
                      Spend RM {(minimumSpend - subtotal).toFixed(2)} more to use this voucher.
                    </p>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
