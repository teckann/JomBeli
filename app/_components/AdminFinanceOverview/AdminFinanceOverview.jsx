import Styles from './AdminFinanceOverview.module.css';
import AdminFinanceStatCard from '../AdminFinanceStatCard/AdminFinanceStatCard';
import { getDailyTransactionCount,getDailyInflowAmount,getDailyOutflowAmount, getPlatformDeliveryRevenue } from '@/app/_lib/analysis-serives';
import { getDailyTransactionTypeBreakdown } from '@/app/_lib/analysis-serives';
import AdminDailyTransactionPieChart from '../AdminDailyTransactionChart/DailyTransactionPieChart';

export default async function AdminFinanceOverview(){

    const dailyTransactionCount = await getDailyTransactionCount();
    const dailyInflow = await getDailyInflowAmount();
    const dailyOutflow = await getDailyOutflowAmount();
    const revenue = await getPlatformDeliveryRevenue();
    const counts = await getDailyTransactionTypeBreakdown();

    return(
        <>
            <div className={Styles.Container}>
                <div className={Styles.infoBarColumn} >
                    <div className={Styles.infoBox}> {/* in number */}
                        <AdminFinanceStatCard title="Transactions Made Today" value={dailyTransactionCount}/>
                    </div>
                    <div className={Styles.infoBox}> {/* in rm */} 
                        <AdminFinanceStatCard title="Daily Buyer TopUp" value={dailyInflow} isCurrency={true}/>
                    </div>
                    <div className={Styles.infoBox}> {/* in rm */}
                        <AdminFinanceStatCard title="Daily Buyer Money Used" value={dailyOutflow} isCurrency={true}/>
                    </div>
                    <div className={Styles.infoBox}> {/* in rm */}
                        <AdminFinanceStatCard title="Platform Daily Delivery Revenue" value={revenue} isCurrency={true}/>
                    </div>
                </div>
                <div className={Styles.chartContainer}>
                    <h3>Daily Transaction Types</h3>
                    <AdminDailyTransactionPieChart counts={counts} />
                </div>
            </div>
            
        </>
    );
}