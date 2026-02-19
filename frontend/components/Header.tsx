"use client";

import Link from "next/link";
import Image from "next/image"; 
import { Search, ShoppingBag, Heart, Menu, X, User, LogOut, ChevronRight, UserCircle } from "lucide-react"; 
import { useState, useEffect, useRef } from "react"; 
import { useRouter, usePathname } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); 
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const { user, logout } = useAuth();
  const cart = useCartStore((state: any) => state.cart);
  const toggleCart = useCartStore((state: any) => state.toggleCart);
  const cartCount = cart ? cart.reduce((acc: number, item: any) => acc + item.quantity, 0) : 0;

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    closeEverything();
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ IMPROVED IMAGE FIXER: HTTPS fix to prevent 400 errors
  const getImageUrl = (item: any) => {
    let path = item.thumbnail;
    if (!path && item.variants && item.variants.length > 0) {
      const firstVariant = item.variants[0];
      if (firstVariant.images && firstVariant.images.length > 0) {
        path = firstVariant.images[0].image; 
      }
    }
    if (!path || path === "null") return "https://placehold.co/100x150?text=No+Image";
    
    let finalPath = path.replace("http://", "https://");
    if (finalPath.startsWith("http")) return finalPath;
    
    const cleanPath = finalPath.startsWith("/") ? finalPath : `/${finalPath}`;
    let baseUrl = API_URL?.replace("http://", "https://");
    baseUrl = baseUrl?.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    
    return `${baseUrl}${cleanPath}`;
  };

  const getPrice = (item: any) => {
    return Number(item.selling_price || item.price || item.base_price || 0);
  };

  useEffect(() => {
    const shouldDisable = isSearchOpen || isMenuOpen;
    document.body.style.overflow = shouldDisable ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isSearchOpen, isMenuOpen]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/api/shop/categories`);
        if (response.ok) {
            const data = await response.json();
            setCategories(data);
        }
      } catch (error) { console.error("Category fetch failed"); }
    };
    fetchCategories();
  }, [API_URL]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await fetch(`${API_URL}/api/shop/products?search=${encodeURIComponent(searchTerm)}`);
        if (response.ok) {
            const data = await response.json();
            setSuggestions(data.slice(0, 5)); 
        }
      } catch (error) { console.error(error); }
    };
    const timer = setTimeout(fetchSuggestions, 300); 
    return () => clearTimeout(timer);
  }, [searchTerm, API_URL]);

  const closeEverything = () => {
    setIsSearchOpen(false);
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
    setSearchTerm("");
    setSuggestions([]);
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      closeEverything();
    }
  };

  const iconBtnClass = "w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-100 text-gray-700 transition-all active:scale-95";

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 font-sans">
      <div className="bg-[#8B3E48] text-white text-[10px] py-1 text-center font-bold uppercase tracking-widest">
        Free Shipping on orders above ₹1499
      </div>

      <div className="max-w-7xl mx-auto px-4 h-14 flex justify-between items-center bg-white">
        <div className="flex items-center gap-4">
          {/* ✅ Accessibility Fix: aria-label added */}
          <button 
            className={`md:hidden ${iconBtnClass}`} 
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open Mobile Menu"
          >
            <Menu size={18} />
          </button>
          <div className="hidden md:flex gap-6 text-[11px] font-black text-gray-500 uppercase tracking-tighter">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/${cat.name.toLowerCase()}`} className="hover:text-[#8B3E48] transition-colors">
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        <Link href="/" className="text-2xl font-serif font-bold text-gray-900 tracking-tight">Nandani</Link>

        <div className="flex items-center gap-2 md:gap-3">
          {/* ✅ Accessibility Fix: aria-label added */}
          <button 
            className={iconBtnClass} 
            onClick={() => setIsSearchOpen(true)}
            aria-label="Open Search"
          >
            <Search size={18} />
          </button>

          <div className="relative" ref={userMenuRef}>
            {user ? (
              <button 
                className={`${iconBtnClass} ${isUserMenuOpen ? 'border-primary' : ''}`} 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                aria-label="User Account Menu"
              >
                <User size={18} className={isUserMenuOpen ? "text-primary" : "text-gray-700"} />
              </button>
            ) : (
              <Link href="/login" className={iconBtnClass} aria-label="Login to your account">
                <User size={18} />
              </Link>
            )}

            {isUserMenuOpen && user && (
              <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 shadow-2xl rounded-2xl py-3 z-50 animate-in fade-in zoom-in duration-150 origin-top-right">
                <div className="px-5 py-3 border-b border-gray-50 mb-2">
                  <p className="text-[9px] text-gray-400 uppercase font-black tracking-[0.2em] mb-1">Authenticated</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{user.full_name || "Guest User"}</p>
                </div>
                
                <Link href="/profile" className="flex items-center justify-between px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  My Profile <UserCircle size={14} className="text-gray-300" />
                </Link>

                <Link href="/orders" className="flex items-center justify-between px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  My Orders <ChevronRight size={14} className="text-gray-300" />
                </Link>

                <button 
                  onClick={() => { logout(); closeEverything(); }}
                  className="w-full mt-2 flex items-center gap-3 px-5 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors border-t border-gray-50"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={toggleCart} 
            className={`${iconBtnClass} relative`}
            aria-label={`View shopping bag with ${cartCount} items`}
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#8B3E48] text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* SEARCH OVERLAY */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col p-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3 mb-6">
            <form onSubmit={handleSearch} className="flex-1 bg-gray-100 p-3 rounded-xl flex items-center">
              <Search className="text-gray-400 mr-2" size={18} />
              <input 
                autoFocus 
                type="text" 
                placeholder="Search premium ethnic wear..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-900 font-medium" 
              />
            </form>
            <button onClick={closeEverything} className="p-2 text-[#8B3E48] font-black uppercase text-[10px] tracking-widest">Close</button>
          </div>

          {suggestions.length > 0 && (
            <div className="flex flex-col gap-4 overflow-y-auto">
              {suggestions.map((item) => (
                <Link key={item.id} href={`/product/${item.id}`} onClick={closeEverything} className="flex items-center gap-4 border-b border-gray-50 pb-4">
                  <div className="relative w-14 h-20 flex-shrink-0">
                    <Image 
                      src={getImageUrl(item)} 
                      alt={item.name} 
                      fill 
                      sizes="60px" 
                      quality={60} // ✅ Quality optimized for small suggestions
                      className="object-cover rounded-xl shadow-sm" 
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</p>
                    <p className="text-xs font-black text-[#8B3E48] mt-1">₹{getPrice(item).toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* MOBILE MENU */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden z-[100] ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`} 
        onClick={() => setIsMenuOpen(false)}
      ></div>
      
      <div 
        className={`fixed top-0 left-0 h-full w-[300px] bg-white z-[101] shadow-2xl transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) md:hidden ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-8 h-full flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-serif font-bold text-gray-900">Nandani</h2>
            <button onClick={() => setIsMenuOpen(false)} aria-label="Close Sidebar" className="p-2 bg-gray-50 rounded-full text-gray-900">
              <X size={20} />
            </button>
          </div>
          
          <nav className="flex flex-col space-y-1 overflow-y-auto">
            {user && (
              <div className="bg-[#8B3E48]/5 p-5 rounded-[2rem] mb-6 border border-[#8B3E48]/10">
                <p className="text-[9px] text-[#8B3E48] uppercase font-black tracking-widest mb-1">Membership Active</p>
                <p className="text-lg font-bold text-gray-900 truncate">{user.full_name}</p>
                <Link href="/profile" className="text-xs text-[#8B3E48] font-black underline mt-2 block uppercase tracking-widest" onClick={() => setIsMenuOpen(false)}>
                    Edit Profile
                </Link>
              </div>
            )}

            <Link href="/" className="text-xl font-bold text-gray-900 py-4 border-b border-gray-50 flex items-center justify-between" onClick={() => setIsMenuOpen(false)}>
              Home <ChevronRight size={16} className="text-gray-300" />
            </Link>

            <Link href="/orders" className="text-xl font-bold text-gray-900 py-4 border-b border-gray-50 flex items-center justify-between" onClick={() => setIsMenuOpen(false)}>
              My Orders <ChevronRight size={16} className="text-gray-300" />
            </Link>
            
            {categories.map((cat) => (
              <Link 
                key={cat.id} 
                href={`/${cat.name.toLowerCase()}`} 
                className="text-lg font-medium text-gray-600 uppercase py-4 border-b border-gray-50 flex items-center justify-between" 
                onClick={() => setIsMenuOpen(false)}
              >
                {cat.name} <ChevronRight size={14} className="text-gray-200" />
              </Link>
            ))}
            
            <div className="pt-10 mt-auto pb-8">
              {user ? (
                 <button 
                 onClick={() => { logout(); closeEverything(); }}
                 className="w-full bg-red-50 text-red-500 py-4 rounded-2xl font-black text-sm tracking-widest flex items-center justify-center gap-2"
               >
                 <LogOut size={18} /> LOGOUT
               </button>
              ) : (
                <Link 
                  href="/login" 
                  className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-sm tracking-widest text-center block" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  LOGIN / SIGNUP
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default Header;