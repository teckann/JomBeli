"use client"

import { createRefundAction } from "@/app/_lib/actions";
import Styles from "./RefundForm.module.css";

export default function RefundForm({ orderID }) {
  return (
    <div className={Styles.formWrapper}>
      <h2 className={Styles.formTitle}>Request a Refund Order: #{orderID}</h2>
      
      <form action={createRefundAction} className={Styles.formContainer}>
        <input type="hidden" name="order_id" value={orderID} />
        <input type="hidden" name="seller_status" value="Pending" />
        <input type="hidden" name="admin_status" value="Pending" />

        <div className={Styles.formGroup}>
          <label htmlFor="refund_subject" className={Styles.label}>
            Reason for Refund / Subject
          </label>
          <input
            type="text"
            id="refund_subject"
            name="refund_subject"
            placeholder="e.g., Damaged item, Wrong size"
            required
            className={Styles.inputField}
          />
        </div>

        <div className={Styles.formGroup}>
          <label htmlFor="refund_description" className={Styles.label}>
            Detailed Description
          </label>
          <textarea
            id="refund_description"
            name="refund_description"
            rows={6}
            placeholder="Please provide more details about why you are requesting a refund..."
            required
            className={Styles.textareaField}
          />
        </div>

        <div className={Styles.formGroup}>
          <label htmlFor="evidences" className={Styles.label}>
            Upload Evidence (Images)
          </label>
          <input
            type="file"
            id="evidences"
            name="evidences"
            multiple
            accept="image/*"
            className={Styles.fileInput}
          />
        </div>

        <div className={Styles.buttonGroup}>
          <button 
            type="button" 
            className={Styles.cancelButton} 
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
          <button type="submit" className={Styles.submitButton}>
            Submit Refund Request
          </button>
        </div>
      </form>
    </div>
  );
}