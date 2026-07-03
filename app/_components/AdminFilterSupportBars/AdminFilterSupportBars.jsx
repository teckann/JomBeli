// "use client";

import Styles from "./AdminFilterSupportBars.module.css";
import { getSystemSupports } from "@/app/_lib/data-services";
import AdminFilterSupportBars from "./AdminFilterSupportClient";

export  default async function AdminFilterSupportsBar() {

    const supports = await getSystemSupports();

    // filter the same status (... is used to create new array, set must combine with new to construct new object)
    const distinctSupportType = [... new Set(supports.map((support) => support.support_type))];
    const distinctStatus = [... new Set(supports.map((support) => support.support_status))];

    

    return (
        <div className={Styles.tableRelatedContainer}>
            <div className={Styles.filterRelatedContainer}>
                <AdminFilterSupportBars supportType={distinctSupportType} supportStatus={distinctStatus} />
            </div>
        </div>
    );
}