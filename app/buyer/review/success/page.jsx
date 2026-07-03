import Success from "@/app/_components/Success/Success";

export default function ReviewSuccess(){
    return(
        <Success 
            alt={"Successfully Leaved Review"} 
            title={"Review Submitted"} 
            desc={"Successfully submitted review, thank you for helping us improve!"}
            specificRoute={"/buyer/orders"}
        />
    )
}