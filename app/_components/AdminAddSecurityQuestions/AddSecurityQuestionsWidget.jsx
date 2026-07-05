'use client'

import Styles from "./AddSecurityQuestionsWidget.module.css";
import { setSecurityQuestions } from "@/app/_lib/actions";
import Modal from "../Modals/Modal";
import { useState } from 'react';

const SECURITY_QUESTIONS = [
    "What is your secondary school name?",
    "What is the middle name of your mother?",
    "What is your favorite color?",
    "What is your first car brand?",
    "What is the city name were you born in?",
]

export function AdminAddSecurityQuestionsForm({ userId }){
    const [error,setError] = useState("");
    const [message, setMessage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const boundAction = setSecurityQuestions.bind(null, userId);

    const handleSubmit = async (formData) => {
        setError("");
        setMessage("");
        const result = await boundAction(formData);
        if (result.success) {
            setMessage("Security questions saved successfully.");
        } else {
            setError(result.error);
        }
    };

    return (
        <>
            <button
                className={Styles.openFormBtn}
                onClick={() => setIsModalOpen(true)}
            >
                Set Security Questions
            </button>
            <Modal
                onClose={() => setIsModalOpen(false)}
                isOpen={isModalOpen}
                title="Set Security Questions">

                <form action={handleSubmit} className={Styles.formContainer}>
                    {error && <p className={Styles.errorText}>{error}</p>}
                    {message && <p className={Styles.successText}>{message}</p>}

                    <div className={Styles.formGroup}>
                        <label>Security Question 1</label>
                        <select name="security_question_1" required defaultValue="">
                            <option value="" disabled>-- Select a question --</option>
                            {SECURITY_QUESTIONS.map((q) => (
                                <option key={q} value={q}>{q}</option>
                            ))}
                        </select>
                    </div>
                    <div className={Styles.formGroup}>
                        <label>Answer 1</label>
                        <input type="text" name="security_answer_1" required placeholder="Answer" />
                    </div>

                    <div className={Styles.formGroup}>
                        <label>Security Question 2</label>
                        <select name="security_question_2" required defaultValue="">
                            <option value="" disabled>-- Select a question --</option>
                            {SECURITY_QUESTIONS.map((q) => (
                                <option key={q} value={q}>{q}</option>
                            ))}
                        </select>
                    </div>
                    <div className={Styles.formGroup}>
                        <label>Answer 2</label>
                        <input type="text" name="security_answer_2" required placeholder="Answer" />
                    </div>

                    <div className={Styles.formActions}>
                        <button
                            type="button"
                            className={Styles.cancelBtn}
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button type="submit" className={Styles.submitBtn}>
                            Save
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    )
}