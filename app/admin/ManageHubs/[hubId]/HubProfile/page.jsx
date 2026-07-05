import AdminHubBackButton from "@/app/_components/AdminHubBackButton/AdminHubBackButton";
import styles from "./HubProfile.module.css";
import {
  getHub,
  getTotalCourierMan,
  getTotalParcel,
} from "@/app/_lib/admin-hub-actions";
import HubInfo from "@/app/_components/HubInfo/HubInfo";

async function page({ params }) {
  const { hubId } = await params;
  const hubInfo = await getHub(hubId);
  const { total_courier, total_available_courier } =
    await getTotalCourierMan(hubId);
  const totalOccupancy = await getTotalParcel(hubId);

  // console.log(hubId);
  // console.log(hubInfo);

  return (
    <div className={styles.hubProfileContainer}>
      <AdminHubBackButton />

      <HubInfo
        hubInfo={hubInfo}
        totalCourier={total_courier}
        totalAvailableCourier={total_available_courier}
        totalOccupancy={totalOccupancy}
      />
    </div>
  );
}

export default page;
