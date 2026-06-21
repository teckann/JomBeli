import React from 'react';
import Image from 'next/image';
import styles from './SellerNavBar.module.css'; 

// will refine ltr this test nia

export default function Navbar() {
  return (
    <header className={styles.header}>
      <div className={styles.logoWrapper}>
        <Image 
          src="/logo.png"       
          alt="Logo"    
          width={180}  
          height={48}      
          priority       
          className={styles.logoImg}   
        />
      </div>
     
      <nav className={styles.nav}>
        <a href="#" className={styles.navLink}>Overview</a>
        <a href="#" className={styles.navLinkActive}>My Store</a>
        <a href="#" className={styles.navLink}>Orders</a>
        <a href="#" className={styles.navLink}>Vouchers</a>
        <a href="#" className={styles.navLink}>Chat</a>
        <a href="#" className={styles.navLink}>Wallet</a>
      </nav>
      <div className={styles.avatar}></div>
    </header>
  );
}