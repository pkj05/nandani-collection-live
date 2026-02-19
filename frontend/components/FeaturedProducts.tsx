"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic"; // ✅ Dynamic import के लिए
// ✅ New API logic import
import { getProducts } from "@/lib/api"; 

// ✅ PERFORMANCE FIX: ProductCard को डायनामिक बनाया ताकि भारी JS तुरंत लोड न हो
const ProductCard = dynamic(() => import("./ProductCard"), { 
  loading: () => <div className="aspect-[3/4] bg-gray-100 animate-pulse rounded-[1.5rem]"></div>,
  ssr: false 
});

const FeaturedProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        // ✅ 'newest' sort ke saath fetch kiya
        const data = await getProducts(undefined, undefined, 'newest');
        setProducts(data.slice(0, 4)); 
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  if (loading) return (
    <div className="py-20 flex justify-center items-center bg-gray-50 min-h-[400px]">
      <Loader2 className="animate-spin text-[#8B3E48]" size={40} />
    </div>
  );

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4 tracking-tight">
            New Arrivals
          </h2>
          <div className="w-24 h-1.5 bg-[#8B3E48] mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-500 italic">Explore the latest trends in our collection</p>
        </div>

        {/* Product Grid - Mobile Optimized */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-10 text-center text-gray-500 italic bg-white rounded-3xl border border-dashed border-gray-200">
              Check back soon for our newest designs!
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;