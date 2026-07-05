'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './SellerNavBar.module.css'; 

export default function Navbar({ userAvatar }) {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Dashboard', href: '/seller/dashboard' },
    { name: 'My Store', href: '/seller/productlisting' },
    { name: 'Orders', href: '/seller/ordertracking' },
    { name: 'Refunds', href: '/seller/refunds' },
    { name: 'Vouchers', href: '/seller/vouchers' },
    { name: 'Chat', href: '/seller/chat' },
    { name: 'Wallet', href: '/seller/wallet' },
  ];

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
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.href} 
              href={link.href} 
              className={isActive ? styles.navLinkActive : styles.navLink}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>

      <Link href="/seller/profile" className={styles.avatarWrapper}>
        {userAvatar ? (
          <Image 
            src={userAvatar} 
            alt="User Avatar" 
            width={40} 
            height={40}
            priority
            style={{ borderRadius: '50%', objectFit: 'cover' }}
          />
        ) : (
          <div className={styles.avatarPlaceholder} style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ccc' }}></div>
        )}
      </Link>
    </header>
  );
}