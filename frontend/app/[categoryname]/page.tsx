"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, LayoutGrid } from "lucide-react";
import ProductCard from "@/components/ProductCard";
// ✅ lib/api से प्रोफेशनल फंक्शन इम्पोर्ट किया
import { getProducts } from "@/lib/api";

const CategoryPage = () => {
  const params = useParams();
  const categoryName = params.categoryname as string;

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        // ✅ Purane lambe fetch ki jagah sirf ek line ka function use kiya
        const data = await getProducts(categoryName);
        
        // Backend ab modular hai, isliye seenGroups ki zarurat nahi
        setProducts(data); 

      } catch (error) {
        console.error("Error fetching category products:", error);
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
        
        {/* Header Section (Design Preserved) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-gray-200 pb-8 gap-4">
          <div>
            <nav className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">Home / Collection</nav>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 capitalize">
                {categoryName ? categoryName.replace("-", " ") : "Collection"}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
            <LayoutGrid size={18} />
            <span>{products.length} Unique Designs</span>
          </div>
        </div>

        {/* Product Grid - Mobile 2 Columns & Desktop 4 Columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 gap-y-8">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-gray-400 italic">
              No designs found in this category yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
