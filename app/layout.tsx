import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google"; 
import "./globals.css";

import Header from "@/components/Header"; 
import Footer from "@/components/Footer"; // Footer Import kiya

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

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
      <body className={`${playfair.variable} ${inter.variable} antialiased flex flex-col min-h-screen`}>
        
        {/* 1. Header (Sabse Upar) */}
        <Header />
        
        {/* 2. Main Content (Beech me) */}
        <main className="flex-grow">
          {children}
        </main>

        {/* 3. Footer (Sabse Niche) */}
        <Footer />
        
      </body>
    </html>
  );
}