"use client";

import { useState } from "react";
import styles from "./ProfileSecurity.module.css";
import {
  updateUserPassword,
  updateUserSecurity,
} from "@/app/_lib/profile-actions";
import { usePathname } from "next/navigation";

function ProfileSecurity({ user }) {
  const [isActive, setIsActive] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [q1, setQ1] = useState(user.security_question1 || "");
  const [q2, setQ2] = useState(user.security_question2 || "");
  const [a1, setA1] = useState("");
  const [a2, setA2] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [securityError, setSecurityError] = useState("");

  const pathname = usePathname();

  const mask = "********";

  const questions = [
    "What is your secondary school name?",
    "What is the middle name of your mother?",
    "What is your favorite color?",
    "What is your first car brand?",
    "What is the city name were you born in?",
  ];

  const originalData = {
    q1: user.security_question1 || "",
    q2: user.security_question2 || "",
  };

  const handleUpdate = () => {
    setPassword("");
    setConfirmPassword("");
    setA1("");
    setA2("");
    setPasswordError("");
    setSecurityError("");
    setIsActive(true);
  };

  const handleCancel = () => {
    setPassword("");
    setConfirmPassword("");
    setQ1(originalData.q1);
    setQ2(originalData.q2);
    setA1("");
    setA2("");
    setPasswordError("");
    setSecurityError("");
    setIsActive(false);
  };

  const checkStrongPassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return false;
    }

    return true;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      return setPasswordError("Password fields cannot be empty");
    }

    if (password !== confirmPassword) {
      return setPasswordError("Passwords do not match");
    }

    if (!checkStrongPassword(password)) {
      return setPasswordError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
      );
    }

    setPasswordError("");

    const formData = new FormData(e.currentTarget);
    await updateUserPassword(formData);

    setPassword("");
    setConfirmPassword("");
    setIsActive(false);
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();

    if (!q1 || !q2 || !a1 || !a2) {
      setSecurityError("All security fields are required");
      return;
    }

    if (q1 === q2) {
      setSecurityError("Security questions must be different");
      return;
    }

    setSecurityError("");

    const formData = new FormData(e.currentTarget);
    await updateUserSecurity(formData);

    setA1("");
    setA2("");
    setIsActive(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Security Settings</h3>

        {isActive ? (
          <Button
            onClick={handleCancel}
            text="Cancel"
            icon="M18.3 5.71a1 1 0 00-1.41 0L12 10.59 7.11 5.7A1 1 0 105.7 7.11L10.59 12 5.7 16.89a1 1 0 101.41 1.41L12 13.41l4.89 4.89a1 1 0 001.41-1.41L13.41 12l4.89-4.89a1 1 0 000-1.4z"
          />
        ) : (
          <Button
            onClick={handleUpdate}
            text="Update"
            icon="M4 20h4l10.5-10.5a1.5 1.5 0 10-4-4L4 16v4z"
          />
        )}
      </div>

      <form onSubmit={handlePasswordSubmit} className={styles.form}>
        <input type="hidden" name="userId" value={user.user_id} />
        <input type="hidden" name="redirectPath" value={pathname} />

        <div className={styles.field}>
          <label>
            New Password{" "}
            {isActive && <span className={styles.required}>*</span>}
          </label>

          {!isActive ? (
            <p className={styles.readOnly}>{mask}</p>
          ) : (
            <>
              <input
                name="newPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="New password"
              />

              <input
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
                placeholder="Confirm new password"
              />
            </>
          )}
        </div>

        {passwordError && <p className={styles.error}>{passwordError}</p>}

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

            <p>Save New Password</p>
          </button>
        )}
      </form>

      <form
        onSubmit={handleSecuritySubmit}
        className={`${styles.form} ${styles.form2}`}
      >
        <input type="hidden" name="userId" value={user.user_id} />
        <input type="hidden" name="redirectPath" value={pathname} />

        <div className={styles.field}>
          <label>
            Security Question 1{" "}
            {isActive && <span className={styles.required}>*</span>}
          </label>

          {!isActive ? (
            <p className={styles.readOnly}>{q1 ? mask : "Set Now"}</p>
          ) : (
            <>
              <select
                name="q1"
                value={q1}
                onChange={(e) => setQ1(e.target.value)}
                className={styles.input}
              >
                {!q1 && <option value="">--- Please Select ---</option>}
                {questions.map((q) => (
                  <option key={q} value={q} disabled={q === q2}>
                    {q}
                  </option>
                ))}
              </select>

              <input
                name="a1"
                value={a1}
                onChange={(e) => setA1(e.target.value)}
                className={styles.input}
                placeholder="Answer 1"
              />
            </>
          )}
        </div>

        <div className={styles.field}>
          <label>
            Security Question 2{" "}
            {isActive && <span className={styles.required}>*</span>}
          </label>

          {!isActive ? (
            <p className={styles.readOnly}>{q2 ? mask : "Set Now"}</p>
          ) : (
            <>
              <select
                name="q2"
                type="text"
                value={q2}
                onChange={(e) => setQ2(e.target.value)}
                className={styles.input}
              >
                {!q2 && <option value="">--- Please Select ---</option>}
                {questions.map((q) => (
                  <option key={q} value={q} disabled={q === q1}>
                    {q}
                  </option>
                ))}
              </select>

              <input
                name="a2"
                type="text"
                value={a2}
                onChange={(e) => setA2(e.target.value)}
                className={styles.input}
                placeholder="Answer 2"
              />
            </>
          )}
        </div>

        {securityError && <p className={styles.error}>{securityError}</p>}

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

            <p>Save Security Questions</p>
          </button>
        )}
      </form>
    </div>
  );
}

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

export default ProfileSecurity;
