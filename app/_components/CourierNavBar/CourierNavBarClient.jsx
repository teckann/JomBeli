import Image from "next/image"
import Styles from "./CourierNavBar.module.css";
import Link from "next/link";

export default function CourierNavBarClient({userInfo}){
    const { username, avatar } = userInfo;
    return(
        <div className={Styles.navContainer}>
            <Link href="/" style={{textDecoration: "none"}}>
                <span className={Styles.logo}>JomBeli</span>
            </Link>
            <Link href="/courier/profile" style={{textDecoration: "none"}} >
                <div className={Styles.profileContainer}>
                    <Image
                        alt="avatar" 
                        src={avatar}  
                        height={40} 
                        width={40}
                    />
                    <span className={Styles.username}>{username}</span>    
                </div>
            </Link>

        </div>
    )
}