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

            <Link className={Styles.profileLink} href="/courier/profile">
              <Image className={Styles.profileImage} src={avatar} width={28} height={28} alt="Profile" />
              <span>{username}</span>
            </Link>

        </div>
    )
}