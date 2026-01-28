"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

const FeaturedProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  // 1. Fetching Newest Products from Backend
  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        // Laptop IP 192.168.1.7 aur newest sort order
        const response = await fetch("http://192.168.1.7:8000/api/products?sort=newest");
        const data = await response.json();
        // Sirf top 4 latest products dikhane ke liye
        setProducts(data.slice(0, 4));
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            New Arrivals
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        {/* Dynamic Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              
              {/* Image Container with Safe Link */}
              <div className="relative h-[350px] overflow-hidden">
                <Link href={`/product/${product.id}`}>
                  <img 
                    src={product.thumbnail} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
                
                {/* Safe 'Add to Cart' with stock check */}
                <div className="absolute bottom-4 left-0 right-0 px-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button 
                    disabled={product.stock <= 0}
                    onClick={() => addItem({
                      id: product.id,
                      name: product.name,
                      price: `₹${product.selling_price}`,
                      image: product.thumbnail,
                      size: product.size || "Free Size",
                      color: product.color || "Multi",
                      quantity: 1
                    })}
                    className={`w-full font-medium py-3 rounded shadow-lg flex items-center justify-center gap-2 transition-colors ${
                      product.stock > 0 
                      ? "bg-white text-gray-900 hover:bg-black hover:text-white" 
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <ShoppingBag size={18} />
                    {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  {product.category_name}
                </p>
                <Link href={`/product/${product.id}`}>
                  <h3 className="text-lg font-serif font-medium text-gray-900 mb-2 truncate hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center justify-center gap-3">
                  <p className="text-primary font-bold text-lg">₹{product.selling_price.toLocaleString()}</p>
                  <p className="text-gray-400 line-through text-sm">₹{product.original_price.toLocaleString()}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/suits" className="inline-block border-2 border-gray-900 text-gray-900 px-8 py-3 rounded-full font-medium hover:bg-gray-900 hover:text-white transition-colors">
            View All Collection
          </Link>
        </div>

      </div>
    </section>
  );
};

export default FeaturedProducts;