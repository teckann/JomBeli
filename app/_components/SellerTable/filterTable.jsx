'use client'

import React from 'react'

import styles from './SellerTable.module.css';

const FilterTable = ({ changeSearch }) => {



    return (
        <div className={styles.finding}>

            <div className={styles.search}>
                

                    <div class={styles.searchBar} >
                        <input 
                        autocomplete="off" 
                        className={styles.searchArea} 
                        type="text" name="search" 
                        placeholder="Search..." 
                        onChange={(e) => changeSearch(e.target.value)} />
                        
                    </div>
                

            </div>

            <div className={styles.filter}>
                I am filter
            </div>
            <div className={styles.sort}>
                I am sort by
            </div>

        </div>
  )
}

export default FilterTable