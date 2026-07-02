import { Suspense } from "react";
import styles from "./page.module.css";
import VoucherList from "@/app/_components/VoucherList/VoucherList";
import Spinner from "@/app/_components/Spinner/Spinner";
import Footer from "@/app/_components/Footer/Footer";
import { getUserInfo } from "@/app/_lib/data-services";

export const metadata = {
  title: "Vouchers",
};

async function page({ searchParams }) {
  const { id } = await searchParams;

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        {id ? <SellerMode id={id} /> : <PlatformMode />}
      </div>

      <Footer />
    </main>
  );
}

const MyVouchers = () => {
  return (
    <SpecialArea
      title="My Voucher"
      icon="M20.59 13.41 11 3.83A2 2 0 009.59 3H4a1 1 0 00-1 1v5.59A2 2 0 003.83 11l9.58 9.59a2 2 0 002.83 0l4.35-4.35a2 2 0 000-2.83ZM6.5 8A1.5 1.5 0 118 6.5 1.5 1.5 0 016.5 8Z"
      type="myVouchers"
    />
  );
};

const SellerMode = async ({ id }) => {
  const { username: shopname } = await getUserInfo(id);

  return (
    <>
      <MyVouchers />

      <SpecialArea
        title={`${shopname}'s Vouchers`}
        icon="M4 5a2 2 0 00-2 2v3a2 2 0 010 4v3a2 2 0 002 2h16a2 2 0 002-2v-3a2 2 0 010-4V7a2 2 0 00-2-2H4zm6 3a1 1 0 110 2 1 1 0 010-2zm0 4a1 1 0 110 2 1 1 0 010-2zm0 4a1 1 0 110 2 1 1 0 010-2z"
        type="seller"
        id={id}
      />
    </>
  );
};

const PlatformMode = () => {
  return (
    <>
      <MyVouchers />

      <SpecialArea
        title="Expiring Soon"
        icon="M12 1.75a10.25 10.25 0 1 0 10.25 10.25A10.26 10.26 0 0 0 12 1.75Zm0 18.5a8.25 8.25 0 1 1 8.25-8.25A8.26 8.26 0 0 1 12 20.25Zm1-13.25h-2v6a1 1 0 0 0 .29.71l3.5 3.5 1.42-1.42L13 12.59Z"
        type="expiringSoon"
      />

      <SpecialArea
        title="Platform Vouchers"
        icon="M4 5a2 2 0 00-2 2v3a2 2 0 010 4v3a2 2 0 002 2h16a2 2 0 002-2v-3a2 2 0 010-4V7a2 2 0 00-2-2H4zm6 3a1 1 0 110 2 1 1 0 010-2zm0 4a1 1 0 110 2 1 1 0 010-2zm0 4a1 1 0 110 2 1 1 0 010-2z"
        type="platform"
      />
    </>
  );
};

const SpecialArea = ({ title, icon, type, id }) => {
  return (
    <div className={styles.specialArea}>
      <div className={styles.titleContainer}>
        <div className={styles.title}>
          <svg
            className={styles.icon}
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            preserveAspectRatio="none"
          >
            <path d={icon} />
          </svg>
          <p>{title}</p>
        </div>
      </div>

      <Suspense fallback={<Spinner />}>
        {id ? <VoucherList type={type} id={id} /> : <VoucherList type={type} />}
      </Suspense>
    </div>
  );
};

export default page;
