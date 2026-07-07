'use client'

import Styles from "./AdminAddVouchers.module.css";
import { adminAddVoucher } from "@/app/_lib/actions";
import Modal from "../Modals/Modal";
import { useState } from 'react';

export function AdminAddVoucherForm(){
    const [error,setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const formData = new FormData(e.target);
        const saveData = {
            voucherName: formData.get("voucherName"),
            discountValue: formData.get("discountValue"),
            minimumSpend: formData.get("minimumSpend"),
            quantity: formData.get("quantity"),
            startDate: formData.get("startDate"),
            endDate: formData.get("endDate"),
        };

        const discount = Number(saveData.discountValue);
        const minSpend = Number(saveData.minimumSpend);
        if (minSpend < discount) {
            setError("Minimum spend cannot be less than the discount value.");
            return;
        }

        const startDate = new Date(saveData.startDate);
        const endDate = new Date(saveData.endDate);
        if (isNaN(startDate) || isNaN(endDate) || endDate <= startDate) {
            setError("End date must be later than the start date.");
            return;
        }

        setIsUploading(true);
        try {
            await adminAddVoucher(saveData);
            setIsModalOpen(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <>
            <button 
                className={Styles.openFormBtn}
                onClick={()=>setIsModalOpen(true)}
            >
                Add New Voucher
            </button>
                <Modal
                    onClose={()=>setIsModalOpen(false)}
                    isOpen={isModalOpen}
                    title="Add New Voucher">
                    
                    <form onSubmit={handleSubmit} >
                        {error && <p className={Styles.errorText}>{error}</p>}

                        <div className={Styles.formGroup}>
                            <label>Voucher Name</label>
                            <input type="text" name="voucherName" required placeholder="Delivery Voucher (Start with JOMBELI)" />
                        </div>

                        <div className={Styles.formGroup}>
                            <label>Discount Value (RM)</label>
                            <input type="number" name="discountValue" required placeholder="20" />
                        </div>

                        <div className={Styles.formGroup}>
                            <label>Minimum Spend (RM)</label>
                            <input type="number" name="minimumSpend" required placeholder="40 (Value must be bigger than discount value)" />
                        </div>

                        <div className={Styles.formGroup}>
                            <label>Quantity</label>
                            <input type="number" name="quantity" required placeholder="30" />
                        </div>

                        <div className={Styles.formGroup}>
                            <label>Starting from</label>
                            <input type="datetime-local" name="startDate" required placeholder="Must be earlier than end date!" />
                        </div>

                        <div className={Styles.formGroup}>
                            <label>Ending at</label>
                            <input type="datetime-local" name="endDate" required placeholder="Must be later than start date!" />
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
                                {isUploading ? "Adding..." : "Add Voucher"}
                            </button>
                        </div>
                    </form>
                </Modal>
        </>
    )
}