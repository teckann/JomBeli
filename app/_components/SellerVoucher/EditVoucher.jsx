'use client'

import React, { useState } from 'react'

import styles from '@/app/seller/vouchers/[id]/voucher.module.css';



import { sellerUpdateVoucher, sellerVoucherActivation } from '@/app/_lib/voucher-actions'; 

const EditVoucher = ({ oneVoucher, userInfo }) => {

    const [isEditing, setisEditing] = useState(false);
    const [toSave, setToSave] = useState(false);

    const [isActive, setIsActive] = useState(oneVoucher.voucher_status === 'Active');

    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toISOString().slice(0, 16);
    };



    const [data, setData] = useState({
        
        voucher_name: oneVoucher.voucher_name || '',
        discount_value: oneVoucher.discount_value || '',
        min_spend: oneVoucher.min_spend || '',
        quantity: oneVoucher.quantity || '',
        start_date: formatDate(oneVoucher.start_date),
        end_date: formatDate(oneVoucher.end_date)
    })

    const isMathError = data.discount_value !== '' && data.min_spend !== '' && Number(data.min_spend) <= Number(data.discount_value);


    function changeState (e) {
        const { name, value } = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }

    async function saveChange (e) {
        setToSave(true);


        const formData = new FormData();
        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        });






        await sellerUpdateVoucher(oneVoucher.voucher_id, formData);

                alert('Changes saved successfully!');
        setisEditing(false);

    }

    async function inactiveVoucher (e) {

        const newStatus = isActive ? 'inactive' : 'active';
        
        setIsActive(!isActive); 


        e.preventDefault();

        await sellerVoucherActivation(oneVoucher.voucher_id, newStatus);
    }




  return (
    <div>

        
                <div className={styles.topPartWrapper}>
                  <div className={styles.topLeftColumn}>
                    <a href="/seller/vouchers" className={styles.backBtn} style={{ textDecoration: 'none' }}>← Back</a>
                    {isEditing ? (
                        <input 
                            type="text"
                            name='voucher_name'
                            value={data.voucher_name}
                            className={styles.titleInput}

                            onChange={changeState}

                             />
                    ) : (
                    <h1 className={styles.productTitle}>{data.voucher_name}</h1>
                    
                    )}
                    
                    
                  </div>
        
        
                  <div className={styles.topRightColumn}>

                    {!isEditing ? (
                        <div className={`${styles.button} ${isEditing? styles.disable: ''}`}>
                            <button className={`${styles.btn} ${styles.btnNo}`} 
                                onClick={() => setisEditing(true)}>
                                Edit
                            </button>

                            <button className={`${styles.btn} ${styles.btnDanger}`} 
                                onClick={inactiveVoucher}>
                                {isActive ? 'Activate' : 'Deactivate'}

                            </button>


                        </div>
                    ) : (
                        <div className={`${styles.button} ${!isEditing? styles.disable: ''}`}>
                            <button
                                onClick={saveChange}
                                className={`${styles.btn} ${styles.btnSave} ${isMathError ? styles.disabled : ''}`} 
                                disabled={isMathError}>
                                Save
                            </button>


                            

                            <button className={`${styles.btn} ${styles.btnNo}`} 
                                onClick={() => {
                                    setisEditing(false);
                                    setData({
                                        voucher_name: oneVoucher.voucher_name || '',
                                        discount_value: oneVoucher.discount_value || '',
                                        min_spend: oneVoucher.min_spend || '',
                                        quantity: oneVoucher.quantity || '',
                                        start_date: formatDate(oneVoucher.start_date),
                                        end_date: formatDate(oneVoucher.end_date)
                                    });
                            }}
                            >
                                Cancel

                            </button>
                        </div>
                    )}


                    <span className={styles.postDate}></span> 
                    {new Date(oneVoucher.created_at).toLocaleDateString()}
                  </div>
        
        
                </div>
                <hr className={styles.divider} />
        
                <section className={styles.detailsSection}>
                  <div className={styles.imagePlaceholder}>
                      <img src={userInfo.avatar} alt={userInfo.username} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
        
                  </div>
        
                  <div className={styles.infoTableContainer}>
                    <table className={styles.infoTable}>
                      <tbody>
                        <tr><td>Voucher ID</td><td>{oneVoucher.voucher_id}</td></tr>
                        
                        <tr><td>Discount Value</td><td>

                            {isEditing? (
                                <input type='number' name='discount_value' 
                                        value={data.discount_value}
                                        onChange={changeState}
                                        className={styles.input}
                                        required
                                    />

                            ) : ( data.discount_value )}
                            
                            </td></tr>

                        <tr><td className={styles.alignTop}>Min Spend</td><td><span>RM </span>
                            {isEditing? (
                                <div>


                                <input type='number' name='min_spend' 
                                    className={styles.input}
                                    required
                                    value={data.min_spend}
                                    onChange={changeState}
                                
                                />

                                {isMathError && (
                                    <span className={styles.errorText}>
                                        Min spend must be higher than the discount value
                                    </span>
                                )}
                    
                                </div>
                            ) : (Number(data.min_spend || 0).toFixed(2))}</td></tr>

                        <tr><td>Quantity</td><td>                            
                            {isEditing? (
                                <input type='number' className={styles.input}
                                    onChange={changeState}
                                
                                
                                    name='quantity' value={data.quantity}/>

                            ) : (data.quantity)}</td></tr>

                        <tr><td>Total Claimed</td><td>{oneVoucher.total_claimed}</td></tr>
                        <tr>
                          <td>Total Used</td>
                          <td className={styles.priceHighlight}>
                            {oneVoucher.total_used}
                          </td>
                        </tr>
                        <tr><td>Start Date</td><td>                            
                            {isEditing? (
                                <input type='datetime-local' name='start_date' 
                                value={data.start_date}
                                onChange={changeState}
                                className={styles.input}
                                />


                            ) : (data.start_date || 'No expiry')}</td></tr>
                        <tr><td>End Date</td><td>                            
                            {isEditing? (
                                <input type='datetime-local' 
                                name='end_date' 
                                value={data.end_date}
                                onChange={changeState}
                                className={styles.input}
                                />

                            ) : (data.end_date || 'No Expiry')}</td></tr>
                      </tbody>
                    </table>
                  </div>
                </section>
        
        


    </div>
  )
}

export default EditVoucher