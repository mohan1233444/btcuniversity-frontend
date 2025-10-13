
import "./globals.css";
import {Providers }from "@/app/providers";
import "@turnkey/react-wallet-kit/styles.css";



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}