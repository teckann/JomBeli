// "use client";

import Styles from "./AdminFilterRefundsBars.module.css"
import { getRefund } from "@/app/_lib/data-services";
import FilterRefundsBar from "./AdminFilterRefundsClient";

export  default async function AdminFilterReportsBar() {

    const refunds = await getRefund();

    // filter the same status (... is used to create new array, set must combine with new to construct new object)
    const distinctSellerStatus = [... new Set(refunds.map((refund) => refund.seller_status))];
    const distinctAdminStatus = [... new Set(refunds.map((refund) => refund.admin_status))];

    

    return (
        <div className={Styles.tableRelatedContainer}>
            <div className={Styles.filterRelatedContainer}>
                <FilterRefundsBar sellerStatus={distinctSellerStatus} adminStatus={distinctAdminStatus} />
            </div>
        </div>
    );
}