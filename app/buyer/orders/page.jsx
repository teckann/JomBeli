import MyOrdersCard from "@/app/_components/MyOrdersCard/MyOrdersCard";
import OrderFilter from "@/app/_components/OrderFilter/OrderFilter";
import { getUser } from "@/app/_lib/auth";
import { getOrdersItems } from "@/app/_lib/data-services"

export default async function myOrderPage({ searchParams }){

    const user = await getUser()

    const param = await searchParams; 
    const statusFilter = param.status;

    const order = await getOrdersItems(user.id, statusFilter);
    
    return(
        <div>
            
            <OrderFilter/>

            {order.map((item)=>(
                <MyOrdersCard 
                    key={item.order_id}
                    orderID={item.order_id}
                    orderItems={item.ORDER_ITEMS_T}
                    totalAmount={item.total_amount}
                    order_status={item.order_status}
                />
            ))}
        </div>

    )
}