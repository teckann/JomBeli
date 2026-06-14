import Link from "next/link";
import Styles from "@/app/_components/BuyerNavBar/BuyerNavBar.module.css";

export default function BuyerNavBar(){
    return(
        <div className={Styles.wrapper}>
            {/* Top section */}
            <div className={Styles.topContainer}>
                <span className={Styles.logo} style={{fontSize: "30px", color: "lightcoral"}}>JOMBELI</span>
                <input className={Styles.searchbar} type="search" placeholder="Search for product"/>
            </div>
            {/* Bottom section */}
            <div className={Styles.bottomContainer}>
                <div className={Styles.leftLink}>
                    <Link className={Styles.link} href="">Category</Link>     
                    <Link className={Styles.link} href="">Voucher</Link>     
                    <Link className={Styles.link} href="">Help Centre</Link>     
                </div>

                <div className={Styles.rightLink}>
                    <Link className={Styles.link} href="">Messages</Link>
                    <Link className={Styles.link} href="">Cart</Link>
                    <Link className={Styles.link} href="">RM 0.00</Link>
                </div>
            </div>

        </div>
    );
}