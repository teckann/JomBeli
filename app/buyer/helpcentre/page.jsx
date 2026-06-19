import Styles from "@/app/buyer/helpcentre/helpcentre.module.css"

export default function HelpPage(){
    return(
        <div>
            <div className={Styles.hero}>
                <h1>Need Assistance?</h1>
            </div>
            
            <div className={Styles.linkContainer}>
                <div className={Styles.linkCard}>
                    <h2>Chatbot</h2>
                </div>
                <div className={Styles.linkCard}>
                    How our platform works
                </div>
                <div className={Styles.linkCard}>
                    Admin contact portal
                </div>
            </div>
            
            <div className={Styles.faqContainer}>
                <div>
                    <h1>FAQ's</h1>
                    <p>Frequently asked questions</p>
                </div>
                <div className={Styles.faqContent}>
                    <div>
                        <h2>How long does it take for my parcel to be delivered?</h2>
                        <p>Your order will be shipped and delivered to you in 24 hours</p>
                    </div>
                    <div>
                        <h2>How long does it take for my parcel to be delivered?</h2>
                        <p>Your order will be shipped and delivered to you in 24 hours</p>
                    </div>
                    <div>
                        <h2>How long does it take for my parcel to be delivered?</h2>
                        <p>Your order will be shipped and delivered to you in 24 hours</p>
                    </div>
                    <div>
                        <h2>How long does it take for my parcel to be delivered?</h2>
                        <p>Your order will be shipped and delivered to you in 24 hours</p>
                    </div>

                </div>
            </div>

        </div>
    )
}