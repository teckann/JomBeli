"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Styles from "@/app/_components/BuyerNavBar/BuyerNavBar.module.css";

const icons = {
  Category: "M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z",
  Voucher: "M4 5a2 2 0 00-2 2v3a2 2 0 010 4v3a2 2 0 002 2h16a2 2 0 002-2v-3a2 2 0 010-4V7a2 2 0 00-2-2H4zm6 3a1 1 0 110 2 1 1 0 010-2zm0 4a1 1 0 110 2 1 1 0 010-2zm0 4a1 1 0 110 2 1 1 0 010-2z",
  HelpCentre: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z",
  message: "M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z",
  cart: "M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z",
  wallet: "M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
};

const Links = [
  { path: "/buyer/category", name: "Category", position: "L", icon: icons.Category },
  { path: "/buyer/vouchers", name: "Voucher", position: "L", icon: icons.Voucher },
  { path: "/buyer/helpcentre", name: "Help Centre", position: "L", icon: icons.HelpCentre },
  { path: "/buyer/chat", name: "Message", position: "R", icon: icons.message },
  { path: "/buyer/cart", name: "Cart", position: "R", icon: icons.cart },
];

export default function BuyerNavBarClient({ user }) {
  const { username, avatar, balances } = user;
  const RouteWithSearch = ["/buyer", "/"];
  const currentPath = usePathname();
  const showSearch = RouteWithSearch.includes(currentPath);

  const renderLink = (item) => {
    return (
      <Link
        key={item.name}
        className={`${Styles.link} ${currentPath === item.path ? Styles.active : ""}`}
        href={item.path}
      >
        <svg
          className={Styles.linkIcon}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ width: '1.25em', height: '1.25em', marginRight: '0.25em', verticalAlign: 'middle' }} // Optional fallback styles for icons if not handled in CSS
        >
          <path d={item.icon} />
        </svg>
        {item.name}
      </Link>
    );
  };

  if (showSearch) {
    return (
      <div className={Styles.wrapper}>
        {/* Top section */}
        <div className={Styles.topContainer}>
          <Link className={Styles.logo} href="/buyer">
            JomBeli
          </Link>
          <form action="" className={Styles.searchContainer}>
            <input
              className={Styles.searchbar}
              type="search"
              placeholder="Search for product"
            />
            <button className={Styles.searchButton} type="submit">
              Search
            </button>
          </form>
        </div>
        {/* Bottom section */}
        <div className={Styles.bottomContainer}>
          <div className={Styles.LinkContainer}>
            {Links.filter((item) => item.position === "L").map(renderLink)}
          </div>
          <div className={Styles.LinkContainer}>
            {Links.filter((item) => item.position === "R").map(renderLink)}
            <Link
              className={`${Styles.link} ${Styles.walletLink} ${currentPath === "/buyer/wallet" ? Styles.active : ""}`}
              href="/buyer/wallet"
            >
              <svg
                className={Styles.linkIcon}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ width: '1.25em', height: '1.25em', marginRight: '0.25em', verticalAlign: 'middle' }}
              >
                <path d={icons.wallet} />
              </svg>
              RM {balances.toFixed(2)}
            </Link>
            <Link className={Styles.profileLink} href="/buyer/profile">
              <Image
                className={Styles.profileImage}
                src={avatar}
                width={30} 
                height={30}
                alt="ProfileImage"
              />
              {username}
            </Link>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className={Styles.noSearchWrapper}>
        <Link className={Styles.logo} href="/buyer">
          JomBeli
        </Link>
        <div className={Styles.LinkContainer}>
          {Links.map(renderLink)}
          <Link
            className={`${Styles.link} ${currentPath === "/buyer/wallet" ? Styles.active : ""}`}
            href="/buyer/wallet"
          >
            <svg
              className={Styles.linkIcon}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ width: '1.25em', height: '1.25em', marginRight: '0.25em', verticalAlign: 'middle' }}
            >
              <path d={icons.wallet} />
            </svg>
            RM {balances.toFixed(2)}
          </Link>
          <Link className={Styles.profileLink} href="/buyer/profile">
            <Image
              className={Styles.profileImage}
              src={avatar}
              width={30} 
              height={30} 
              alt="ProfileImage"
            />
            {username}
          </Link>
        </div>
      </div>
    );
  }
}