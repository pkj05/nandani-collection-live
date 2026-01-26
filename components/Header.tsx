"use client";

import Link from "next/link";
import { Search, ShoppingBag, Heart, Menu, X } from "lucide-react"; 
import { useState } from "react"; 
// 1. Store Import kiya
import { useCartStore } from "@/store/useCartStore";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 2. Store se data aur function nikala
  const cart = useCartStore((state) => state.cart);
  const toggleCart = useCartStore((state) => state.toggleCart);

  // Kul items ginne ke liye (1 suit + 2 sarees = 3 items)
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      
      {/* TOP ANNOUNCEMENT BAR */}
      <div className="bg-primary text-primary-foreground text-xs py-2 text-center tracking-wide font-medium">
        Free Shipping on orders above ₹1499 | Easy Returns
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* LEFT SECTION: Mobile Menu Button & Desktop Links */}
          <div className="flex items-center gap-6">
            <button 
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              onClick={toggleMenu}
            >
              <Menu size={24} />
            </button>

            <div className="hidden md:flex gap-8 text-sm font-medium text-gray-800 tracking-wide">
              <Link href="/suits" className="hover:text-primary transition-colors uppercase">Suits</Link>
              <Link href="/sarees" className="hover:text-primary transition-colors uppercase">Sarees</Link>
              <Link href="/kurtis" className="hover:text-primary transition-colors uppercase">Kurtis</Link>
            </div>
          </div>

          {/* CENTER: LOGO */}
          <div className="flex-shrink-0 text-center">
            <Link href="/" className="text-3xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight">
              Nandani
            </Link>
          </div>

          {/* RIGHT SECTION: ICONS */}
          <div className="flex items-center gap-4 md:gap-6">
            <button className="p-2 text-gray-700 hover:text-primary"><Search size={20} /></button>
            <button className="hidden md:block p-2 text-gray-700 hover:text-primary"><Heart size={20} /></button>
            
            {/* --- SMART SHOPPING BAG --- */}
            <button 
              onClick={toggleCart} // 3. Click pe side drawer khulega
              className="p-2 relative text-gray-700 hover:text-primary transition-transform active:scale-90"
            >
              <ShoppingBag size={20} />
              
              {/* 4. Dynamic Badge: Tabhi dikhega jab cart me kuch ho */}
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full animate-in zoom-in duration-300">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --- SIDE DRAWER (MOBILE MENU) --- */}
      <div 
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 md:hidden z-[55] ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleMenu}
      ></div>

      <div className={`fixed top-0 left-0 h-full w-72 bg-white z-[60] shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-serif font-bold text-gray-900">Nandani</h2>
            <button onClick={toggleMenu} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-col space-y-6">
            <Link href="/suits" className="text-lg font-medium text-gray-800 hover:text-primary" onClick={toggleMenu}>Suits</Link>
            <Link href="/sarees" className="text-lg font-medium text-gray-800 hover:text-primary" onClick={toggleMenu}>Sarees</Link>
            <Link href="/kurtis" className="text-lg font-medium text-gray-800 hover:text-primary" onClick={toggleMenu}>Kurtis</Link>
            
            <div className="pt-8 border-t border-gray-100">
              <Link href="/contact" className="text-sm text-gray-500 block mb-4" onClick={toggleMenu}>Contact Us</Link>
              <Link href="/about" className="text-sm text-gray-500 block" onClick={toggleMenu}>About Nandani</Link>
            </div>
          </nav>
        </div>
      </div>

    </nav>
  );
};

export default Header;