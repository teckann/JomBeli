import Styles from "./BuyerContactUsForm.module.css";
import { BuyerContactForm } from "@/app/_lib/actions";

export default function BuyerContactUsForm({ userId }) {
  return (
    <div className={Styles.formContainer}>
      <header className={Styles.formHeader}>
        <h1>Contact Us</h1>
        <p>
          Have a question, an idea, or just want to say hi? We’d love to hear
          from you. Drop us a message below and our team will get back to you as
          soon as possible.
        </p>
      </header>

      <form className={Styles.form} action={BuyerContactForm}>
        <input type="hidden" name="id" value={userId} />

        <div className={Styles.formGroup}>
          <label htmlFor="category">Report Type</label>
          <select name="category" id="category" defaultValue="" required>
            <option value="" disabled>Select an option...</option>
            <option value="TechnicalSupport">Technical Support</option>
            <option value="GeneralInquiry">General Inquiry</option>
            <option value="Feedback&Suggestion">Feedback & Suggestion</option>
          </select>
        </div>

        <div className={Styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            id="description"
            rows="5"
            placeholder="Tell us more details..."
            required
          ></textarea>
        </div>

        <button type="submit" className={Styles.submitButton}>
          Submit Message
        </button>
      </form>
    </div>
  );
}