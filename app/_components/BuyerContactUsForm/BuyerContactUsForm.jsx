import Styles from "./BuyerContactUsForm.module.css";
import { BuyerContactForm } from "@/app/_lib/actions";

export default function BuyerContactUsForm({userId}){
    return(
        <div className={Styles.formContainer}>
            <h1>Contact Us</h1>
            <form className={Styles.form} action={BuyerContactForm}>
                <input type="hidden" name="id" value={userId} />

                <label htmlFor="category">Report Type</label>
                <select name="category" id="category" defaultValue="" required>
                    <option value="" disabled>Select an option...</option>
                    <option value="TechnicalSupport">Technical Support</option>
                    <option value="GeneralInquiry">General Inquiry</option>
                    <option value="Feedback&Suggestion">Feedback & Suggestion</option>
                </select>

                <label htmlFor="description">Description</label>
                <textarea name="description" id="description" rows="5" required></textarea>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}