"use client";

import Link from "next/link";
import { Search, ShoppingBag, Heart, Menu, X, Loader2 } from "lucide-react"; 
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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const cart = useCartStore((state) => state.cart);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Keyboard dismiss logic: Sirf mobile par aur 2 sec wait ke baad
  const dismissKeyboardWithDelay = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setTimeout(() => {
        (document.activeElement as HTMLElement)?.blur();
      }, 2000); // 2 Seconds ka wait
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
        const response = await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/categories");
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
        
        // Laptop par kuck nahi hoga, mobile par 2 sec baad keyboard jayega
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
    setShowSuggestions(false);
  };

  // Search Submit Handler
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      closeEverything();
      // Keyboard ko turant band karein jab search page par jayein
      (document.activeElement as HTMLElement)?.blur();
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      
      {/* TOP ANNOUNCEMENT BAR */}
      <div className="bg-primary text-primary-foreground text-xs py-2 text-center tracking-wide font-medium">
        Free Shipping on orders above ₹1499 | Easy Returns
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
        
        {/* LEFT: Menu & Desktop Links */}
        <div className="flex items-center gap-6">
          <button className="md:hidden p-2 text-gray-600 rounded-full" onClick={() => setIsMenuOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-800 uppercase tracking-wide">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/${cat.name.toLowerCase()}`} className="hover:text-primary transition-colors">{cat.name}</Link>
            ))}
          </div>
        </div>

        {/* CENTER: LOGO */}
        <Link href="/" className="text-3xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight">Nandani</Link>

        {/* RIGHT: ICONS */}
        <div className="flex items-center gap-4 md:gap-6">
          <button className="p-2 text-gray-700 hover:text-primary" onClick={() => setIsSearchOpen(true)}>
            <Search size={22} />
          </button>
          <button className="hidden md:block p-2 text-gray-700 hover:text-primary"><Heart size={20} /></button>
          <button onClick={toggleCart} className="p-2 relative text-gray-700 hover:text-primary transition-transform active:scale-90">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full animate-in zoom-in">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* --- REFINED APPLE-STYLE SEARCH OVERLAY --- */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center p-4 pt-10 animate-in fade-in duration-300">
          {/* Backdrop click to close */}
          <div className="absolute inset-0 bg-black/5 backdrop-blur-md" onClick={closeEverything}></div>
          
          <div ref={suggestionRef} className="relative w-full max-w-[95%] md:max-w-2xl z-10 flex flex-col gap-4">
            
            {/* Search Input with Clear Button Logic */}
            <div className="flex items-center gap-3 bg-white/90 backdrop-blur-2xl p-2 rounded-2xl shadow-xl border border-white/40 w-full">
              <Search className="ml-3 text-gray-400" size={18} />
              <form onSubmit={handleSearch} className="flex-1">
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Search designer suits, sarees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent py-2 outline-none text-gray-900 placeholder:text-gray-400"
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

            {/* Results Box with functional 'View All' */}
            {searchTerm.length >= 2 && suggestions.length > 0 && (
              <div className="w-full bg-white/70 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden animate-in slide-in-from-top-4 duration-500">
                <div className="max-h-[50vh] overflow-y-auto custom-scrollbar">
                  <div className="p-3 bg-black/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Matches Found</div>
                  {suggestions.map((item) => (
                    <Link
                      key={item.id}
                      href={`/product/${item.id}`}
                      onClick={closeEverything}
                      className="flex items-center gap-4 p-4 hover:bg-white/50 border-b border-black/5 last:border-0 transition-colors"
                    >
                      <img src={item.thumbnail} className="w-12 h-16 object-cover rounded-lg shadow-sm" />
                      <div>
                        <p className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</p>
                        <p className="text-xs text-primary font-bold mt-1">₹{item.selling_price.toLocaleString()}</p>
                      </div>
                    </Link>
                  ))}
                  {/* View All Button - Fixed Link Functionality */}
                  <button 
                    onClick={() => handleSearch()} 
                    className="w-full py-4 bg-primary/10 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all border-t border-black/5"
                  >
                    View All Results for "{searchTerm}"
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- MOBILE SIDE MENU --- */}
      <div className={`fixed inset-0 bg-black/50 transition-opacity duration-300 md:hidden z-[55] ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} onClick={() => setIsMenuOpen(false)}></div>
      <div className={`fixed top-0 left-0 h-full w-80 bg-white z-[60] shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-serif font-bold text-gray-900">Nandani</h2>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 text-gray-500 rounded-full"><X size={24} /></button>
          </div>
          <nav className="flex flex-col space-y-6">
            <Link href="/" className="text-lg font-medium text-gray-800" onClick={() => setIsMenuOpen(false)}>Home</Link>
            {categories.map((cat) => (
              <Link key={cat.id} href={`/${cat.name.toLowerCase()}`} className="text-lg font-medium text-gray-800 uppercase" onClick={() => setIsMenuOpen(false)}>{cat.name}</Link>
            ))}
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default Header;