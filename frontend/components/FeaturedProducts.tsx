"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import ProductCard from "./ProductCard";
// ✅ New API logic import kiya
import { getProducts } from "@/lib/api"; 

const FeaturedProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        
        // ✅ Purane fetch ki jagah lib/api ka getProducts use kiya
        // 'newest' sort filter ke saath taaki latest arrivals hi milein
        const data = await getProducts(undefined, undefined, 'newest');

        // Backend ab unique designs bhej raha hai jisme variants (colors) andar hain
        setProducts(data.slice(0, 4)); // Homepage par top 4 unique designs dikhayenge
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  if (loading) return (
    <div className="py-20 flex justify-center items-center bg-gray-50">
      <Loader2 className="animate-spin text-primary" size={32} />
    </div>
  );

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Section (Original Design Preserved) */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">New Arrivals</h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        {/* Product Grid - Mobile 2 products side-by-side */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 italic">
              No new arrivals at the moment.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;