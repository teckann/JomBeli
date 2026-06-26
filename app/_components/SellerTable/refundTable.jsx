'use client'

import React from 'react'
import SellerTable from '@/app/_components/SellerTable/SellerTable';
import Link from 'next/link';



const RefundTable = ({ data }) => {

  return (
    <SellerTable 
        tableHeader={[{header: 'Refund Subject', data: 'refund_subject'},
                      {header: 'Description', data: 'refund_description'},
                      {header: 'Request Date', multiple: (row) => `${row.temp_date} ${row.temp_time}`}, 
                      {header: 'Response', multiple: (row) => `${row.ref_temp_date ?? 'Not Yet Response'} ${row.ref_temp_time ?? ''}`}, 
                      {header: 'Action', multiple: (row) => <> <Link href={`./refunds/${row.refund_id}`}>view</Link> </>}]} 
        navColumn='refund_status'
        filterNav = {[{nav: 'All', navStatus: ''},
                      {nav: 'Pending', navStatus: 'pending'},
                      {nav: 'Refunded', navStatus: 'refunded'},
                      {nav: 'Rejected', navStatus: 'rejected'}]}
        tableData={data}
    />
  )
}

export default RefundTable