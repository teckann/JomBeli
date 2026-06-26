"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Styles from "@/app/_components/BuyerNavBar/BuyerNavBar.module.css";

const Links = [
  { path: "#", name: "Category", position: "L"},
  { path: "#", name: "Voucher", position: "L"},
  { path: "/buyer/helpcentre", name: "Help Centre", position: "L"},
  { path: "/buyer/chat", name: "Message", position: "R"},
  { path: "#", name: "Cart", position: "R"},
]

export default function BuyerNavBarClient({user}){
  const { username, avatar, balances } = user;  
  const RouteWithSearch = ["/buyer", "/"];
  const currentPath = usePathname();

  if (RouteWithSearch.includes(currentPath)) {
    return (
      <div className={Styles.wrapper}>
        {/* Top section */}
        <div className={Styles.topContainer}>
          <Link className={Styles.logo} href="/buyer">JomBeli</Link>
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
            {Links.map((item)=>{
              if(item.position=="L"){
                return(
                  <Link 
                    className={`${Styles.link} ${currentPath === item.path ? Styles.active : ""}`}
                    href={item.path} 
                    key={item.name}
                  >
                    {item.name}
                  </Link>
                )
              }
            })}
          </div>
          <div className={Styles.LinkContainer}>
            {Links.map((item)=>{
              if(item.position=="R"){
                return(
                  <Link 
                    className={`${Styles.link} ${currentPath === item.path ? Styles.active : ""}`}
                    href={item.path} 
                    key={item.name}
                  >
                    {item.name}
                  </Link>
                )
              }
            })}
            <Link className={`${Styles.link} ${currentPath === "/buyer/wallet" ? Styles.active : ""}`} href="/buyer/wallet">
              RM {balances.toFixed(2)}
            </Link>
            <Link className={Styles.profileLink} href="/buyer/profile">
              <Image className={Styles.profileImage} src={avatar} width={30} height={30} alt="ProfileImage"/>
              {username}
            </Link>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className={Styles.noSearchWrapper}>
        <Link className={Styles.logo} href="/buyer">JomBeli</Link>
        <div className={Styles.LinkContainer}>
          {Links.map((item)=>(
            <Link 
              className={`${Styles.link} ${currentPath === item.path ? Styles.active : ""}`}
              href={item.path} 
              key={item.name}
            >
              {item.name}
            </Link>
          ))}
          <Link className={`${Styles.link} ${currentPath === "/buyer/wallet" ? Styles.active : ""}`} href="/buyer/wallet">
            RM {balances.toFixed(2)}
          </Link>
          <Link className={Styles.profileLink} href="/buyer/profile">
            <Image className={Styles.profileImage} src={avatar} width={30} height={30} alt="ProfileImage"/>
            {username}
          </Link>
        </div>
      </div>
    );
  }
}
