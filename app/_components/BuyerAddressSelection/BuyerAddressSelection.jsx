"use client";

import { useEffect, useState } from "react";
 
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
            <div className="address-section">
                <h2>Shipping Address</h2>
                <p>No shipping address found.</p>
            </div>
        );
    }

    return (
        <div>
            <h2>Shipping Address</h2>
            <div>
                {addresses.map((address) => {
                    return (
                        <div 
                            key={address.address_id} 
                            onClick={() => handleSelectAddress(address.address_id)}
                        >
                            <div>
                                <span>{address.recipient_name}</span>
                                <span>({address.recipient_contact_number})</span>
                                {address.is_default && <span>Default</span>}
                            </div>
                            
                            <p>{address.street}</p>
                            <p>
                                {address.postcode} {address.city}, {address.state}
                            </p>
                            <p>{address.country}</p>

                            <input 
                                type="radio" 
                                name="shipping_address"
                                value={address.address_id}
                                checked={activeAddressId === address.address_id}
                                onChange={() => handleSelectAddress(address.address_id)}
                                onClick={(event) => event.stopPropagation()}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
