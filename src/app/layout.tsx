import type { Metadata } from "next";
import localFont from "next/font/local";
import Navbar from "@/components/Navbar";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { ConstantsProvider } from "../context/ConstantsContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AgriConnect",
  description:
    "App to help farmers connect with other farmers and experts, also to sell their products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ConstantsProvider>
            <Navbar /> {/* Add Navbar here */}
            {children}
          </ConstantsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
