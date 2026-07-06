"use client";

import Styles from "./Modal.module.css";

export default function Modal({ isOpen, onClose, title, children }){
    if (!isOpen) return null;

    return(
        <div className={Styles.modalOverlay}>
            <div className={Styles.modalContent}>
                <div className={Styles.modalHeader}>
                    {title}
                    <button className={Styles.closeButton} onClick={onClose}>
                         &times; 
                    </button>
                </div>
                <div className={Styles.modalBody}>
                    {children}
                </div>
            </div>
        </div>
    )
}