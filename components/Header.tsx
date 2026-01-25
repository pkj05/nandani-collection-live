import Link from "next/link";
import { Search, ShoppingBag, Heart, Menu } from "lucide-react";

const Header = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      
      {/* 1. TOP ANNOUNCEMENT BAR (Premium Pink) */}
      <div className="bg-primary text-primary-foreground text-xs py-2 text-center tracking-wide font-medium">
        Free Shipping on orders above ₹1499 | Easy Returns
      </div>

      {/* 2. MAIN NAVIGATION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* LEFT: Mobile Menu & Desktop Links */}
          <div className="flex items-center gap-6">
            {/* Mobile Menu Icon (Hidden on Desktop) */}
            <button className="md:hidden p-2 text-gray-600">
              <Menu size={24} />
            </button>

            {/* Desktop Links (Hidden on Mobile) */}
            <div className="hidden md:flex gap-8 text-sm font-medium text-gray-800 tracking-wide">
              <Link href="/suits" className="hover:text-primary transition-colors uppercase">Suits</Link>
              <Link href="/sarees" className="hover:text-primary transition-colors uppercase">Sarees</Link>
              <Link href="/kurtis" className="hover:text-primary transition-colors uppercase">Kurtis</Link>
            </div>
          </div>

          {/* CENTER: LOGO (Royal Playfair Font) */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-3xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight hover:opacity-80 transition-opacity">
              Nandani
            </Link>
          </div>

          {/* RIGHT: ICONS (Search, Wishlist, Cart) */}
          <div className="flex items-center gap-4 md:gap-6">
            <button className="p-2 text-gray-700 hover:text-primary transition-colors">
              <Search size={20} strokeWidth={1.5} />
            </button>
            <button className="hidden md:block p-2 text-gray-700 hover:text-primary transition-colors">
              <Heart size={20} strokeWidth={1.5} />
            </button>
            <button className="p-2 relative text-gray-700 hover:text-primary transition-colors">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {/* Cart Badge */}
              <span className="absolute top-0 right-0 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                0
              </span>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Header;