"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Styles from "./OrderFilter.module.css";

export default function OrderFilter() {
    const searchParams = useSearchParams();
    
    const currentStatus = searchParams.get("status") || "all";

    const tabs = [
        { label: "All", value: "all" },
        { label: "To Ship", value: "Ordered" },
        { label: "Shipped", value: "Shipped" },
        { label: "Out For Delivery", value: "OutForDelivery" },
        { label: "Completed", value: "Completed" }
    ];

    return (
        <div className={Styles.filterTabsContainer}>
            {tabs.map((tab) => {
                const isActive = currentStatus === tab.value;
                
                const href = tab.value === "all" ? "?" : `?status=${tab.value}`;

                return (
                    <Link
                        key={tab.value}
                        href={href}
                        className={`${Styles.tabLink} ${isActive ? Styles.activeTab : ""}`}
                    >
                        {tab.label}
                    </Link>
                );
            })}
        </div>
    );
}