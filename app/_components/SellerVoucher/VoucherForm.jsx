'use client'

import React, { useState } from 'react'
import styles from './VoucherForm.module.css';

import { createNewVoucher } from "@/app/_lib/voucher-actions";


const VoucherForm = ( {id} ) => {


    const [hasExpiry, setHasExpiry] = useState(false);
    const [discount, setDiscount] = useState('');
    const [minSpend, setMinSpend] = useState('');

    const isMathError = discount !== '' && minSpend !== '' && Number(minSpend) <= Number(discount);

  return (
    <form className={styles.form} action={createNewVoucher}>

        <input type="hidden" name="user_id" value={id} />

            <div className={styles.formRow}>

                <h3 className={styles.rowTitle}>Voucher Details</h3>

                <div className={styles.inputGrid}>

                    <div className={styles.inputGroup}>
                        <label>Voucher Name :</label>
                        <input autoComplete='false' className={styles.input} type="text" name="voucher_name" placeholder="e.g. 11.11 " required />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Discount Value :</label>
                        <input autoComplete='false' className={styles.input} type="number" name="discount_value" placeholder="e.g. 6" required
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)} />
                    </div>


                </div>
            </div>

            <div className={styles.formRow}>

                <h3 className={styles.rowTitle}>Terms & Condition</h3>

                <div className={styles.inputGrid}>

                    <div>
                        <div className={styles.inputGroup}>
                            <label>Min Spend (RM) :</label>
                            <input autoComplete='false' className={styles.input} type="number" name="min_spend" placeholder="e.g. 60" 
                                required 
                                value={minSpend}
                                onChange={(e) => setMinSpend(e.target.value)}/>
                        </div>

                        {isMathError && (
                            <p className={styles.errorText}>
                                Min spend must be higher than the discount value
                            </p>
                        )}
                    
                    </div>
                        

                    <div className={styles.inputGroup}>
                        <label>Use Limit :</label>
                        <input autoComplete='false' className={styles.input} type="number" name="quantity" placeholder="Max redemptions" required />
                    </div>


                </div>
            </div>

            <div className={styles.formRow}>

              <h3 className={styles.rowTitle}>Voucher Duration</h3>
              
              <div className={styles.checkboxCon}>

                <input className={styles.checkbox}

                    type="checkbox" 
                    id="addExpiry" 
                    checked={hasExpiry}
                    onChange={(e) => setHasExpiry(e.target.checked)} 
                />
                <label htmlFor="addExpiry">Add Expiry</label>
              </div>

              <div className={styles.dateInput}>

                <div className={styles.inputGroupRow}>

                  <label className={!hasExpiry ? styles.disable : ''}>Start :</label>
                  <input className={!hasExpiry ? styles.disable : styles.input} 
                        type="datetime-local" 
                        name="start_date"
                        disabled={!hasExpiry}
                        required={hasExpiry}
                  />
                </div>
                <div className={styles.inputGroupRow}>

                  <label className={!hasExpiry ? styles.disable : ''}>End :</label>
                  <input 
                        type="datetime-local" 
                        name="end_date" 
                        disabled={!hasExpiry}
                        className={!hasExpiry ? styles.disable : styles.input}
                        required={hasExpiry}
                  />


                </div>


              </div>

            </div>

            <div className={styles.buttonContainer}>

                <button type="submit" className={`${styles.btn} ${styles.btnCreate} ${isMathError ? styles.btnDisable : ''}`} disabled={isMathError}>
                    Create
                </button>

                <button type="button" className={`${styles.btn} ${styles.btnCancel}`}>
                    <a href="/seller/vouchers">Cancel</a>
                </button>

            </div>

    </form>
  )
}

export default VoucherForm