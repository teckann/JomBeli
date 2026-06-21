"uce client";

import Styles from "./AdminFilterProductsBars.module.css"
import { createClient } from "@/app/_lib/server";

export default function AdminFilterProductsBar() {


    

    return (
        <div className={Styles.tableRelatedContainer}>
            <div className={Styles.filterRelatedContainer}>
                <div className={Styles.searchBarContainer}>
                    <input type="text" placeholder="Search by Product Name" />
                </div>
                <div className={Styles.filterBarsContainer}>
                    <input type="" />
                </div>
            </div>
        </div>
    );
}