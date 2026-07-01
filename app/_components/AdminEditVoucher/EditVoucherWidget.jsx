'use client';

import Styles from './EditVoucherWidget.module.css';
import { useState,useRef } from 'react';
import Modal from '../Modals/Modal';

export default function EditVoucherWidget( voucher ){

    const [isOpen, setIsOpen] = useState(false);

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
                                <label className={Styles.label}>Username:</label>
                                <input className={Styles.textBox} type="text" name="username" defaultValue={userInfo.username}/>
                            </div>
                            <div className={Styles.fieldGroup}>
                                <label className={Styles.label}>Gender:</label>
                                <input className={Styles.textBox} type="text" name="gender" defaultValue={userInfo.gender}/>
                            </div>
                            <div className={Styles.fieldGroup}>
                                <label className={Styles.label}>Email:</label>
                                <input className={Styles.textBox} type="text" name="email"defaultValue={userInfo.email}/>
                            </div>
                            <div className={Styles.fieldGroup}>
                                <label className={Styles.label}>Contact Number:</label>
                                <input className={Styles.textBox} type="text" name="contact_number" defaultValue={userInfo.contact_number}/>
                            </div>
                        </div>
                    </div>
                    <div className={Styles.buttonGroup}>
                        <button type="submit" className={Styles.saveButton}>
                            {isUploading ? "Saving" : "Save changes"}
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