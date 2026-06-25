import Script from "next/script";
import Styles from "./chatbot.module.css";

export default function ChatBot(){
    return(
        <div className={Styles.botContainer}>
            <Script 
                src="https://cdn.botpress.cloud/webchat/v3.6/inject.js"
                strategy="afterInteractive"
            />
            
            <Script 
                src="https://files.bpcontent.cloud/2026/06/17/12/20260617120413-EXSZUKXZ.js"
                strategy="lazyOnload"
            />
            <div id="botContainer"></div>
        </div>
    )
}