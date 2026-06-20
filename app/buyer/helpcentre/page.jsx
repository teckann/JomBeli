import Styles from "@/app/buyer/helpcentre/helpcentre.module.css"
import { faqData } from "./FAQ"
import Link from "next/link"
export default function HelpPage(){
    return(
        <div>
            <div className={Styles.hero}>
                <h1>Need Assistance?</h1>
            </div>
            
            <div className={Styles.linkContainer}>
                <div className={Styles.linkCard}>
                    <h2>Chatbot</h2>
                    <Link href="">Chatbot</Link>
                </div>
                <div className={Styles.linkCard}>
                    <h2>How our platform works</h2>
                    <Link href="">About Our Platform</Link>
                </div>
                <div className={Styles.linkCard}>
                    <h2>Admin contact portal</h2>
                    <Link href="">Contact Us</Link>
                </div>
            </div>
            
            <div className={Styles.faqContainer}>
                <div className={Styles.faqBanner}>
                    <h1>FAQ's</h1>
                    <p>Frequently asked questions</p>
                </div>
                <div className={Styles.faqContent}>
                    {faqData.map((data)=>(
                        <>
                            <div key={data.id}>
                                <h2>{data.question}</h2>
                                <p>{data.answer}</p>
                            </div>
                            <hr />
                        </>
                    ))}
                </div>
            </div>

        </div>
    )
}