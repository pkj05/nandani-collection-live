"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, SearchX, ChevronDown } from "lucide-react";
import ProductCard from "@/components/ProductCard"; // Naya ProductCard use karein

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || ""; 
  
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Price Filter State
  const [priceFilters, setPriceFilters] = useState({
    under2500: false,
    above2500: false
  });

  // 1. Fetch Search Results
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Naya API call jo search aur variants handle karta hai
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?search=${query}`);
        const data = await response.json();
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

  // 2. Updated Price Filter Logic (Base Price ke hisaab se)
  useEffect(() => {
    let updatedList = [...products];
    if (priceFilters.under2500 || priceFilters.above2500) {
      updatedList = products.filter((p) => {
        const price = Number(p.base_price);
        if (priceFilters.under2500 && price >= 500 && price <= 2500) return true;
        if (priceFilters.above2500 && price > 2500) return true;
        return false;
      });
    }
    setFilteredProducts(updatedList);
  }, [priceFilters, products]);

  const handleFilterChange = (filterName: string) => {
    setPriceFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName as keyof typeof priceFilters]
    }));
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-white">
      <Loader2 className="animate-spin text-primary" size={48} />
      <p className="font-serif text-gray-400 italic tracking-widest uppercase text-xs">Searching designs...</p>
    </div>
  );

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      <div className="bg-gray-50/50 py-16 text-center border-b border-gray-100">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4 tracking-tight">Search Results</h1>
        <p className="text-gray-400 text-sm font-medium tracking-widest uppercase italic">
          Found {filteredProducts.length} results for: <span className="text-primary italic">"{query}"</span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 flex flex-col md:flex-row gap-12">
        
        {/* LEFT: Sidebar Filters (Preserved) */}
        <div className="md:w-64 space-y-8 flex-shrink-0">
          <div className="sticky top-24 border border-gray-100 p-6 rounded-3xl bg-gray-50/30">
            <h3 className="font-serif font-bold text-lg mb-6 flex items-center justify-between border-b border-gray-200 pb-3">
              Price Range <ChevronDown size={14} className="text-gray-400" />
            </h3>
            <div className="space-y-4 text-gray-600 text-sm">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" 
                  checked={priceFilters.under2500}
                  onChange={() => handleFilterChange('under2500')}
                /> 
                <span className="group-hover:text-black transition-colors font-medium">₹500 - ₹2,500</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" 
                  checked={priceFilters.above2500}
                  onChange={() => handleFilterChange('above2500')}
                /> 
                <span className="group-hover:text-black transition-colors font-medium">Above ₹2,500</span>
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT: Product Grid (Modified to use ProductCard) */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-24 flex flex-col items-center gap-6">
              <div className="bg-gray-50 p-8 rounded-full">
                <SearchX size={64} className="text-gray-200" strokeWidth={1} />
              </div>
              <p className="text-gray-400 font-serif text-xl italic">Maaf kijiye! Aapki search ke liye koi design nahi mila.</p>
              <Link href="/" className="bg-gray-900 text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary transition-all">
                Browse Collection
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-primary" size={48} /></div>}>
      <SearchContent />
    </Suspense>
  );
}