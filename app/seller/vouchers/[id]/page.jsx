import React from 'react'

const Voucher = async ({ params }) => {


    const { id } = await params;

  return (
    <div>Voucher{id}</div>
  )
}

export default Voucher