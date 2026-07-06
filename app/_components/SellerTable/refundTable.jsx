'use client'

import React from 'react'
import SellerTable from '@/app/_components/SellerTable/SellerTable';
import Link from 'next/link';

import styles from './SellerTable.module.css'



const RefundTable = ({ data }) => {

  return (
    <SellerTable 
        tableHeader={[{header: 'Refund Subject', data: 'refund_subject'},
                      {header: 'Description', data: 'refund_description'},
                      {header: 'Request Date', multiple: (row) => `${row.temp_date} ${row.temp_time}`}, 
                      {header: 'Response', multiple: (row) => `${row.ref_temp_date ?? 'Not Yet Response'} ${row.ref_temp_time ?? ''}`}, 
                      {header: 'Refund Status', multiple: (row) => `${row.seller_status}`}, 
                      {header: 'Refund Status (Admin)', multiple: (row) => `${row.admin_status}`}, 
                      {header: 'Action', multiple: (row) => <> <Link className={styles.view} href={`./refunds/${row.refund_id}`}>view</Link> </>}]} 
        navColumn='seller_status'
        filterNav = {[{nav: 'All', navStatus: ''},
                      {nav: 'Pending', navStatus: 'pending'},
                      {nav: 'Refunded', navStatus: 'refunded'},
                      {nav: 'Rejected', navStatus: 'rejected'}]}
        tableData={data}
    />
  )
}

export default RefundTable