import Success from "@/app/_components/Success/Success";

export default async function PaymentSuccess({ searchParams }){

    const {order} = await searchParams;

    return(
        <Success alt={"success"} title={"Payment Successful"} desc={`Successfully Made Payment for Order: #${order}`} specificRoute="/buyer/orders"/>
    )
}