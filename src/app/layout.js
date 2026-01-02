import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LimelightNavClient from "@/components/nav";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Second SIJA",
  description: "2nd Generation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <LimelightNavClient />
        {children}
      </body>
    </html>
  );
}
