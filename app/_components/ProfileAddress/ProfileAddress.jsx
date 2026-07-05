"use client";

import { useState } from "react";
import styles from "./ProfileAddress.module.css";
import {
  createAddress,
  makeDefault,
  removeAddress,
} from "@/app/_lib/profile-actions";
import { usePathname } from "next/navigation";

function ProfileAddress({ user, addresses }) {
  const { user_id: userId } = user;
  const [isActive, setIsActive] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postcode, setPostcode] = useState("");
  const pathname = usePathname();

  const [contactError, setContactError] = useState(false);
  const [postcodeError, setPostcodeError] = useState(false);
  const [emptyError, setEmptyError] = useState(false);
  const [invalidAddressError, setInvalidAddressError] = useState(false);

  const clearData = () => {
    setName("");
    setContact("");
    setStreet("");
    setCity("");
    setState("");
    setPostcode("");

    setContactError(false);
    setPostcodeError(false);
    setEmptyError(false);
    setInvalidAddressError(false);
  };

  const handleCancel = () => {
    clearData();
    setIsActive(false);
  };

  const handleUpdate = () => {
    clearData();
    setIsActive(true);
  };

  const handleDefault = async (addressId) => {
    await makeDefault(userId, addressId, pathname);
  };

  const handleRemove = async (addressId) => {
    await removeAddress(userId, addressId, pathname);
  };

  const contactNumberValidation = (phone) => {
    // skip empty
    if (!phone) return true;

    const input = phone.trim();

    const regex = /^\d{10,11}$/;
    return regex.test(input);
  };

  const postcodeValidation = (postcode) => {
    // skip empty
    if (!postcode) return true;

    const input = postcode.trim();

    const regex = /^\d{5}$/;

    return regex.test(input);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setContactError(false);
    setPostcodeError(false);
    setEmptyError(false);
    setInvalidAddressError(false);

    if (!name || !contact || !street || !city || !state || !postcode) {
      return setEmptyError(true);
    }

    if (!contactNumberValidation(contact)) {
      setContactError(true);
    }

    if (!postcodeValidation(postcode)) {
      setPostcodeError(true);
    }

    if (!contactError && !emptyError && !postcodeError) {
      const formData = new FormData(e.currentTarget);

      const res = await createAddress(formData);

      if (res === "failed") {
        return setInvalidAddressError(true);
      }

      setIsActive(false);
    }
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
        <form onSubmit={handleSubmit} className={styles.form}>
          <input type="hidden" name="userId" value={user.user_id} />
          <input type="hidden" name="redirectPath" value={pathname} />

          <Input
            label="Recipient Name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Recipient Contact Number"
            name="contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            error={contactError && "Invalid Contact Number"}
          />

          <Input
            label="Street"
            name="street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />

          <Input
            label="City"
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <Input
            label="Postcode"
            name="postcode"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            error={postcodeError && "Invalid Postcode"}
          />

          <MalaysiaStateSelect
            value={state}
            onChange={(e) => setState(e.target.value)}
          />

          <div className={styles.field}>
            <label>Country</label>
            <input value="Malaysia" disabled={true} className={styles.input} />
          </div>

          {emptyError && (
            <p className={styles.error}>All fields are required</p>
          )}

          {invalidAddressError && (
            <p className={styles.error}>
              Address not found. This is an invalid address.
            </p>
          )}

          <button type="submit" className={styles.saveButton}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className={styles.icon}
            >
              <path d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4zM7 5h8v4H7V5zm0 14v-6h10v6H7z" />
            </svg>

            <p>Save Changes</p>
          </button>
        </form>
      ) : (
        <AddressList
          addresses={addresses}
          handleDefault={handleDefault}
          handleRemove={handleRemove}
        />
      )}
    </div>
  );
}

const Input = ({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
}) => {
  return (
    <div className={styles.field}>
      <label>
        {label} <span className={styles.required}>*</span>
      </label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        className={styles.input}
        placeholder={placeholder}
        type={type}
      />

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

const MalaysiaStateSelect = ({ value, onChange }) => {
  const states = [
    "Johor",
    "Kedah",
    "Kelantan",
    "Melaka",
    "Negeri Sembilan",
    "Pahang",
    "Perak",
    "Perlis",
    "Pulau Pinang",
    "Sabah",
    "Sarawak",
    "Selangor",
    "Terengganu",
    "Kuala Lumpur",
    "Labuan",
    "Putrajaya",
  ];

  return (
    <div className={styles.field}>
      <label>
        State <span className={styles.required}>*</span>
      </label>

      <select
        name="state"
        value={value}
        onChange={onChange}
        className={styles.input}
      >
        <option value="">--- Select State ---</option>

        {states.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>
    </div>
  );
};

const AddressList = ({ addresses, handleDefault, handleRemove }) => {
  return addresses.length === 0 ? (
    <div className={styles.noAddressContainer}>
      <h3>No Addresses Found</h3>
      <p>You don&apos;t have any saved addresses yet</p>
    </div>
  ) : (
    <div className={styles.addressList}>
      {addresses.map((item) => (
        <AddressCard
          key={item.address_id}
          address={item}
          handleDefault={handleDefault}
          handleRemove={handleRemove}
        />
      ))}
    </div>
  );
};

const AddressCard = ({ address, handleDefault, handleRemove }) => {
  const {
    address_id,
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
        <input
          type="radio"
          value={address_id}
          checked={is_default}
          onChange={() => handleDefault(address_id)}
          onClick={(e) => e.stopPropagation()}
          className={styles.radioInput}
        />

        {!is_default && (
          <button
            onClick={() => handleRemove(address_id)}
            className={`${styles.hiddenButton} ${styles.removeButton}`}
          >
            <Icon
              icon="M9 3a1 1 0 00-1 1v1H5a1 1 0 100 2h1l1 13a2 2 0 002 2h6a2 2 0 002-2l1-13h1a1 1 0 100-2h-3V4a1 1 0 00-1-1H9zm1 2h4v1h-4V5zm-1 4a1 1 0 012 0v8a1 1 0 11-2 0V9zm5-1a1 1 0 10-2 0v8a1 1 0 102 0V8z"
              iconStyle="deleteIcon"
            />
          </button>
        )}
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

const Icon = ({ icon, iconStyle }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      className={styles[iconStyle]}
    >
      <path d={icon} />
    </svg>
  );
};

export default ProfileAddress;
