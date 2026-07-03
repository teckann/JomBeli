"use client";

import { useState } from "react";
import styles from "./ProfileInfo.module.css";
import { updateUserProfile } from "@/app/_lib/profile-actions";
import { usePathname } from "next/navigation";

function ProfileInfo({ user }) {
  const [isActive, setIsActive] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [gender, setGender] = useState(user.gender || "");
  const [contactNumber, setContactNumber] = useState(user.contact_number || "");
  const pathname = usePathname();

  const [error, setError] = useState(false);

  const originalData = {
    username: user.username,
    gender: user.gender || "",
    contactNumber: user.contact_number || "",
  };

  const handleUpdate = () => {
    setIsActive((prev) => !prev);
  };

  const handleCancel = () => {
    setUsername(originalData.username);
    setGender(originalData.gender);
    setContactNumber(originalData.contactNumber);

    setError(false);
    setIsActive(false);
  };

  const contactNumberValidation = (phone) => {
    // allow empty
    if (!phone) return true;

    const input = phone.trim();

    const regex = /^\d{10,11}$/;
    return regex.test(input);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!contactNumberValidation(contactNumber)) {
      return setError(true);
    }

    setError(false);

    const formData = new FormData(e.currentTarget);
    await updateUserProfile(formData);

    setIsActive(false);
  };

  return (
    <div className={styles.profileInfoContainer}>
      <div className={styles.profileTitle}>
        <h3>Profile Details</h3>

        {isActive ? (
          <Button
            handleOnClick={handleCancel}
            icon="M18.3 5.71a1 1 0 00-1.41 0L12 10.59 7.11 5.7A1 1 0 105.7 7.11L10.59 12 5.7 16.89a1 1 0 101.41 1.41L12 13.41l4.89 4.89a1 1 0 001.41-1.41L13.41 12l4.89-4.89a1 1 0 000-1.4z"
            text="Cancel"
          />
        ) : (
          <Button
            handleOnClick={handleUpdate}
            icon="M4 20h4l10.5-10.5a1.5 1.5 0 10-4-4L4 16v4z"
            text="Update"
          />
        )}
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="hidden" name="userId" value={user.user_id} />
        <input type="hidden" name="redirectPath" value={pathname} />

        <div className={styles.field}>
          <label>Username</label>
          <input
            name="username"
            value={username}
            disabled={!isActive}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label>Email</label>
          <input value={user.email} disabled className={styles.inputLocked} />
        </div>

        <div className={styles.field}>
          <label>Gender</label>

          <div className={styles.radioGroup}>
            <label className={styles.radioItem}>
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={gender === "Male"}
                disabled={!isActive}
                onChange={(e) => setGender(e.target.value)}
              />
              Male
            </label>

            <label className={styles.radioItem}>
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={gender === "Female"}
                disabled={!isActive}
                onChange={(e) => setGender(e.target.value)}
              />
              Female
            </label>
          </div>
        </div>

        <div className={styles.field}>
          <label>Contact Number</label>
          <input
            name="contact_number"
            value={contactNumber}
            disabled={!isActive}
            onChange={(e) => setContactNumber(e.target.value)}
            className={styles.input}
          />
          {error && <p className={styles.error}>Invalid Contact Number</p>}
        </div>

        {isActive && (
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
        )}
      </form>
    </div>
  );
}

const Button = ({ handleOnClick, icon, text }) => {
  return (
    <button
      type="button"
      className={styles.updateProfileButton}
      onClick={handleOnClick}
    >
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

export default ProfileInfo;
