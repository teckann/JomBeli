import Link from "next/link"

export default function orderCompletePage(){
    return(
        <div>
            <h1>Order Completed!</h1>
            <Link href="/buyer">Back to home</Link>            
        </div>
    )
}