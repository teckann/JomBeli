import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";

export default function Footer() {
  const menu = [
    { name: "Home", path: "/buyer" },
    { name: "Category", path: "/buyer/category" },
    { name: "Message", path: "/buyer/chat" },
    { name: "My Wallet", path: "/buyer/wallet" },
    { name: "My Order", path: "/buyer/order" },
  ];

  const info = [
    {
      title: "Office",
      detail:
        "Jalan Teknologi 5, Taman Teknologi Malaysia, 57000 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur",
    },
    { title: "Contact Number", detail: "03-8996 1000" },
    { title: "Official Email", detail: "info@apu.edu.my" },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.footerDetails}>
        <div className={styles.section1}>
          <Image
            src="/logo.png"
            alt="Logo"
            width={150}
            height={50}
            className={styles.logo}
          />

          <div className={styles.section1Details}>
            <div className={styles.footerHeader}>
              <h2>Jom Beli</h2>
              <p>
                Empowering smarter shopping with better deals, savings, and
                convenience for everyone.
              </p>
            </div>

            <div className={styles.socialMedia}>
              <Link
                className={styles.link}
                href="https://web.facebook.com/apuniversity"
                target="_blank"
              >
                <svg
                  className={styles.icon}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  preserveAspectRatio="none"
                >
                  <path d="M22 12a10 10 0 1 0-11.56 9.87v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.88h-2.34v6.99A10 10 0 0 0 22 12z" />
                </svg>
              </Link>

              <Link
                className={styles.link}
                href="https://www.instagram.com/asiapacificuniversity"
                target="_blank"
              >
                <svg
                  className={styles.icon}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  preserveAspectRatio="none"
                >
                  <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10z" />
                </svg>
              </Link>

              <Link
                className={styles.link}
                href="https://www.linkedin.com/school/apumalaysia"
                target="_blank"
              >
                <svg
                  className={styles.icon}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  preserveAspectRatio="none"
                >
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.67H9.33V9h3.42v1.56h.05c.48-.9 1.65-1.86 3.4-1.86 3.64 0 4.31 2.4 4.31 5.51v6.24zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.section2}>
          {menu.map((item) => {
            return (
              <Link key={item.name} href={item.path} className={styles.link}>
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className={styles.section3}>
          {info.map((item) => {
            return (
              <div key={item.title} className={styles.infoBox}>
                <div className={styles.iconTitle}>
                  <h3>{item.title}</h3>
                </div>
                <p>{item.detail}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.copyRight}>
        <p>Copyright 2026 © JomBeli. All rights reserved.</p>
      </div>
    </footer>
  );
}
