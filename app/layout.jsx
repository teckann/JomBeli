// import "@/app/_styles/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
