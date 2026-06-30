'use client';

import { useState } from "react";
import Styles from "./AdminUserDetails.module.css";

export function UserInformation({ user, country }){

    const addresses = user?.addresses || user?.ADDRESSES_T || [];

    const [selectedAddressIdx, setSelectedAddressIdx] = useState(0);
    const activeAddress = addresses[selectedAddressIdx];

    const formatAddressString = (addr) => {
        if (!addr) return "-";
        return [addr.street, addr.city, addr.state, addr.postcode, addr.country]
            .filter(Boolean)
            .join(", ");
    };

    return(
    <>
        <div className={Styles.headerWrapper}>
            <h3 className={Styles.sectionTitle}>Personal Information</h3>
        </div>
        <div className={Styles.infoGrid}>
            <span className={Styles.label}>User Name</span>
            <span className={Styles.colon}>:</span>
            <div className={Styles.value}>{user?.username || "-"}</div>

            <span className={Styles.label}>Gender</span>
            <span className={Styles.colon}>:</span>
            <div className={Styles.value}>{user?.gender || "-"}</div>

            <span className={Styles.label}>Nationality</span>
            <span className={Styles.colon}>:</span>
            <div className={Styles.value}>{country}</div>

            <span className={Styles.label}>Email</span>
            <span className={Styles.colon}>:</span>
            <div className={Styles.value}>{user?.email || "-"}</div>

            <span className={Styles.label}>Contact Number</span>
            <span className={Styles.colon}>:</span>
            <div className={Styles.value}>{user?.contact_number || "-"}</div>

            <span className={Styles.label}>Registration Date</span>
            <span className={Styles.colon}>:</span>
            <div className={Styles.value}>{user?.created_at || "-"}</div>

            <span className={Styles.label}>Select Address</span>
                <span className={Styles.colon}>:</span>
                <div className={Styles.value}>
                    {addresses.length === 0 ? (
                        <span className={Styles.noAddress}>No addresses saved</span>
                    ) : (
                        <select 
                            className={Styles.addressDropdownSelector}
                            value={selectedAddressIdx}
                            onChange={(e) => setSelectedAddressIdx(Number(e.target.value))}
                        >
                            {addresses.map((addr, index) => (
                                <option key={addr.address_id || index} value={index}>
                                    {`Address ${index + 1}`} ({addr.city || "No City"})
                                </option>
                            ))}
                        </select>
                    )}
                </div>
                
            {activeAddress && (
                    <>
                        <span className={Styles.labelSub}>└ Recipient</span>
                        <span className={Styles.colon}>:</span>
                        <div className={Styles.valueSub}>{activeAddress.recipient_name || "-"}</div>

                        <span className={Styles.labelSub}>└ Recipient Contact</span>
                        <span className={Styles.colon}>:</span>
                        <div className={Styles.valueSub}>{activeAddress.recipient_contact_number || "-"}</div>

                        <span className={Styles.labelSub}>└ Full Address</span>
                        <span className={Styles.colon}>:</span>
                        <div className={Styles.valueSub}>{formatAddressString(activeAddress)}</div>
                    </>
                )}
        </div>
    </>    
    )
}

export function AdminInformation({ user, country }){

    const addresses = user?.addresses || user?.ADDRESSES_T || [];

    const [selectedAddressIdx, setSelectedAddressIdx] = useState(0);
    const activeAddress = addresses[selectedAddressIdx];

    const formatAddressString = (addr) => {
        if (!addr) return "-";
        return [addr.street, addr.city, addr.state, addr.postcode, addr.country]
            .filter(Boolean)
            .join(", ");
    };

    return(
    <>
        <div className={Styles.headerWrapper}>
            <h3 className={Styles.sectionTitle}>Personal Information</h3>
        </div>
        <div className={Styles.infoGrid}>
            <span className={Styles.label}>User Name</span>
            <span className={Styles.colon}>:</span>
            <div className={Styles.value}>{user?.username || "-"}</div>

            <span className={Styles.label}>Gender</span>
            <span className={Styles.colon}>:</span>
            <div className={Styles.value}>{user?.gender || "-"}</div>

            <span className={Styles.label}>Nationality</span>
            <span className={Styles.colon}>:</span>
            <div className={Styles.value}>{country}</div>

            <span className={Styles.label}>Email</span>
            <span className={Styles.colon}>:</span>
            <div className={Styles.value}>{user?.email || "-"}</div>

            <span className={Styles.label}>Contact Number</span>
            <span className={Styles.colon}>:</span>
            <div className={Styles.value}>{user?.contact_number || "-"}</div>

            <span className={Styles.label}>Registration Date</span>
            <span className={Styles.colon}>:</span>
            <div className={Styles.value}>{user?.created_at || "-"}</div>

        </div>
    </>    
    )
}

export function AccountActivityMonitoring({ user,OrderCount,TotalSpent,SellerItemsSold,GrossEarnings }){
    return(
        <>
        <div className={Styles.headerWrapper}>
            <h3 className={Styles.sectionTitle}>User Activity Monitoring</h3>
        </div>
        <div className={Styles.infoGrid}>
            {/* <PlaceholderIcon />
            <span className={Styles.label}>Last Login</span>
            <span className={Styles.colon}>:</span>
            <div className={Styles.value}>{}</div> */}
            {user?.role === 'Buyer' && (
                <>
                <span className={Styles.label}>Total Order History</span>
                <span className={Styles.colon}>:</span>
                <div className={Styles.value}>{OrderCount}</div>
               
                <span className={Styles.label}>Total Purchase Amount</span>
                <span className={Styles.colon}>:</span>
                <div className={Styles.value}>{TotalSpent ? TotalSpent.toFixed(2) : "-"}</div>
                </>
            )}
            {user?.role === 'Seller' &&(
                <>
                <span className={Styles.label}>Total Items Sold</span>
                <span className={Styles.colon}>:</span>
                <div className={Styles.value}>{SellerItemsSold}</div>

                <span className={Styles.label}>Gross Earnings</span>
                <span className={Styles.colon}>:</span>
                <div className={Styles.value}>{GrossEarnings}</div>
                </>
            )}
            <span className={Styles.label}>Current Balance</span>
            <span className={Styles.colon}>:</span>
            <div className={Styles.value}>{user?.balances != null ? Number(user.balances).toFixed(2) : "-"}</div>
        </div>
        </>
    )
}

export function AccountSecurityAnalysis({ user }){
    const hasSecurityQuestions1 = user?.security_questions1 !== null && user?.answer1 !== null;
    const hasSecurityQuestions2 = user?.security_questions2 !== null && user?.answer2 !== null;
    return(
        <>
        <div className={Styles.ASAContainer}>
            <div className={Styles.headerWrapper}>
                <h3 className={Styles.sectionTitle}>Account Security Analysis</h3>
            </div>
            <div className={Styles.infoGrid}>
                <div >{hasSecurityQuestions1 ? "✅" : "❌" }</div>
                <span className={Styles.label}>Security Question 1 Set</span>
                <div></div>
                <div >{hasSecurityQuestions2 ? "✅" : "❌" }</div>
                <span className={Styles.label}>Security Question 2 Set</span>  
                <div></div>
            </div>
        </div>
        </>
    )
}

export function SellerItemsSold( user ){

}