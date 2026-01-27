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
        const response = await fetch("http://192.168.1.7:8000/api/products?sort=newest");
        const data = await response.json();

        // --- GROUPING LOGIC ---
        const seenGroups = new Set();
        const uniqueData = data.filter((p: any) => {
          if (!p.group_id) return true;
          if (!seenGroups.has(p.group_id)) {
            seenGroups.add(p.group_id);
            return true;
          }
          return false;
        });

        setProducts(uniqueData.slice(0, 4)); // Sirf 4 unique designs
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  if (loading) return (
    <div className="py-20 flex justify-center items-center bg-gray-50"><Loader2 className="animate-spin text-primary" size={32} /></div>
  );

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">New Arrivals</h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
export default FeaturedProducts;