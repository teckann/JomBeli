'use client'

import React from 'react'
import SellerTable from '@/app/_components/SellerTable/SellerTable';


import styles from './SellerTable.module.css'
import Link from 'next/link';



const VoucherTable = ({ data }) => {

  return (
    <SellerTable 
        tableHeader={[{header: 'Voucher Name', data: 'voucher_name'},
                      {header: 'T&C', multiple: (row) => `Min spend: RM ${row.min_spend ?? '-'}`},
                      {header: 'Discount', data: 'discount_value'},
                      {header: 'Expiry', multiple: (row) => `${row.start_date ?? ''} - ${row.end_date ?? ''}`}, 
                      {header: 'Created By', multiple: (row) => `${row.temp_date} ${row.temp_time}`}, 
                      {header: 'Action', multiple: (row) => <> <Link className={styles.view}  href={`./vouchers/${row.voucher_id}`}>view</Link> </>}]} 
        navColumn='voucher_status'
        filterNav = {[{nav: 'All', navStatus: ''},
                      {nav: 'Active', navStatus: 'active'},
                      {nav: 'Inactive', navStatus: 'inactive'}]}
        tableData={data}
    />
  )
}

export default VoucherTable