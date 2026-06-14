import "@/app/_styles/globals.css";
import { ThemeProvider } from "next-themes";
import "@/app/_styles/globals.css";
import BuyerNavBar from "../_components/BuyerNavBar/BuyerNavBar";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <BuyerNavBar/>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
