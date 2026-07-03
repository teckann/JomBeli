
import Styles from "./AdminFIlterOrderBars.module.css"
import { getOrders } from "@/app/_lib/data-services";
import FilterOrderBar from "./AdminFilterOrderClient";

export  default async function AdminFilterOrdersBar() {

    const orders = await getOrders();

    // filter the same status (... is used to create new array, set must combine with new to construct new object)
    const distinctOrderStatus = [... new Set(orders.map((order) => order.order_status))];

    

    return (
        <div className={Styles.tableRelatedContainer}>
            <div className={Styles.filterRelatedContainer}>
                <FilterOrderBar orderStatus={distinctOrderStatus} />
            </div>
        </div>
    );
}