import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google"; 
import "./globals.css";
import Header from "@/components/Header"; 
import Footer from "@/components/Footer"; 
import CartDrawer from "@/components/CartDrawer";
// ✅ AuthProvider import किया
import { AuthProvider } from "@/context/AuthContext"; 

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "Nandani Collection",
  description: "Premium Ethnic Wear",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${playfair.variable} ${inter.variable} antialiased font-sans flex flex-col min-h-screen`}>
        {/* ✅ AuthProvider को सबसे ऊपर रखा ताकि Header/Cart को भी User Data मिल सके */}
        <AuthProvider>
          <Header />
          <CartDrawer />
          
          <main className="flex-grow overflow-x-hidden">
            {children}
          </main>
          
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}