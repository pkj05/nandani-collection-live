"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, Loader2, SearchX, ChevronDown } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
// ✅ lib/api से सेंट्रल फंक्शन इम्पोर्ट किया
import { getProducts } from "@/lib/api";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || ""; 
  
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const addItem = useCartStore((state: any) => state.addItem);
  const API_URL = process.env.NEXT_PUBLIC_API_URL; 

  // ✅ IMAGE FIXER: Backend path ko full URL me badalne ke liye
  const getImageUrl = (item: any) => {
    let path = item.thumbnail;
    if (!path && item.variants && item.variants.length > 0) {
      const firstVariant = item.variants[0];
      if (firstVariant.images && firstVariant.images.length > 0) {
        path = firstVariant.images[0].image || firstVariant.images[0];
      }
    }
    if (!path) return "https://placehold.co/600x800?text=No+Image";
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const baseUrl = API_URL?.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    return `${baseUrl}${cleanPath}`;
  };

  const getPrice = (product: any) => {
    return Number(product.selling_price || product.price || product.base_price || 0);
  };

  const getOriginalPrice = (product: any) => {
    const p = Number(product.original_price || product.mrp || 0);
    return p > getPrice(product) ? p : null;
  };

  const [priceFilters, setPriceFilters] = useState({ under2500: false, above2500: false });

  // ✅ FETCH LOGIC UPDATED TO USE lib/api.ts
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) { setProducts([]); setLoading(false); return; }
      try {
        setLoading(true);
        // ✅ Centralized getProducts function use kiya (Query parameters ke saath)
        const data = await getProducts(undefined, query);
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) { 
        console.error("Search fetch error:", error); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchSearchResults();
  }, [query]);

  useEffect(() => {
    let updatedList = [...products];
    if (priceFilters.under2500 || priceFilters.above2500) {
      updatedList = products.filter((p) => {
        const price = getPrice(p);
        if (priceFilters.under2500 && price >= 500 && price <= 2500) return true;
        if (priceFilters.above2500 && price > 2500) return true;
        return false;
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
      <div className="bg-gray-50 py-12 text-center">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">Search Results</h1>
        <p className="text-gray-500 text-sm italic">Results for: <span className="text-[#8B3E48] font-bold">"{query}"</span></p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 flex flex-col md:flex-row gap-12">
        <div className="hidden md:block w-64 space-y-8 flex-shrink-0">
          <div>
            <h3 className="font-serif font-bold text-lg mb-4 flex items-center justify-between border-b pb-2">Price Range <ChevronDown size={16} /></h3>
            <div className="space-y-3 text-gray-600 text-sm mt-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-[#8B3E48]" checked={priceFilters.under2500} onChange={() => handleFilterChange('under2500')} /> ₹500 - ₹2500
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-[#8B3E48]" checked={priceFilters.above2500} onChange={() => handleFilterChange('above2500')} /> Above ₹2500
              </label>
            </div>
          </div>
        </div>

        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center gap-4">
              <SearchX size={64} className="text-gray-200" />
              <p className="text-gray-400 font-serif text-xl italic">Maaf kijiye! Koi matching product nahi mila.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-12">
              {filteredProducts.map((product) => {
                const finalPrice = getPrice(product);
                const originalPrice = getOriginalPrice(product);
                const imageUrl = getImageUrl(product);

                return (
                  <div key={product.id} className="group flex flex-col">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-50 mb-4 shadow-sm">
                      <Link href={`/product/${product.id}`}>
                        <img 
                            src={imageUrl} 
                            alt={product.name} 
                            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${product.stock <= 0 ? 'grayscale opacity-70' : ''}`} 
                            onError={(e) => { 
                                e.currentTarget.src = "https://placehold.co/600x800?text=No+Image"; 
                            }} 
                        />
                      </Link>
                      {product.stock > 0 && (
                        <div className="absolute bottom-4 left-4 right-4 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-500 hidden md:block">
                          <button onClick={(e) => { e.preventDefault(); addItem({ ...product, price: finalPrice, image: imageUrl, quantity: 1 }); }}
                            className="w-full bg-white text-gray-900 py-3 rounded-xl shadow-xl font-bold text-xs uppercase hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
                          > <ShoppingBag size={14} /> Add to Cart </button>
                        </div>
                      )}
                    </div>
                    <Link href={`/product/${product.id}`} className="space-y-1 px-1">
                      <h3 className="font-serif text-base md:text-lg text-gray-900 line-clamp-1">{product.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                          <p className="text-[#8B3E48] font-bold">₹{finalPrice.toLocaleString()}</p>
                          {originalPrice && <p className="text-gray-400 line-through text-xs italic">₹{originalPrice.toLocaleString()}</p>}
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#8B3E48]" size={48} /></div>}>
      <SearchContent />
    </Suspense>
  );
}
