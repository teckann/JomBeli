import React from "react";
import styles from './SellerDashboardStatisticCard.module.css';

const SellerDashboardStatisticCard = ({ title, value }) => {
    return (
        <div className={styles.statisticCard}>
            <h3 className={styles.statisticTitle}>{title}</h3>
            <h2 className={styles.statisticValue}>{value}</h2>
        </div>
    );

}

export default SellerDashboardStatisticCard;