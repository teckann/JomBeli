import Styles from "./AdminFinanceStatCard.module.css";

export default function AdminFinanceStatCard({title, value, isCurrency = false, detailsHref}){

    const displayValue = isCurrency 
            ? new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(value) //intl = internationalization
            : value;

    const cardContent = (
    <>
        <h1 className={Styles.title}>{title}</h1>
        <h2 className={Styles.value}>{displayValue}</h2>
        {detailsHref && <span className={Styles.detailsLink}>Details &gt;</span>}
    </>
    );

    return(
        <div className={Styles.AdminStatCard}>
            {cardContent}
        </div>
    )
}