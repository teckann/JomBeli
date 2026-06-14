import "@/app/_styles/globals.css";
import { ThemeProvider } from "next-themes";

export const metadata = {
  title: {
    template: "%s | JomBeli",
    default: "Welcome | JomBeli",
  },
  icons: {
    icon: "/logo.png",
  },
  description: "One-stop e-commerce system in Kuala Lumpur, Malaysia - JomBeli",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
