"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronDown, ShoppingBag, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function CategoryPage() {
  const params = useParams();
  const categoryname = params.categoryname as string; 
  
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]); // Filtered data dikhane ke liye
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("");
  
  // 1. Price Range State: Kaun sa checkbox select hai
  const [priceFilters, setPriceFilters] = useState({
    under2500: false,
    above2500: false
  });

  const addItem = useCartStore((state) => state.addItem);

  // Backend se data mangana
  useEffect(() => {
    const fetchProducts = async () => {
      if (!categoryname) return;
      try {
        setLoading(true);
        const response = await fetch(`http://192.168.1.8:8000/api/products?category=${categoryname}&sort=${sortOrder}`);
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data); // Shuruat mein saara data dikhao
      } catch (error) {
        console.error(`Error fetching ${categoryname}:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryname, sortOrder]);

  // 2. Filter Logic: Jab bhi products ya checkbox badle, list update karo
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

  // Checkbox handle karne wala function
  const handleFilterChange = (filterName: string) => {
    setPriceFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName as keyof typeof priceFilters]
    }));
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
      <Loader2 className="animate-spin text-primary" size={48} />
      <p className="font-serif text-gray-400 italic">Fetching {categoryname} collection...</p>
    </div>
  );

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      <div className="bg-gray-50 py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-2 capitalize">{categoryname}</h1>
        <p className="text-gray-500 text-sm capitalize tracking-widest">Home / {categoryname}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 flex flex-col md:flex-row gap-12">
        
        {/* Sidebar Filters - Now Functional */}
        <div className="hidden md:block w-64 space-y-8 flex-shrink-0">
          <div>
            <h3 className="font-serif font-bold text-lg mb-4 flex items-center justify-between border-b pb-2">
              Price Range <ChevronDown size={16} />
            </h3>
            <div className="space-y-3 text-gray-600 text-sm mt-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-primary focus:ring-primary" 
                  checked={priceFilters.under2500}
                  onChange={() => handleFilterChange('under2500')}
                /> 
                ₹500 - ₹2500
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-primary focus:ring-primary" 
                  checked={priceFilters.above2500}
                  onChange={() => handleFilterChange('above2500')}
                /> 
                Above ₹2500
              </label>
            </div>
          </div>
        </div>

        <div className="flex-1">
          {/* Top Bar: Results count and Sorting */}
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <p className="text-gray-500 font-medium tracking-tight">
              Showing {filteredProducts.length} Designs in {categoryname}
            </p>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase">Sort By:</span>
              <select 
                value={sortOrder} 
                onChange={(e) => setSortOrder(e.target.value)}
                className="border-none bg-transparent text-sm font-bold text-gray-900 focus:ring-0 outline-none cursor-pointer"
              >
                <option value="">Default</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-gray-400 font-serif text-xl">
              Is price range mein koi product nahi mila.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group flex flex-col">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-50 mb-4 shadow-sm">
                    <Link href={`/product/${product.id}`}>
                      <img 
                        src={product.thumbnail} 
                        alt={product.name} 
                        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${product.stock <= 0 ? 'grayscale opacity-70' : ''}`} 
                      />
                    </Link>

                    {product.stock > 0 ? (
                      <div className="absolute bottom-4 left-4 right-4 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-500">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            addItem({
                              id: product.id,
                              name: product.name,
                              price: `₹${product.selling_price}`,
                              image: product.thumbnail,
                              size: product.size || "Free Size",
                              color: product.color || "Multi",
                              quantity: 1
                            });
                          }}
                          className="w-full bg-white text-gray-900 py-3 rounded-xl shadow-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all"
                        >
                          <ShoppingBag size={14} /> Add to Cart
                        </button>
                      </div>
                    ) : (
                      <div className="absolute top-4 left-4">
                        <span className="bg-red-500 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  <Link href={`/product/${product.id}`} className="space-y-1">
                    <h3 className="font-serif text-lg text-gray-900 group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
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