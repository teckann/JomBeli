"use client";

import { useState } from "react";
import styles from "./ProfileAddress.module.css";
import ProfileAddressFrom from "../ProfileAddressFrom/ProfileAddressFrom";

function ProfileAddress({ user, addresses }) {
  const [isActive, setIsActive] = useState(false);

  const handleCancel = () => {
    setIsActive(false);
  };

  const handleUpdate = () => {
    setIsActive(true);
  };

  return (
    <div className={styles.profileAddressContainer}>
      <div className={styles.header}>
        <h3>My Addresses</h3>

        {isActive ? (
          <Button
            onClick={handleCancel}
            text="Cancel"
            icon="M18.3 5.71a1 1 0 00-1.41 0L12 10.59 7.11 5.7A1 1 0 105.7 7.11L10.59 12 5.7 16.89a1 1 0 101.41 1.41L12 13.41l4.89 4.89a1 1 0 001.41-1.41L13.41 12l4.89-4.89a1 1 0 000-1.4z"
          />
        ) : (
          <Button
            onClick={handleUpdate}
            text="Add"
            icon="M19 11H13V5a1 1 0 10-2 0v6H5a1 1 0 100 2h6v6a1 1 0 102 0v-6h6a1 1 0 100-2z"
          />
        )}
      </div>

      {isActive ? (
        <ProfileAddressFrom />
      ) : (
        <AddressList addresses={addresses} />
      )}
    </div>
  );
}

const AddressList = ({ addresses }) => {
  return (
    <div className={styles.addressList}>
      {addresses.map((item) => (
        <AddressCard key={item.address_id} address={item} />
      ))}
    </div>
  );
};

const AddressCard = ({ address }) => {
  const {
    recipient_name,
    recipient_contact_number,
    street,
    city,
    state,
    postcode,
    country,
    is_default,
  } = address;

  return (
    <div className={styles.addressCard}>
      <div className={styles.div1}>
        <div className={styles.addressCardHeader}>
          <div className={styles.recipientDetails}>
            <p className={styles.recipientName}>{recipient_name}</p>
            <p className={styles.contactNumber}>({recipient_contact_number})</p>
          </div>

          {is_default && (
            <div className={styles.default}>
              <i>Default</i>
            </div>
          )}
        </div>

        <div className={styles.addressDetails}>
          <p>{street}</p>
          <p>
            {postcode} {city}
          </p>
          <p>
            {state} {country}
          </p>
        </div>
      </div>

      <div className={styles.div2}>
        <button>Default</button>
        <button>Delete</button>
      </div>
    </div>
  );
};

const Button = ({ onClick, text, icon }) => {
  return (
    <button type="button" className={styles.updateButton} onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
        className={styles.icon}
      >
        <path d={icon} />
      </svg>

      <p>{text}</p>
    </button>
  );
};

export default ProfileAddress;
