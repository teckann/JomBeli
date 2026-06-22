"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Styles from "@/app/_components/BuyerNavBar/BuyerNavBar.module.css";

export default function BuyerNavBarClient({ user }) {
  const { username, avatar, balances } = user;

  const RouteWithSearch = ["/buyer"];
  const currentPath = usePathname();

  if (RouteWithSearch.includes(currentPath)) {
    return (
      <div className={Styles.wrapper}>
        {/* Top section */}
        <div className={Styles.topContainer}>
          <span className={Styles.logo}>JomBeli</span>
          <form action="" className={Styles.searchContainer}>
            <input
              className={Styles.searchbar}
              type="search"
              placeholder="Search for product"
            />
            <button className={Styles.searchButton} type="Submit">
              Search
            </button>
          </form>
        </div>
        {/* Bottom section */}
        <div className={Styles.bottomContainer}>
          <div className={Styles.LinkContainer}>
            <Link className={Styles.link} href="">
              Category
            </Link>
            <Link className={Styles.link} href="">
              Voucher
            </Link>
            <Link className={Styles.link} href="/buyer/helpcentre/">
              Help Centre
            </Link>
          </div>

          <div className={Styles.LinkContainer}>
            <Link className={Styles.link} href="/buyer/chat">
              Messages
            </Link>
            <Link className={Styles.link} href="">
              Cart
            </Link>
            <Link className={Styles.link} href="/buyer/wallet">
              RM {balances.toFixed(2)}
            </Link>
            <Link className={Styles.profileLink} href="/buyer/profile">
              <Image
                className={Styles.profileImage}
                src={avatar}
                width={30}
                height={30}
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
        <span className={Styles.logo}>JomBeli</span>

        <div className={Styles.LinkContainer}>
          <Link className={Styles.link} href="">
            Category
          </Link>
          <Link className={Styles.link} href="">
            Voucher
          </Link>
          <Link className={Styles.link} href="/buyer/helpcentre/">
            Help Centre
          </Link>
          <Link className={Styles.link} href="/buyer/chat">
            Messages
          </Link>
          <Link className={Styles.link} href="">
            Cart
          </Link>
          <Link className={Styles.link} href="/buyer/wallet">
            RM {balances.toFixed(2)}
          </Link>
          <Link className={Styles.profileLink} href="/buyer/profile">
            <Image
              className={Styles.profileImage}
              src={avatar}
              width={30}
              height={30}
            />
            {username}
          </Link>
        </div>
      </div>
    );
  }
}
