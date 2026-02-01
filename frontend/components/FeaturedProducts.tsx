"use client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import ProductCard from "./ProductCard";

const FeaturedProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        // Naye Modular API se data fetch kar rahe hain
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?sort=newest`);
        const data = await response.json();

        // --- UPDATED LOGIC ---
        // Purana group_id wala filter hata diya kyunki backend ab unique base products bhej raha hai
        // Jisme ek product ke andar hi saare variants (colors) mil jate hain.
        
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

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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