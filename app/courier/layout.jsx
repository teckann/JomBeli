import CourierNavBar from "../_components/CourierNavBar/CourierNavBar";

export default function CourierLayout({ children }){
    return(
        <>
            <CourierNavBar/>
                {children}
        </>
    )
}