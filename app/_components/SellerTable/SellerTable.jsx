'use client'

import React from 'react'

import SpotlightCard from '@/app/_components/SpotlightCard/SpotlightCard';

import styles from './SellerTable.module.css'
import  FilterTable, { FilterBig } from './filterTable.jsx'

import { useState } from 'react';




const SellerTable = ({
    // three type of data can be entry
    tableHeader = [],
    tableData = [],
    navColumn = 'voucher_status',
    filterNav = [{nav: 'All', navStatus: ''},
                 {nav: 'Active', navStatus: 'active'},
                 {nav: 'Expired', navStatus: 'expired'},
                 {nav: 'Inactive', navStatus: 'inactive'},
    ],
    align = 'left'
}) => {



    const [search, setSearch] = useState('');
    const [curNav, setCurNav] = useState('');


        let filteredData = tableData.filter((dataFilting) => {
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

    filteredData = filteredData.filter((dataFilting) => {
        if (!curNav) return true;

            const statusInDatabase = String(dataFilting[navColumn]).toLowerCase();
            return statusInDatabase === curNav.toLowerCase();
    });




  return (

    <div className={styles.tcon}>

        <FilterBig changeNav={setCurNav} currentNav={curNav} navDetail={filterNav} />
            


        <div className={styles.focon}>

            <FilterTable changeSearch={setSearch} />

            <div style={{textAlign: align}}>

                
                <SpotlightCard className='table' spotlightheador="rgb(255, 5, 243)">
                        
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