import Styles from './AdminFinanceOverview.module.css';
import AdminStatCard from '@/app/_components/AdminFinanceOverviewData/OverviewData';
import { getDailyTransactionCount,getDailyInflowAmount,getDailyOutflowAmount } from '@/app/_lib/analysis-serives';

export default async function AdminFinanceOverview(){

    const dailyTransactionCount = await getDailyTransactionCount();
    const dailyInflow = await getDailyInflowAmount();
    const dailyOutflow = await getDailyOutflowAmount();

    return(
        <>
            <div className={Styles.upperContainer}>
                <div className={Styles.infoBox}> {/* in number */}
                    <AdminStatCard title="Transactions Made Today" value={dailyTransactionCount}/>
                </div>
                <div className={Styles.infoBox}> {/* in rm */} 
                    <AdminStatCard title="Daily Buyer TopUp" value={dailyInflow} isCurrency={true}/>
                </div>
                <div className={Styles.infoBox}> {/* in rm */}
                    <AdminStatCard title="Daily Buyer Money Used" value={dailyOutflow} isCurrency={true}/>
                </div>
            </div>
            <div>
                
            </div>
        </>
    );
}