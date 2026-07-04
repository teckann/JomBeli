import { getUser } from "@/app/_lib/auth";
import BuyerContactUsForm from "@/app/_components/BuyerContactUsForm/BuyerContactUsForm"

export default async function ContactUs({ searchParams }){

    const user = await getUser();
    const {productID} = await searchParams || null;

    return(
        <BuyerContactUsForm userId={user.id} productID={productID}/>
    )
}