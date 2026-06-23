'use client'

import React from 'react'

import SpotlightCard from '@/app/_components/SpotlightCard/SpotlightCard';

import styles from './SellerTable.module.css'
import FilterTable from './filterTable.jsx'

import { useState, useEffect } from 'react';




const SellerTable = ({
    // three type of data can be entry
    tableHeader = [],
    tableData = [],
    align = 'left'
}) => {



    const [search, setSearch] = useState('');


        const filteredData = tableData.filter((dataFilting) => {
        if (!search) return true;

            return tableHeader.some((head) => {

                let fixData;

                if (head.data) {
                    fixData = dataFilting[head.data];
                } else if (head.multiple) {
                    fixData = head.multiple(dataFilting);

                }

                
                const dataFiltered = head.data ? dataFilting[head.data] : head.multiple(dataFilting);
                return dataFiltered.toString().toLowerCase().includes(search.toLowerCase());
            });
        
        });


  return (

    <div className={styles.tcon}>
        <div className={styles.navs}>
                <button className={styles.nav}> All </button>
                <button className={styles.nav}> Active </button>
                <button className={styles.nav}> Expired </button>
                <button className={styles.nav}> Inactive </button>
        </div>
            


        <div className={styles.focon}>

            <FilterTable changeSearch={setSearch} />

            <div style={{textAlign: align}}>

                
                <SpotlightCard className='table' spotlightheador="rgba(255, 5, 243, 0.4)">
                        
                        <thead className={styles.thead}  style={{textAlign: align}}>
                            <tr>
                            {tableHeader.map((head) => (
                                <th >{head.header}</th>
                            ))}
                            </tr>
                        </thead>

                        <tbody className={styles.tbody}  styles={{textAlign: align}}>
                            {filteredData.map((row) => (
                            <tr key={row.id}>
                                {tableHeader.map((oneData, id) => (
                                    <td key = {id}>
                                        {oneData.data ? row[oneData.data] : oneData.multiple(row)}
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