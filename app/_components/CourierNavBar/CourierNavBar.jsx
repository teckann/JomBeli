import { getUser } from "@/app/_lib/auth"
import CourierNavBarClient from "./CourierNavBarClient";
import { getUserInfo } from "@/app/_lib/data-services";


export default async function CourierNavBar(){

    const user = await getUser();
    const userInfo = await getUserInfo(user.id);

    return(
        <CourierNavBarClient userInfo={userInfo}/>
    )
}