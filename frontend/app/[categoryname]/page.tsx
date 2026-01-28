"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, LayoutGrid } from "lucide-react";
import ProductCard from "@/components/ProductCard";

const CategoryPage = () => {
  const params = useParams();
  const categoryName = params.categoryname as string;

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://192.168.1.8:8000/api/products?category=${categoryName}`);
        const data = await response.json();

        // --- MASTER GROUPING LOGIC ---
        const seenGroups = new Set();
        const uniqueProducts = data.filter((product: any) => {
          if (!product.group_id) return true; // Bina group wale hamesha dikhenge
          if (!seenGroups.has(product.group_id)) {
            seenGroups.add(product.group_id);
            return true; // Group ka pehla product dikhao
          }
          return false; // Baki duplicates hide karo
        });

        setProducts(uniqueProducts);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    if (categoryName) fetchCategoryProducts();
  }, [categoryName]);

  if (loading) return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white gap-4">
      <Loader2 className="animate-spin text-primary" size={40} />
      <p className="text-gray-400 font-serif italic">Filtering Designs...</p>
    </div>
  );

  return (
    <div className="bg-[#fafafa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-gray-200 pb-8 gap-4">
          <div>
            <nav className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">Home / Collection</nav>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 capitalize">{categoryName.replace("-", " ")}</h1>
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
            <LayoutGrid size={18} />
            <span>{products.length} Unique Styles</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;