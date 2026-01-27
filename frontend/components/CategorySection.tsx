"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MoveRight, Loader2 } from "lucide-react";

const CategorySection = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Backend se categories mangane ka logic (Original Logic Unchanged)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // Laptop IP ka istemal (192.168.1.7)
        const response = await fetch("http://192.168.1.7:8000/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return (
    <div className="py-20 flex justify-center items-center">
      <Loader2 className="animate-spin text-primary" size={32} />
    </div>
  );

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading (Original UI) */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our handcrafted collection of ethnic wear, designed to make every moment special.
          </p>
        </div>

        {/* DYNAMIC CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              // URL logic (Original)
              href={`/${cat.name.toLowerCase()}`}
              className="group relative h-[400px] md:h-[550px] overflow-hidden rounded-3xl cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 border border-transparent"
            >
              {/* Background Image: Django se aane wali image (Original) */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                style={{ 
                  backgroundImage: `url('${cat.image || "https://images.unsplash.com/photo-1583391733956-6c78276477e2"}')`,
                  backgroundColor: '#f3f4f6' 
                }}
              ></div>

              {/* Enhanced Gradient Overlay (Updated for Premium Look) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-500"></div>

              {/* Text Content (Original Logic with Smoother Animation) */}
              <div className="absolute bottom-0 left-0 p-10 w-full transform transition-transform duration-500">
                <p className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                  New Collection
                </p>
                <h3 className="text-3xl font-serif text-white font-bold mb-4 capitalize tracking-wide">
                  {cat.name}
                </h3>
                
                <div className="flex items-center gap-3 text-white font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 transform translate-y-4 group-hover:translate-y-0">
                  <span className="border-b border-white pb-1">Explore Now</span>
                  <MoveRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>

              {/* Aesthetic Border on Hover (Matching ProductCard Style) */}
              <div className="absolute inset-0 border-[0px] group-hover:border-[12px] border-white/10 transition-all duration-500 pointer-events-none"></div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CategorySection;