"use client";

import { useEffect, useState } from "react";
import Styles from "./BuyerAddressSelection.module.css";
 
export default function AddressSelector({
    addresses = [],
    selectedAddressId,
    onSelectAddress,
}) {
    const defaultAddressId =
        addresses.find((address) => address.is_default)?.address_id ??
        addresses[0]?.address_id ??
        null;

    const [internalSelectedAddressId, setInternalSelectedAddressId] =
        useState(selectedAddressId ?? defaultAddressId);

    const activeAddressId = selectedAddressId ?? internalSelectedAddressId;

    useEffect(() => {
        if (!selectedAddressId && defaultAddressId) {
            onSelectAddress?.(defaultAddressId);
        }
    }, [defaultAddressId, onSelectAddress, selectedAddressId]);

    function handleSelectAddress(addressId) {
        setInternalSelectedAddressId(addressId);
        onSelectAddress?.(addressId);
    }

    if (!addresses.length) {
        return (
            <div className={Styles.addressSection}>
                <h2 className={Styles.sectionTitle}>Shipping Address</h2>
                <p className={Styles.emptyMessage}>No shipping address found.</p>
            </div>
        );
    }

    return (
        <div className={Styles.addressSection}>
            <h2 className={Styles.sectionTitle}>Shipping Address</h2>
            <div className={Styles.addressGrid}>
                {addresses.map((address) => {
                    const isSelected = activeAddressId === address.address_id;
                    return (
                        <div 
                            key={address.address_id} 
                            onClick={() => handleSelectAddress(address.address_id)}
                            className={`${Styles.addressCard} ${isSelected ? Styles.selected : ""}`}
                        >
                            <div className={Styles.cardHeader}>
                                <span className={Styles.recipientName}>{address.recipient_name}</span>
                                <span className={Styles.recipientContact}>({address.recipient_contact_number})</span>
                                {address.is_default && <span className={Styles.defaultBadge}>Default</span>}
                            </div>
                            
                            <p className={Styles.addressLine}>{address.street}</p>
                            <p className={Styles.addressLine}>
                                {address.postcode} {address.city}, {address.state}
                            </p>
                            <p className={Styles.addressLine}>{address.country}</p>

                            <input 
                                type="radio" 
                                name="shipping_address"
                                value={address.address_id}
                                checked={isSelected}
                                onChange={() => handleSelectAddress(address.address_id)}
                                onClick={(event) => event.stopPropagation()}
                                className={Styles.radioInput}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}