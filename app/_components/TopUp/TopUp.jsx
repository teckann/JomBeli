"use client";

import { useRef, useState } from "react";
import styles from "./TopUp.module.css";
import { topUpAction } from "@/app/_lib/actions";
import Image from "next/image";
import SpinnerMini from "../SpinnerMini/SpinnerMini";

const options = [50, 100, 150, 200];
const payments = [
  { payment: "Online Banking - Maybank2u", logo: "/maybank2u-logo.png" },
  { payment: "Online Banking - CIMB Clicks", logo: "/cimb-logo.png" },
  { payment: "Online Banking - Public Bank", logo: "/public-logo.png" },
  { payment: "Online Banking - UOB", logo: "/uob-logo.png" },
  {
    payment: "Online Banking - Hong Leong Bank",
    logo: "/hongleong-logo.png",
  },
  { payment: "DuitNow Transfer", logo: "/duitnow-logo.png" },
];

function TopUp({ userID }) {
  const [amount, setAmount] = useState("");
  const [display, setDisplay] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [isValid, setIsisValid] = useState(false);
  const [paymentIconPath, setPaymentIconPath] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [isSelectPaymentOption, setIsSelectPaymentOption] = useState(true);
  const [isEnterAmount, setIsEnterAmount] = useState(true);

  const formRef = useRef(null);

  const formatCurrency = (num) => {
    if (String(num).includes(".")) return num;
    return `${num}.00`;
  };

  const handleChange = (e) => {
    const value = e.target.value;
    const onlyNumRegex = /^\d*$/;

    if (!onlyNumRegex.test(value)) return;

    // remove the 0 in front
    const cleaned = value.replace(/^0+(?=\d)/, "");

    setIsEnterAmount(true);
    setAmount(cleaned);
    setDisplay(cleaned);
  };

  const handleFocus = () => {
    setIsFocus(true);
    setDisplay(amount);
  };

  const handleBlur = () => {
    setIsFocus(false);
    const num = Number(amount);

    // isValidation（>= 10）
    const isisValid = num >= 10;
    setIsisValid(isisValid);

    // format
    if (amount !== "") {
      setDisplay(formatCurrency(amount));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleSelectOption = (e) => {
    const num = e.target.value;

    setAmount(num);
    setDisplay(formatCurrency(num));
    setIsisValid(true);
  };

  const handleBankChange = (e) => {
    const value = e.target.value;

    const item = payments.find((p) => p.payment === value);

    setSelectedPayment(value);
    setPaymentIconPath(item.logo);
    setIsSelectPaymentOption(true);
  };

  const handleSubmit = async () => {
    if (!amount || Number(amount) < 10 || !selectedPayment) {
      if (!selectedPayment) setIsSelectPaymentOption(false);
      if (!amount) setIsEnterAmount(false);
      return;
    }

    const formData = new FormData(formRef.current);

    await topUpAction(formData);
    setAmount(0);
    setDisplay(0);
  };

  const warning = !isValid && amount !== "";

  return (
    <div className={styles.topUpContainer}>
      <p className={styles.title}>Input Top Up Amount</p>

      {/* handle action in submit button - manually */}
      <form ref={formRef} onKeyDown={handleKeyDown} className={styles.form}>
        <input name="userID" id="userID" value={userID} type="hidden" />
        <div className={styles.inputContainer}>
          <div
            className={`${styles.inputField} ${warning ? styles.warning : ""}`}
          >
            <p>RM</p>
            <input
              type="text"
              inputMode="numeric"
              name="amount"
              id="amount"
              value={display}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="0"
            />
          </div>

          {warning && <p className={styles.error}>Minimum amount is RM10</p>}
          {!isEnterAmount && (
            <p className={styles.error}>Please enter amount</p>
          )}

          <div className={styles.optionContainer}>
            {options.map((option) => (
              <button
                key={option}
                type="button"
                className={styles.option}
                value={option}
                onClick={handleSelectOption}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className={styles.paymenSelectField}>
            <div className={styles.paymentLogo}>
              {paymentIconPath ? (
                <PaymentLogo path={paymentIconPath} />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  width="34"
                  height="34"
                  className={styles.defaultIcon}
                >
                  <path d="M2 5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2H2V5zm0 4h20v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9zm4 5h6v2H6v-2z" />
                </svg>
              )}
            </div>

            <select
              name="payment"
              id="payment"
              className={styles.select}
              value={selectedPayment}
              onChange={handleBankChange}
            >
              <option value="" disabled>
                Please select payment method
              </option>

              {payments.map((item, index) => (
                <option key={index} value={item.payment}>
                  {item.payment}
                </option>
              ))}
            </select>
          </div>
          {!isSelectPaymentOption && (
            <p className={styles.error}>Select a payment method</p>
          )}
        </div>

        <div className={styles.conclude}>
          <div className={styles.totalContainer}>
            <p className={styles.totalTitle}>Total</p>
            <p className={styles.totalAmount}>RM {display || 0}</p>
          </div>

          <SubmitButton handleSubmit={handleSubmit} />
        </div>
      </form>
    </div>
  );
}

const PaymentLogo = ({ path }) => {
  return (
    <div className={styles.imageContainer}>
      <Image src={path} alt="Logo" fill sizes="40px" className={styles.image} />
    </div>
  );
};

const SubmitButton = ({ handleSubmit }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await handleSubmit();
    setLoading(false);
  };

  return (
    <button
      type="button"
      className={styles.submitButton}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? <SpinnerMini /> : "Top Up"}
    </button>
  );
};

export default TopUp;
