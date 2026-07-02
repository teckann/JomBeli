
import React from 'react';
import Link from 'next/link';
import styles from './SellerGenerateReportButton.module.css';

const SellerGenerateReportButton = () => {
  return (
    <Link href="/seller/dashboard/generate-report" className={styles.reportBtn}>
      Generate Report
    </Link>
  );
};

export default SellerGenerateReportButton;