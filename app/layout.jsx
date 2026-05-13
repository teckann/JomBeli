import "@/app/_styles/globals.css";
import { ThemeProvider } from 'next-themes'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div>
          <main>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
