import { getUser } from "@/app/_lib/auth";
import { getUserInfo } from "@/app/_lib/data-services";
import Image from "next/image";
import Styles from "./userProfile.module.css";
import ThemeToggleButton from "@/app/_components/ThemeToggleButton";
import SignOutButton from "@/app/_components/SignOutButton";


export default async function BuyerProfile(){
    const user = await getUser();
    const userInfo = await getUserInfo(user.id);

    const { username, avatar } = userInfo; 

    return(
        <>
            {/* User Profile Info */}
            <div className={Styles.userInfoContainer}>
                <Image className={Styles.userAvatar} src={avatar} alt="ProfilePhoto" width={200} height={200}/>
                <h1>{username}</h1>
                <ThemeToggleButton/>
                <SignOutButton/>
            </div>       
        </>

    )
}
