
import Styles from "./AdminFilterHubs.module.css"
import { getHubs } from "@/app/_lib/data-services";
import FilterHubsBar from "./AdminFilterHubsClient";

export  default async function AdminFilterHubsBar() {

    const hubs = await getHubs();

    // filter the same status (... is used to create new array, set must combine with new to construct new object)
    const distinctHubsStatus = [... new Set(hubs.map((hub) => hub.hub_status))];

    

    return (
        <div className={Styles.tableRelatedContainer}>
            <div className={Styles.filterRelatedContainer}>
                <FilterHubsBar hubStatus={distinctHubsStatus} />
            </div>
        </div>
    );
}