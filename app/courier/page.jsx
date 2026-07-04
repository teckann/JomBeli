import { getUser } from "../_lib/auth";
import { getUserInfo } from "../_lib/data-services";
import Styles from "./page.module.css"
import { getAssignedOrderCount, getCurrentTasks, getShippingCountByHub, getTodayCompletedCount } from "../_lib/courier-services";
import Link from "next/link";

export const revalidate = 0;

const user = await getUser();
const userInfo = await getUserInfo(user.id);

const {
  username,
  avatar,
  hub_id,
  user_id
} = userInfo;

export default async function CourierHomePage() {

  const hubParcelCount = await getShippingCountByHub(hub_id);
  const assignedOrderCount = await getAssignedOrderCount(user_id);
  const dailyCompletedTaskCount = await getTodayCompletedCount(user_id);
  const currentTask = await getCurrentTasks(user_id);
  console.log(currentTask);

  return (
    <div className={Styles.dashboardWrapper}>
      <main className={Styles.dashboard}>
        <DashboardHeader />
        <StatsGrid 
          hubParcelCount={hubParcelCount} 
          assignedOrderCount={assignedOrderCount}
          dailyCompletedTaskCount={dailyCompletedTaskCount}
        />
        <CurrentTask task={currentTask}/>
      </main>
    </div>
  );
}

function DashboardHeader() {
  return (
    <header className={Styles.header}>
      <div>
        <h1 className={Styles.title}>Courier Dashboard</h1>
        <p className={Styles.subtitle}>Welcome back, {username}</p>
      </div>
    </header>
  );
}

function StatsGrid({ hubParcelCount, assignedOrderCount, dailyCompletedTaskCount }) {
  return (
    <section className={Styles.statsGrid}>
      <StatCard label="Assigned Orders" value={assignedOrderCount} />
      <StatCard label="Completed Today" value={dailyCompletedTaskCount} />
      <StatCard label="Parcels In Hub" value={hubParcelCount} />
      <StatCard label="Dont know" value="Dont Know" />
    </section>
  );
}

function StatCard({ label, value }) {
  return (
    <div className={Styles.card}>
      <p className={Styles.cardLabel}>{label}</p>
      <h2 className={Styles.cardValue}>{value}</h2>
    </div>
  );
}

function CurrentTask({task}) {
  return (
    <section className={Styles.currentTask}>
      <h2 className={Styles.sectionTitle}>Current Task</h2>
      
      <div className={Styles.taskCard}>
        {task.map((item, index)=>
          <div key={index}>
            <p className={Styles.taskInfo}>
              <span className={Styles.taskLabel}>
                Order:
              </span> 
              <span className={Styles.taskValue}>
                #{item.order_id}
              </span>
            </p>
            <p className={Styles.taskInfo}>
              <span className={Styles.taskLabel}>
                Recipient:
              </span> 
              <span className={Styles.taskValue}>
                {item.ORDERS_T.ADDRESSES_T.recipient_name}
              </span>
            </p>
            <p className={Styles.taskInfo}>
              <span className={Styles.taskLabel}>
                Recipient Contact:
              </span> 
              <span className={Styles.taskValue}>
                {item.ORDERS_T.ADDRESSES_T.recipient_contact_number}
              </span>
            </p>
            <p className={Styles.taskInfo}>
              <span className={Styles.taskLabel}>
                Destination:
              </span> 
              <span className={Styles.taskValue}>
                {item.ORDERS_T.ADDRESSES_T.street}
              </span>
            </p>
          </div>
        )}
        <Link href="/courier/navigation">Go to navigation</Link>
      </div>
    </section>
  );
}
