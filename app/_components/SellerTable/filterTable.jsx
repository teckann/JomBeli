'use client'

import React from 'react'

import styles from './SellerTable.module.css';

const FilterTable = ({ changeSearch }) => {


    return (
        <div className={styles.finding}>

            <div className={styles.search}>
                

                    <div className={styles.searchBar} >
                        <input 
                        autoComplete="off" 
                        className={styles.searchArea} 
                        type="text" name="search" 
                        placeholder="Search..." 
                        onChange={(e) => changeSearch(e.target.value)} />
                        
                    </div>
                

            </div>



        </div>
  )
}

const FilterBig = ({ changeNav, currentNav,     
                     navDetail = [{nav: 'All', navStatus: ''},
                                {nav: 'Active', navStatus: 'active'},
                                {nav: 'Expired', navStatus: 'expired'},
                                {nav: 'Inactive', navStatus: 'inactive'},
    ] }) => {

    return (
        <div className={styles.navs}>
            {navDetail.map((bar, index) => (
                <button key={index} className={`${styles.nav} ${currentNav === bar.navStatus ? styles.activeNav : ''}`}
                    onClick={(e) => {
                        changeNav(bar.navStatus);

                    }}
                >
                    {bar.nav} </button>
                ))}
        </div>
  )
}

export default FilterTable;
export { FilterBig }