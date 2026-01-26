"use client";

import { useEffect, useState } from "react";
import Link from "next/link"; // Link for Dynamic Details
import { Filter, ChevronDown, ShoppingBag, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function KurtisPage() {
  const [kurtis, setKurtis] = useState<any[]>([]); // Dynamic Kurtis data
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchKurtis = async () => {
      try {
        const response = await fetch("http://192.168.1.7:8000/api/products?category=kurtis");
        const data = await response.json();
        setKurtis(data);
      } catch (error) {
        console.error("Kurtis fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchKurtis();
  }, []);

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="bg-gray-50 py-12 text-center">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Trendy Kurtis</h1>
        <p className="text-gray-500 text-sm">Home / Kurtis</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 flex gap-12">
        <div className="flex-1">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 gap-4"><Loader2 className="animate-spin text-primary" size={40} /><p className="text-gray-500">Trendy Kurtis loading...</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {kurtis.map((product) => (
                <div key={product.id} className="group cursor-pointer">
                  {/* Link added to Image */}
                  <Link href={`/product/${product.id}`}>
                    <div className="relative h-[400px] overflow-hidden rounded-lg bg-gray-100 mb-4">
                      <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            addItem({
                              id: product.id,
                              name: product.name,
                              price: `₹${product.selling_price}`,
                              image: product.thumbnail,
                              size: product.size,
                              color: product.color,
                              quantity: 1
                            });
                          }}
                          className="w-full bg-white text-gray-900 py-3 rounded shadow-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-gray-900 hover:text-white transition-colors"
                        >
                          <ShoppingBag size={16} /> Add to Cart
                        </button>
                      </div>
                    </div>
                  </Link>
                  {/* Link added to Info */}
                  <Link href={`/product/${product.id}`}>
                    <div>
                      <h3 className="font-serif text-lg text-gray-900 group-hover:text-primary transition-colors">{product.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-primary font-bold">₹{product.selling_price.toLocaleString()}</p>
                        <p className="text-gray-400 line-through text-xs italic">₹{product.original_price.toLocaleString()}</p>
                      </div>
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