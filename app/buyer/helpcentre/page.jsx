import Styles from "@/app/buyer/helpcentre/helpcentre.module.css"
import { faqData } from "./FAQ"
import Link from "next/link"
import SupportPageHero from "@/app/_components/SupportPageHero/SupportPageHero"
export default function HelpPage(){
    return(
        <div>
            <SupportPageHero/>            
            <div className={Styles.linkContainer}>
                <div className={Styles.linkCard}>
                    <h2>Chatbot</h2>
                    <Link href="/buyer/chatbot">Chatbot</Link>
                </div>
                <div className={Styles.linkCard}>
                    <h2>How our platform works</h2>
                    <Link href="">About Our Platform</Link>
                </div>
                <div className={Styles.linkCard}>
                    <h2>Admin contact portal</h2>
                    <Link href="/buyer/contactus">Contact Us</Link>
                </div>
            </div>
            
            <div className={Styles.faqContainer}>
                <div className={Styles.faqBanner}>
                    <h1>FAQ's</h1>
                    <p>Frequently asked questions</p>
                </div>
                <div className={Styles.faqContent}>
                    {faqData.map((data)=>(
                        <div key={data.id}>
                            <h2>{data.question}</h2>
                            <p>{data.answer}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}