import type { Metadata, Viewport } from "next"; 
import { Playfair_Display, Inter } from "next/font/google"; 
import "./globals.css";
import Header from "@/components/Header"; 
import Footer from "@/components/Footer"; 
import CartDrawer from "@/components/CartDrawer";
import { AuthProvider } from "@/context/AuthContext"; 

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair", 
  display: "swap",
  adjustFontFallback: true 
});

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter", 
  display: "swap",
  adjustFontFallback: true 
});

// ✅ Next.js Metadata Optimization: Manifest and Icons integrated here
export const metadata: Metadata = {
  title: "Nandani Collection | Premium Ethnic Wear",
  description: "Experience the essence of Indian tradition with our handcrafted ethnic wear. Shop Designer Suits, Sarees, and Kurtis.",
  keywords: ["Ethnic Wear", "Sarees", "Suits", "Nandani Collection"],
  authors: [{ name: "Nandani Collection" }],
  manifest: "/manifest.json", // ✅ PWA Link
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nandani",
  },
  icons: {
    icon: "/icon-192x192.png",
    apple: "/icon-512x512.png", // ✅ iOS Home Screen Icon
  },
};

export const viewport: Viewport = {
  themeColor: "#8B3E48",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* ✅ Resource Hints for API and Images */}
        <link rel="preconnect" href="https://www.nandanicollection.com" />
        <link rel="dns-prefetch" href="https://www.nandanicollection.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body className={`${playfair.variable} ${inter.variable} antialiased font-sans flex flex-col min-h-screen bg-white text-gray-900`}>
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