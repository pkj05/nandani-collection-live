"use client";

import Link from "next/link";
import { Search, ShoppingBag, Heart, Menu, X } from "lucide-react"; 
import { useState, useEffect, useRef } from "react"; 
import { useRouter } from "next/navigation"; 
import { useCartStore } from "@/store/useCartStore";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); 
  const router = useRouter();
  const suggestionRef = useRef<HTMLDivElement>(null);
  
  // --- States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const cart = useCartStore((state) => state.cart);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Keyboard dismiss logic
  const dismissKeyboardWithDelay = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setTimeout(() => {
        (document.activeElement as HTMLElement)?.blur();
      }, 2000); 
    }
  };

  // Background Scroll Lock
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isSearchOpen]);

  // Categories Fetch
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
        const data = await response.json();
        setCategories(data);
      } catch (error) { console.error("Header categories fetch error:", error); }
    };
    fetchCategories();
  }, []);

  // Live Suggestions logic
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        setIsSearching(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?search=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        setSuggestions(data.slice(0, 5)); 
        if (data.length > 0) dismissKeyboardWithDelay();
      } catch (error) { console.error(error); }
      finally { setIsSearching(false); }
    };

    const timer = setTimeout(fetchSuggestions, 300); 
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const closeEverything = () => {
    setIsSearchOpen(false);
    setSearchTerm("");
    setSuggestions([]);
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      closeEverything();
      (document.activeElement as HTMLElement)?.blur();
    }
  };

  // --- APPLE STYLE ICON CLASS ---
  // White bg, subtle border, soft shadow, hover pop effect
  const iconBtnClass = "w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-gray-700 transition-all duration-300 hover:scale-110 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:text-black active:scale-95";

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100/50">
      
      {/* TOP ANNOUNCEMENT BAR (Sleeker) */}
      <div className="bg-[#8B3E48] text-white text-[10px] py-1 text-center tracking-widest font-medium uppercase">
        Free Shipping on orders above ₹1499
      </div>

      {/* MAIN HEADER (Height reduced to h-14 = 56px) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex justify-between items-center">
        
        {/* LEFT: Menu & Desktop Links */}
        <div className="flex items-center gap-4">
          <button className={`md:hidden ${iconBtnClass}`} onClick={() => setIsMenuOpen(true)}>
            <Menu size={18} />
          </button>
          
          <div className="hidden md:flex gap-6 text-xs font-bold text-gray-600 uppercase tracking-widest">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/${cat.name.toLowerCase()}`} className="hover:text-black transition-colors relative group">
                {cat.name}
                <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-black transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </div>
        </div>

        {/* CENTER: LOGO (Size Adjusted) */}
        <Link href="/" className="text-2xl md:text-3xl font-serif font-bold text-gray-900 tracking-tight">
            Nandani
        </Link>

        {/* RIGHT: 3D ICONS */}
        <div className="flex items-center gap-3">
          <button className={iconBtnClass} onClick={() => setIsSearchOpen(true)}>
            <Search size={18} />
          </button>
          
          <button className={`hidden md:flex ${iconBtnClass}`}>
            <Heart size={18} />
          </button>
          
          <button onClick={toggleCart} className={`${iconBtnClass} relative`}>
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#8B3E48] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm animate-in zoom-in border border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* --- REFINED SEARCH OVERLAY --- */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center p-4 pt-10 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-white/60 backdrop-blur-xl" onClick={closeEverything}></div>
          
          <div ref={suggestionRef} className="relative w-full max-w-[95%] md:max-w-2xl z-10 flex flex-col gap-4">
            
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-xl p-2 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/50 w-full">
              <Search className="ml-3 text-gray-400" size={18} />
              <form onSubmit={handleSearch} className="flex-1">
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Search designer suits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent py-2 outline-none text-gray-900 placeholder:text-gray-400 font-medium"
                />
              </form>
              <button 
                onClick={() => { 
                  if (searchTerm) { setSearchTerm(""); setSuggestions([]); } 
                  else closeEverything(); 
                }} 
                className="p-1 hover:bg-black/5 rounded-full"
              >
                <X size={20} className="text-gray-900" />
              </button>
            </div>

            {/* Results Box */}
            {searchTerm.length >= 2 && suggestions.length > 0 && (
              <div className="w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden animate-in slide-in-from-top-4 duration-500">
                <div className="max-h-[50vh] overflow-y-auto custom-scrollbar">
                  <div className="p-3 bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Matches Found</div>
                  {suggestions.map((item) => (
                    <Link
                      key={item.id}
                      href={`/product/${item.id}`}
                      onClick={closeEverything}
                      className="flex items-center gap-4 p-3 hover:bg-white border-b border-gray-100 last:border-0 transition-colors"
                    >
                      <img src={item.thumbnail} className="w-10 h-14 object-cover rounded-md shadow-sm" />
                      <div>
                        <p className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</p>
                        <p className="text-xs text-[#8B3E48] font-bold mt-0.5">₹{item.selling_price.toLocaleString()}</p>
                      </div>
                    </Link>
                  ))}
                  <button 
                    onClick={() => handleSearch()} 
                    className="w-full py-4 bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-900 hover:bg-gray-100 transition-all border-t border-gray-100"
                  >
                    View All Results
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- MOBILE MENU --- */}
      <div className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 md:hidden z-[55] ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} onClick={() => setIsMenuOpen(false)}></div>
      <div className={`fixed top-0 left-0 h-full w-80 bg-white z-[60] shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-serif font-bold text-gray-900">Nandani</h2>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"><X size={20} /></button>
          </div>
          <nav className="flex flex-col space-y-4">
            <Link href="/" className="text-lg font-bold text-gray-900" onClick={() => setIsMenuOpen(false)}>Home</Link>
            {categories.map((cat) => (
              <Link key={cat.id} href={`/${cat.name.toLowerCase()}`} className="text-lg font-medium text-gray-600 hover:text-black uppercase" onClick={() => setIsMenuOpen(false)}>{cat.name}</Link>
            ))}
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default Header;