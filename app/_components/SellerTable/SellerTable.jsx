import React from 'react'

import SpotlightCard from '@/app/_components/SpotlightCard/SpotlightCard';

import styles from './SellerTable.module.css'



const SellerTable = ({
    tableHeader = [{header: 'Voucher Name', data: 'voucher_name'},
                   {header: 'T&C', data: 'max_spend'+','+'min_spend'},
                   {header: 'Discount', data: 'discount_value'},
                   {header: 'Expiry', data: 'start_date'+','+'end_date'}] ,
    tableData,
    align = 'left'
}) => {


  return (

    <div className={styles.tcon}>
        <div className={styles.navs}>
                <button className={styles.nav}> All </button>
                <button className={styles.nav}> Active </button>
                <button className={styles.nav}> Expired </button>
                <button className={styles.nav}> Inactive </button>
        </div>
            


        <div className={styles.focon}>
            <div className={styles.finding}>

                <div className={styles.search}>
                    I am search bar
                </div>
                <div className={styles.filter}>
                    I am filter
                </div>
                <div className={styles.sort}>
                    I am sort by
                </div>

            </div>

            <div  style={{textAlign: align}}>

                
                <SpotlightCard className='table' spotlightColor="rgba(255, 255, 5, 0.25)">
                        
                        <thead className={styles.thead}  style={{textAlign: align}}>
                            <tr>
                            {tableHeader.map((head) => (
                                <th >{head.header}</th>
                            ))}
                            </tr>
                        </thead>

                        <tbody className={styles.tbody}  styles={{textAlign: align}}>
                            {tableData.map((row) => (
                            <tr key={row.id}>
                                {tableHeader.map((oneData, id) => (
                                    <td key = {id}>
                                        {row[oneData.data]}
                                    </td>                                    
                                ))}

                            </tr>
                            ))}
                        </tbody>

                </SpotlightCard>

            </div>
        </div>
    </div>

  )
}

export default SellerTable