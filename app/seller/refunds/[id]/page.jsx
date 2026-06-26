import React from 'react'

import { getUser } from "@/app/_lib/auth";
import { getUserInfo } from "@/app/_lib/data-services";
import { getSellerRefund } from "@/app/_lib/data-services";

import styles from './refund.module.css'





const Refund = async ({ params }) => {

    
    const user = await getUser();

    const { id } = await params;

  return (
    <div className={styles.fcon}>

        <h1 className={styles.heading}>Refund Request</h1>
    
        <div className={styles.id}><span>Refund ID : </span>{id}</div>

        <div className={styles.status}>

            <p>Pending</p>

        </div>


        <div className={styles.scon}>

            <div className={styles.left}>
                <div className={styles.order}>
                    Order Details
                </div>
                <div>
                    <table className={styles.table}>
                        <thead className={styles.thead}>
                            <tr>
                                <th>1</th>
                                <th>1</th>
                                <th>1</th>
                                <th>1</th>
                            </tr>
                        </thead>
                        <tbody className={styles.tbody}>
                            <tr>
                                <td>1</td>
                                <td>1</td>
                                <td>1</td>
                                <td>1</td>
                            </tr>

                        </tbody>
                    </table>
                    <tr className={styles.lastB}>
                        <td className={styles.leftL}>
                            total : 

                        </td>
                        <td className={styles.rightL}>
                            RM 1234
                        </td>
                    </tr>
                </div>
            </div>

            <div className={styles.right}>
                something
            </div>

        </div>

    </div>
    
  )
}

export default Refund