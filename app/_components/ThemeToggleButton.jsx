"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; //render null when page is not mounted to prevent hydration error
  }

  return (
    <div>
      The current theme is: {theme}
      <button className="btn btn-primary" onClick={() => setTheme("light")}>
        Light Mode
      </button>
      <button className="btn btn-primary" onClick={() => setTheme("dark")}>
        Dark Mode
      </button>
    </div>
  );
}
