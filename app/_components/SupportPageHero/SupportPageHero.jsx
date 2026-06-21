"use client"
import { useEffect, useState } from "react"
import Styles from "./SupportPageHero.module.css"

export default function SupportPageHero(){
    const HeroTitle = [
    "Need Help?",
    "How Can We Help?",
    "Search Our FAQs",
    "Ask Us Anything",
    "Get Support"
    ];
    const [title, setTitle] = useState(0);
    useEffect(()=>{

        const intervalId = setInterval(() => {
            setTitle((prevTitle) => (prevTitle + 1) % HeroTitle.length);
        }, 4000)

        return () => clearInterval(intervalId);
    }, [])
    return(
        <div className={Styles.hero}>
            <h1 key={title} className={Styles.title}>{HeroTitle[title]}</h1>
        </div>
    )
}