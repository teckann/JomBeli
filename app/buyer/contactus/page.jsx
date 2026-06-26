import { getUser } from "@/app/_lib/auth";
import BuyerContactUsForm from "@/app/_components/BuyerContactUsForm/BuyerContactUsForm"

export default async function ContactUs(){
    const user = await getUser();
    return(
        <BuyerContactUsForm userId={user.id}/>
    )
}