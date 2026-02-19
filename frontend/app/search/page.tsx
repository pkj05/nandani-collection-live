"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; 
import { ShoppingBag, Loader2, SearchX, ChevronDown } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { getProducts } from "@/lib/api";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || ""; 
  
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const addItem = useCartStore((state: any) => state.addItem);
  const API_URL = process.env.NEXT_PUBLIC_API_URL; 

  // ✅ ENHANCED IMAGE FIXER: Deep search logic with detailed logging
  const getImageUrl = (item: any) => {
    // 1. Sabhi possible backend keys ko check karein
    let rawPath = item.thumbnail || item.image || item.product_image || item.img_url;
    
    // 2. Agar thumbnail nahi hai, to variants me deep search karein
    if (!rawPath && item.variants?.length > 0) {
      const firstVar = item.variants[0];
      // Variants ke andar image object ya string dono handle karein
      const imgData = firstVar.images?.[0] || firstVar.image;
      rawPath = typeof imgData === 'object' ? imgData.image : imgData;
    }
    
    // 3. Garbage values ya undefined handle karein
    if (!rawPath || rawPath === "null" || rawPath === "undefined" || rawPath.toString().length < 2) {
      console.warn(`[Image Warning] Missing path for: ${item.name}`, { item });
      // .png extension fix for placehold.co (Next.js 400 error fix)
      return "https://placehold.co/600x800.png?text=Nandani+Collection";
    }
    
    let finalUrl = "";
    let finalPath = rawPath.toString().replace("http://", "https://");
    
    if (finalPath.startsWith("http")) {
      finalUrl = finalPath;
    } else {
      const cleanPath = finalPath.startsWith("/") ? finalPath : `/${finalPath}`;
      let baseUrl = API_URL?.replace("http://", "https://");
      baseUrl = baseUrl?.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      finalUrl = `${baseUrl}${cleanPath}`;
    }

    return finalUrl;
  };

  const getPrice = (product: any) => {
    return Number(product.selling_price || product.price || product.base_price || 0);
  };

  const getOriginalPrice = (product: any) => {
    const p = Number(product.original_price || product.mrp || 0);
    return p > getPrice(product) ? p : null;
  };

  const [priceFilters, setPriceFilters] = useState({ under2500: false, above2500: false });

  // FETCH LOGIC
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) { setProducts([]); setLoading(false); return; }
      try {
        setLoading(true);
        const data = await getProducts(undefined, query);
        console.log("[Search Debug] API Full Response:", data);
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) { 
        console.error("[Search Error] Fetch failed:", error); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchSearchResults();
  }, [query, API_URL]);

  // FILTER LOGIC
  useEffect(() => {
    let updatedList = [...products];
    if (priceFilters.under2500 || priceFilters.above2500) {
      updatedList = products.filter((p) => {
        const price = getPrice(p);
        const matchUnder = priceFilters.under2500 && price >= 500 && price <= 2500;
        const matchAbove = priceFilters.above2500 && price > 2500;
        return matchUnder || matchAbove;
      });
    }
    setFilteredProducts(updatedList);
  }, [priceFilters, products]);

  const handleFilterChange = (filterName: string) => {
    setPriceFilters((prev) => ({ ...prev, [filterName]: !prev[filterName as keyof typeof priceFilters] }));
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-white">
      <Loader2 className="animate-spin text-[#8B3E48]" size={48} />
      <p className="font-serif text-gray-400 italic">Searching for "{query}"...</p>
    </div>
  );

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      <div className="bg-gray-50 py-12 text-center border-b">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">Search Results</h1>
        <p className="text-gray-300 text-sm italic font-medium tracking-wide uppercase">
          Results for: <span className="text-[#8B3E48] font-extrabold italic">"{query}"</span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 flex flex-col md:flex-row gap-12">
        {/* Sidebar Filters */}
        <div className="hidden md:block w-64 space-y-8 flex-shrink-0">
          <div className="sticky top-24">
            <h3 className="font-serif font-bold text-lg mb-4 flex items-center justify-between border-b border-gray-100 pb-2">Price Range <ChevronDown size={16} /></h3>
            <div className="space-y-4 text-gray-600 text-sm mt-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#8B3E48] focus:ring-[#8B3E48] cursor-pointer" checked={priceFilters.under2500} onChange={() => handleFilterChange('under2500')} /> 
                <span className="group-hover:text-gray-900 transition-colors">₹500 - ₹2500</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#8B3E48] focus:ring-[#8B3E48] cursor-pointer" checked={priceFilters.above2500} onChange={() => handleFilterChange('above2500')} /> 
                <span className="group-hover:text-gray-900 transition-colors">Above ₹2500</span>
              </label>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center gap-4">
              <SearchX size={64} className="text-gray-100" />
              <p className="text-gray-400 font-serif text-xl italic">Maaf kijiye! Hamen is search ke liye koi matching product nahi mila.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-12">
              {filteredProducts.map((product, index) => {
                const finalPrice = getPrice(product);
                const originalPrice = getOriginalPrice(product);
                const imageUrl = getImageUrl(product);

                return (
                  <div key={`${product.id}-${index}`} className="group flex flex-col animate-fade-in">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-50 mb-4 shadow-sm">
                      <Link href={`/product/${product.id}`} className="block w-full h-full">
                        <Image 
                          src={imageUrl} 
                          alt={product.name} 
                          fill
                          sizes="(max-width: 768px) 50vw, 33vw"
                          className={`object-cover transition-transform duration-1000 group-hover:scale-110 ${product.stock <= 0 ? 'grayscale opacity-70' : ''}`} 
                          priority={index < 4}
                          onError={() => {
                            console.error(`[Image Error] Failed to load: ${imageUrl}`);
                          }}
                        />
                      </Link>
                      
                      {product.stock > 0 && (
                        <div className="absolute bottom-4 left-4 right-4 translate-y-[120%] group-hover:translate-y-0 transition-all duration-500 hidden md:block z-20">
                          <button 
                            onClick={(e) => { 
                              e.preventDefault(); 
                              addItem({ ...product, price: finalPrice, image: imageUrl, quantity: 1 }); 
                            }}
                            className="w-full bg-white/95 backdrop-blur-sm text-gray-900 py-3 rounded-xl shadow-xl font-bold text-[10px] uppercase hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
                          > 
                            <ShoppingBag size={14} /> Add to Cart 
                          </button>
                        </div>
                      )}
                    </div>

                    <Link href={`/product/${product.id}`} className="space-y-1 px-1">
                      <h3 className="font-serif text-base md:text-lg text-gray-900 line-clamp-1 group-hover:text-[#8B3E48] transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 font-sans">
                        <p className="text-[#8B3E48] font-bold">₹{finalPrice.toLocaleString()}</p>
                        {originalPrice && (
                          <p className="text-gray-400 line-through text-[11px] italic decoration-[#8B3E48]/30">
                            ₹{originalPrice.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <Loader2 className="animate-spin text-[#8B3E48]" size={48} />
        <p className="text-sm text-gray-400 animate-pulse font-serif italic">Loading Nandanis Favorites...</p>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}