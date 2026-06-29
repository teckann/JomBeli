import { getUser } from "@/app/_lib/auth";
import { getCartItems } from "@/app/_lib/data-services";
import BuyerCartClient from "../BuyerCartClient/BuyerCartClient";

export default async function BuyerCartComponent(){
    const user = await getUser();
    const cartData = await getCartItems(user.id);

    return <BuyerCartClient cartData={cartData}/>
}