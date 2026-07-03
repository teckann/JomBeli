import RefundForm from "@/app/_components/RefundForm/RefundForm";

export default async function RefundPage({ params }){
    
    const {orderID} = await params;

    return(
        <RefundForm orderID={orderID}/>
    )
}