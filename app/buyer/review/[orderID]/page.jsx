import ReviewForm from "@/app/_components/ReviewForm/ReviewForm";
import { getUser } from "@/app/_lib/auth";
import { getOrder } from "@/app/_lib/data-services";

export default async function ReviewPage({ params }){

    const { orderID } = await params;
    const user = await getUser();
    const orderData = await getOrder(orderID, user.id);

    const ReviewData = {
        orderId: orderID,
        userId: user.id,
        orderItems: orderData.ORDER_ITEMS_T,
    }

    return(
        <ReviewForm ReviewData={ReviewData}/>
    )
}

