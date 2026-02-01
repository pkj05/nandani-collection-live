"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MoveRight, Loader2 } from "lucide-react";

const CategorySection = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Categories from Backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
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
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4 tracking-tight">
            Shop by Category
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-4"></div>
          <p className="text-gray-500 max-w-2xl mx-auto italic font-medium">
            Discover our curated collections of premium ethnic wear.
          </p>
        </div>

        {/* DYNAMIC CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {categories.map((cat) => {
            // SLUG LOGIC: Space ko '-' me badalna aur lowercase karna
            // Kyuki aapka folder [categoryname] hai, URL me '/category/' nahi aayega
            const categorySlug = cat.name.toLowerCase().replace(/\s+/g, '-');

            return (
              <Link 
                key={cat.id} 
                href={`/${categorySlug}`}
                className="group relative h-[500px] md:h-[600px] overflow-hidden rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-700"
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] group-hover:scale-110"
                  style={{ 
                    backgroundImage: `url('${cat.image || "https://images.unsplash.com/photo-1583391733956-6c78276477e2"}')`,
                    backgroundColor: '#f9fafb'
                  }}
                ></div>

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-500"></div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 p-10 w-full z-10">
                  <p className="text-primary text-[10px] font-black tracking-[0.4em] uppercase mb-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    Exclusive Collection
                  </p>
                  <h3 className="text-4xl font-serif text-white font-bold mb-6 capitalize tracking-wide">
                    {cat.name}
                  </h3>
                  
                  <div className="flex items-center gap-3 text-white font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 transform translate-y-4 group-hover:translate-y-0">
                    <span className="border-b-2 border-white pb-1">Shop Now</span>
                    <MoveRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>

                {/* Hover Border Frame */}
                <div className="absolute inset-6 border border-white/20 rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default CategorySection;