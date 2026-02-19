"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image"; // ✅ Next.js Image import optimization ke liye
import { MoveRight, Loader2 } from "lucide-react";
// ✅ New API logic import kiya
import { getShopData } from "@/lib/api"; 

const CategorySection = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // ✅ IMPROVED IMAGE FIXER: HTTPS enforce karne aur null check ke liye
  const getFullImageUrl = (path: string) => {
    if (!path || path === "" || path === "null") {
      return "https://images.unsplash.com/photo-1583391733956-6c78276477e2"; // Default Placeholder
    }
    
    // ✅ Forced HTTPS replacement (Fixed 400 Bad Request error)
    let finalPath = path.replace("http://", "https://");
    
    if (finalPath.startsWith("http")) return finalPath;

    const cleanPath = finalPath.startsWith("/") ? finalPath : `/${finalPath}`;
    let baseUrl = API_URL?.replace("http://", "https://");
    baseUrl = baseUrl?.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    
    return `${baseUrl}${cleanPath}`;
  };

  // 1. Fetch Categories using centralized logic
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getShopData();
        setCategories(data.categories || []);
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
      <Loader2 className="animate-spin text-[#8B3E48]" size={32} />
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
          <div className="w-20 h-1 bg-[#8B3E48] mx-auto rounded-full mb-4"></div>
          <p className="text-gray-500 max-w-2xl mx-auto italic font-medium">
            Discover our curated collections of premium ethnic wear.
          </p>
        </div>

        {/* ✅ DYNAMIC CARDS GRID - Optimized for 90+ Mobile Score */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-10">
          {categories.map((cat, index) => {
            const categorySlug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-');
            const catImage = getFullImageUrl(cat.image);

            return (
              <Link 
                key={cat.id} 
                href={`/${categorySlug}`}
                className="group relative h-[300px] md:h-[600px] overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-700"
              >
                {/* ✅ PERFORMANCE OPTIMIZED IMAGE */}
                <div className="absolute inset-0 z-0 bg-gray-100">
                  <Image
                    src={catImage}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 33vw, 25vw" // ✅ Precision sizing
                    quality={75} // ✅ Mobile Performance fix
                    className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                    priority={index < 2} // ✅ Initial categories load fast
                    fetchPriority={index < 2 ? "high" : "low"} // ✅ Lighthouse improvement
                    onError={(e: any) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1583391733956-6c78276477e2";
                    }}
                  />
                </div>

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-500 z-10"></div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 p-4 md:p-10 w-full z-20">
                  <p className="text-[#8B3E48] text-[8px] md:text-[10px] font-black tracking-[0.2em] md:tracking-[0.4em] uppercase mb-1 md:mb-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    Exclusive Collection
                  </p>
                  <h3 className="text-xl md:text-4xl font-serif text-white font-bold mb-2 md:mb-6 capitalize tracking-wide">
                    {cat.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 md:gap-3 text-white font-bold text-[10px] md:text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 transform translate-y-4 group-hover:translate-y-0">
                    <span className="border-b-2 border-white pb-0.5 md:pb-1">Shop Now</span>
                    <MoveRight size={16} className="md:w-5 md:h-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>

                {/* Hover Border Frame */}
                <div className="absolute inset-3 md:inset-6 border border-white/20 rounded-[1rem] md:rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-20"></div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;