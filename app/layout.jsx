import "@/app/_styles/globals.css";
import { ThemeProvider } from "next-themes";
import "@/app/_styles/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
