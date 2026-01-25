import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google"; 
import "./globals.css";

// 1. Heading Font (Playfair - Royal Look)
const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

// 2. Body Font (Inter - Clean Look)
const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nandani Collection",
  description: "Premium Ethnic Wear for Women",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Dono fonts ke variables ko body me inject kiya */}
      <body className={`${playfair.variable} ${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}