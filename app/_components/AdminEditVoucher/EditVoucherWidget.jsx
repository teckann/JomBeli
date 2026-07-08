'use client';

import Styles from './EditVoucherWidget.module.css';
import { useState } from 'react';
import Modal from '../Modals/Modal';
import { adminUpdateVoucher } from '@/app/_lib/actions';
import { useRouter } from 'next/navigation';

export default function EditVoucherWidget( {voucher} ){

    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const SaveVoucher = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setIsUploading(true);

        try{
            const formData = new FormData(e.target);

            const saveData = {
                voucherName: formData.get("voucherName"),
                discountValue: formData.get("discountValue"),
                minimumSpend: formData.get("minSpend"),
                quantity: formData.get("quantity"),
                startDate: formData.get("startDate"),
                endDate: formData.get("endDate")
            };

            const minSpend = Number(saveData.minimumSpend);
            const discountValue = Number(saveData.discountValue);

            if (minSpend < discountValue ){
                setErrorMessage("Minimum spend for the voucher must be higher than discount value!!!");
                return;
            }

            const endDate = new Date(saveData.endDate);
            const startDate = new Date(saveData.startDate);

            if (endDate <= startDate){
                setErrorMessage("Please ensure that the end date is later than start date");
                return;
            }
            await adminUpdateVoucher(voucher.voucher_id,saveData);

            setIsOpen(false);
            router.refresh();
        } catch (error){
            setErrorMessage(error.message);
        } finally {
            setIsUploading(false);
        }

    }

    return(
        <>
            <button className={Styles.editButton} onClick={() => setIsOpen(true)}>
                Edit Voucher Information
            </button>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Edit Voucher">
                <form onSubmit={SaveVoucher}>
                    <div className={Styles.modalBody}>
                        <div className={Styles.formFields}>
                            <div className={Styles.fieldGroup}>
                                <label className={Styles.label}>Voucher Name:</label>
                                <input className={Styles.textBox} type="text" name="voucherName" required defaultValue={voucher.voucher_name}/>
                            </div>
                            <div className={Styles.fieldGroup}>
                                <label className={Styles.label}>Discount Value: (RM)</label>
                                <input className={Styles.textBox} type="number" name="discountValue" required defaultValue={voucher.discount_value}/>
                            </div>
                            <div className={Styles.fieldGroup}>
                                <label className={Styles.label}>Minimum Spend:</label>
                                <input className={Styles.textBox} type="number" name="minSpend" required defaultValue={voucher.min_spend}/>
                            </div>
                            <div className={Styles.fieldGroup}>
                                <label className={Styles.label}>Quantity:</label>
                                <input className={Styles.textBox} type="number" name="quantity" required defaultValue={voucher.quantity}/>
                            </div>
                            <div className={Styles.fieldGroup}>
                                <label className={Styles.label}>Start Date:</label>
                                <input className={Styles.inputBar} type="datetime-local" name="startDate" required defaultValue={voucher.raw_start_date ? voucher.raw_start_date.slice(0, 16) : ""}/>
                            </div>
                            <div className={Styles.fieldGroup}>
                                <label className={Styles.label}>End Date:</label>
                                <input className={Styles.inputBar} type="datetime-local" name="endDate" required defaultValue={voucher.raw_end_date ? voucher.raw_end_date.slice(0, 16) : ""}/>
                            </div>
                        </div>
                    </div>
                    {errorMessage && (
                        <div className={Styles.errorText}>
                            {errorMessage}
                        </div>
                    )}
                    <div className={Styles.buttonGroup}>
                        <button type="submit" className={Styles.saveButton}>
                            {isUploading ? "Saving" : "Update"}
                        </button>
                        <button type="button" className={Styles.cancelButton} onClick={() => setIsOpen(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    )
}