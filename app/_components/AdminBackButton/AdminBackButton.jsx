"use client";
import Styles from "./AdminBackButton.module.css"
import { useRouter } from "next/navigation";

export default function BackButton(){
    const router = useRouter();

    return(
        <button className={Styles.backButton} type="button" onClick={() => router.back()}>
            Back
        </button>
    )

}