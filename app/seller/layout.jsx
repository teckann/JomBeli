import React from 'react'
import NavBar from '../_components/SellerNavBar/SellerNavBar'


export default function Seller ({ children }){
  return (
    <main>
        
        <NavBar />

        {children}
        
    </main>
  )
}
