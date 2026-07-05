import Styles from "./OverviewData.module.css";
import Link from "next/link";

export default function AdminStatCard({title, value, isCurrency = false, detailsHref}){

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

    if (detailsHref) {
        return(
            <Link href={detailsHref} className={Styles.AdminStatCard}>
                {cardContent}
            </Link>
        )
    }
    return(
        <div className={Styles.AdminStatCard}>
            {cardContent}
        </div>
    )
}