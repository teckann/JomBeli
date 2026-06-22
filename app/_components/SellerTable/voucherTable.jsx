'use client'

import React from 'react'
import SellerTable from '@/app/_components/SellerTable/SellerTable';

const VoucherTable = ({ data }) => {

  return (
    <SellerTable 
        tableHeader={[{header: 'Voucher Name', data: 'voucher_name'},
                        {header: 'T&C', multiple: (row) => <> Min spend: RM {row.min_spend ?? '-'} <br /> Discount cap at: RM {row.max_spend ?? '-'} </>},
                        {header: 'Discount', data: 'discount_value'},
                        {header: 'Expiry', multiple: (row) => `${row.start_date} - ${row.end_date}`}, 
                        {header: '', multiple: () => 
                        <>
                            <a href="">view</a>

                        </>}]} 
        tableData={data}
    />
  )
}

export default VoucherTable