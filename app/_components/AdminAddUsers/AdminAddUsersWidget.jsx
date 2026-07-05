'use client'

import Styles from "./AdminAddUsers.module.css";
import { addCourier } from "@/app/_lib/actions";
import Modal from "../Modals/Modal";
import { useState } from 'react';

export function AdminAddCourierForm({ hubs }){
    const [error,setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    return (
        <>
            <button 
                className={Styles.openFormBtn}
                onClick={()=>setIsModalOpen(true)}
            >
                Add New Courier
            </button>
                <Modal
                    onClose={()=>setIsModalOpen(false)}
                    isOpen={isModalOpen}
                    title="Add New Courier">
                    
                    <form action={addCourier} className={Styles.formContainer}>
                        {error && <p className={Styles.errorText}>{error}</p>}

                        <div className={Styles.formGroup}>
                            <label>Full Name</label>
                            <input type="text" name="username" required placeholder="e.g. John Doe" />
                        </div>

                        <div className={Styles.formGroup}>
                            <label>Gender</label>
                            <input type="text" name="gender" required placeholder="e.g. Male/Female" />
                        </div>

                        <div className={Styles.formGroup}>
                            <label>Email Address</label>
                            <input type="email" name="email" required placeholder="e.g. john@courier.com" />
                        </div>

                        <div className={Styles.formGroup}>
                            <label>Contact Number</label>
                            <input type="text" name="contact_number" required placeholder="e.g. 0123456789" />
                        </div>

                        <div className={Styles.formGroup}>
                            <label>Assigned Hub</label>
                            <select name="hub_id" required defaultValue="">
                                <option value="" disabled>-- Select a hub --</option>
                                {hubs.map((hub) => (
                                    <option key={hub.hub_id} value={hub.hub_id}>
                                        {hub.hub_name}
                                    </option>
                                ))}
                            </select>
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
                                Create Courier
                            </button>
                        </div>
                    </form>
                </Modal>
        </>
    )
}