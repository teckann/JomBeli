"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import styles from "./ThemeToggle.module.css";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      className={styles.themeBtn}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}

const MoonIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      className={styles.icon}
    >
      <path d="M12.74 2.03a.75.75 0 00-.82.96 8.5 8.5 0 109.09 9.09.75.75 0 00-.96-.82A7 7 0 0112.74 2.03z" />
    </svg>
  );
};

const SunIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      className={styles.icon}
    >
      <circle cx="12" cy="12" r="5" />
      <path
        strokeLinecap="round"
        d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
      />
    </svg>
  );
};

export default ThemeToggle;
