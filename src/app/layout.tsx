import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import UnregisterSW from "@/components/UnregisterSW";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Generator CV",
  description: "Creează și exportă CV-ul tău în PDF, Word și HTML",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <UnregisterSW />
      </body>
    </html>
  );
}
