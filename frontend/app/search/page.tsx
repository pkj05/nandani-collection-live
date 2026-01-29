"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, Loader2, SearchX, ChevronDown } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || ""; 
  
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]); // Filtered data ke liye
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  // Price Filter State
  const [priceFilters, setPriceFilters] = useState({
    under2500: false,
    above2500: false
  });

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
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

  // Price Filter Logic
  useEffect(() => {
    let updatedList = [...products];
    if (priceFilters.under2500 || priceFilters.above2500) {
      updatedList = products.filter((p) => {
        if (priceFilters.under2500 && p.selling_price >= 500 && p.selling_price <= 2500) return true;
        if (priceFilters.above2500 && p.selling_price > 2500) return true;
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
      <p className="font-serif text-gray-400 italic">Searching for "{query}"...</p>
    </div>
  );

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      <div className="bg-gray-50 py-12 text-center">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">Search Results</h1>
        <p className="text-gray-500 text-sm italic">Results for: <span className="text-primary font-bold">"{query}"</span></p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 flex flex-col md:flex-row gap-12">
        
        {/* Left Side Sidebar Filters */}
        <div className="hidden md:block w-64 space-y-8 flex-shrink-0">
          <div>
            <h3 className="font-serif font-bold text-lg mb-4 flex items-center justify-between border-b pb-2">
              Price Range <ChevronDown size={16} />
            </h3>
            <div className="space-y-3 text-gray-600 text-sm mt-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-primary" 
                  checked={priceFilters.under2500}
                  onChange={() => handleFilterChange('under2500')}
                /> 
                ₹500 - ₹2500
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-primary" 
                  checked={priceFilters.above2500}
                  onChange={() => handleFilterChange('above2500')}
                /> 
                Above ₹2500
              </label>
            </div>
          </div>
        </div>

        {/* Right Side Product Grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center gap-4">
              <SearchX size={64} className="text-gray-200" />
              <p className="text-gray-400 font-serif text-xl italic">Maaf kijiye! Koi matching product nahi mila.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group flex flex-col">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-50 mb-4 shadow-sm">
                    <Link href={`/product/${product.id}`}>
                      <img src={product.thumbnail} alt={product.name} className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${product.stock <= 0 ? 'grayscale opacity-70' : ''}`} />
                    </Link>
                    {product.stock > 0 && (
                      <div className="absolute bottom-4 left-4 right-4 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-500">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            addItem({ id: product.id, name: product.name, price: `₹${product.selling_price}`, image: product.thumbnail, size: product.size || "Free Size", color: product.color || "Multi", quantity: 1 });
                          }}
                          className="w-full bg-white text-gray-900 py-3 rounded-xl shadow-xl font-bold text-xs uppercase hover:bg-black hover:text-white transition-all"
                        >
                          <ShoppingBag size={14} /> Add to Cart
                        </button>
                      </div>
                    )}
                  </div>
                  <Link href={`/product/${product.id}`} className="space-y-1">
                    <h3 className="font-serif text-lg text-gray-900 line-clamp-1">{product.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                       <p className="text-primary font-bold text-lg">₹{product.selling_price.toLocaleString()}</p>
                       <p className="text-gray-400 line-through text-xs italic">₹{product.original_price.toLocaleString()}</p>
                    </div>
                  </Link>
                </div>
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={48} /></div>}>
      <SearchContent />
    </Suspense>
  );
}