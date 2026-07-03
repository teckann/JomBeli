"use client";

import { useState } from "react";
import Link from "next/link";
import Styles from "@/app/buyer/helpcentre/helpcentre.module.css";
import { faqData } from "./FAQ";
import SupportPageHero from "@/app/_components/SupportPageHero/SupportPageHero";

export default function HelpPage() {

  const [openFaqIds, setOpenFaqIds] = useState([]);

  const toggleFaq = (id) => {
    setOpenFaqIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div>
      <SupportPageHero />

      {/* Navigation Cards */}
      <div className={Styles.linkContainer}>
        <div className={Styles.linkCard}>
          <h3>Chatbot</h3>
          <p>Get instant automated assistance for common issues.</p>
          <Link href="/buyer/chatbot">Open Chatbot</Link>
        </div>

        <div className={Styles.linkCard}>
          <h3>How our platform works</h3>
          <p>Learn the basics of navigating and purchasing on our platform.</p>
          <Link href="/buyer/about">About Our Platform</Link>
        </div>

        <div className={Styles.linkCard}>
          <h3>Admin contact portal</h3>
          <p>Can't find what you need? Reach out directly to our support team.</p>
          <Link href="/buyer/contactus">Contact Us</Link>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className={Styles.faqContainer}>
        <div className={Styles.faqBanner}>
          <h2>FAQ's</h2>
          <p>Frequently asked questions</p>
        </div>

        <div className={Styles.faqContent}>
          {faqData.map((data) => {
            const isOpen = openFaqIds.includes(data.id);
            return (
              <div 
                key={data.id} 
                className={`${Styles.faqItem} ${isOpen ? Styles.active : ""}`}
              >
                <button
                  className={Styles.faqQuestion}
                  onClick={() => toggleFaq(data.id)}
                  aria-expanded={isOpen}
                >
                  <span>{data.question}</span>
                  <span className={Styles.arrow}>▲</span>
                </button>
                <div className={Styles.faqAnswer}>
                  <p>{data.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}