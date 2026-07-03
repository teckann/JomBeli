'use client';

import Styles from "./AMFNB.module.css";
import { useRouter,useSearchParams } from "next/navigation";

const TABS = [
    {key: "overview", label: "Overview"},
    {key: "transactionHistory", label: "Transaction History"},
];

export default function NavBar(){
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentTab = searchParams.get("tab") || "overview";

    const handleTabClick = (tabKey) =>{
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", tabKey);
        router.push(`?${params.toString()}`);
    };

    return (
        <div className={Styles.NavBar}>
            {TABS.map((tab) => (
                <button
                    key={tab.key}
                    className={`${Styles.tabButton} ${currentTab === tab.key ? Styles.activeTab : ""}`}
                    onClick = {() => handleTabClick(tab.key)}
                    >
                        {tab.label}
                    </button> 
            ))}
        </div>
    )
}