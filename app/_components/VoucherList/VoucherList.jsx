import {
  getMyVouchers,
  getPlatformExpiringSoonVouchers,
  getPlatformVouchers,
  getSellerVouchers,
} from "@/app/_lib/vouchers-services";
import styles from "./VoucherList.module.css";
import { getUser } from "@/app/_lib/auth";
import VoucherCard from "../VoucherCard/VoucherCard";
import TempCoverComponent from "../TempCoverComponent/TempCoverComponent";

async function VoucherList({ type, id }) {
  const user = await getUser();

  // type have expiringSoon，platform，seller，myVouchers
  let displayVouchers = [];
  let buttonText = "";
  let title = "";
  let desc = "";

  if (type === "myVouchers") {
    displayVouchers = await getMyVouchers(user.id);
    buttonText = "Use Now";
    title = "No Vouchers Claimed Yet";
    desc =
      "You haven't claimed any vouchers yet. Start exploring available deals now.";
  }

  if (type == "expiringSoon") {
    displayVouchers = await getPlatformExpiringSoonVouchers(user.id);
    buttonText = "Claim Now";
    title = "No Expiring Vouchers";
    desc = "No vouchers are expiring soon. You're all set for now.";
  }

  if (type === "platform") {
    const currentList = await getPlatformVouchers(user.id);
    const expiringList = await getPlatformExpiringSoonVouchers(user.id);

    const expiringSet = new Set(
      (expiringList || []).map((v) => v.voucher_id).filter(Boolean),
    );

    // filter out expiring soon voucher from currentList
    displayVouchers = currentList.filter(
      (v) => v?.voucher_id && !expiringSet.has(v.voucher_id),
    );

    buttonText = "Claim Now";
    title = "No Platform Vouchers Available";
    desc =
      "No platform vouchers available at the moment. Please check back for upcoming promotions.";
  }

  if (type === "seller") {
    // console.log(id);
    displayVouchers = await getSellerVouchers(user.id, id);
    buttonText = "Claim Now";
    title = "No Seller Vouchers Yet";
    desc = "No vouchers are available from this shop yet.";
  }

  return displayVouchers.length !== 0 ? (
    <div className={styles.voucherListContainer}>
      {displayVouchers.map((voucher, index) => (
        <VoucherCard
          key={voucher.voucher_id || index}
          title={voucher.voucher_name}
          minSpend={voucher.min_spend}
          expiredDate={voucher.end_date}
          buttonText={buttonText}
          discountValue={voucher.discount_value}
          voucherId={voucher.voucher_id}
        />
      ))}
    </div>
  ) : (
    <div className={styles.tempCoverContainer}>
      <TempCoverComponent
        imagePath="/data-not-found.png"
        alt="Data not found"
        title={title}
        desc={desc}
      />
    </div>
  );
}

export default VoucherList;
