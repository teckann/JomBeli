import Styles from "./OverviewData.module.css";

export default function AdminStatCard({title, value, isCurrency = false}){

    const displayValue = isCurrency 
            ? new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(value) //intl = internationalization
            : value;

    return(
        <div className={Styles.AdminStatCard}>
            <h1 className={Styles.title}>{title}</h1>
            <h2 className={Styles.value}>{displayValue}</h2>
        </div>
    )
}