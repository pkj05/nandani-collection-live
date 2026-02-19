"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image"; // ✅ Next.js Image import
import { MoveRight, Loader2 } from "lucide-react";
// Swiper Imports for Slider
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

// ✅ API logic import
import { getShopData } from "@/lib/api"; 

const Hero = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // ✅ IMPROVED IMAGE FIXER: Null handling aur HTTPS enforcement
  const getFullImageUrl = (path: string) => {
    if (!path || path === "" || path === "null") {
      return "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=2574"; 
    }
    
    // ✅ Forced HTTPS (Fixed Mixed Content/400 Error)
    let finalPath = path.replace("http://", "https://");
    
    if (finalPath.startsWith("http")) return finalPath;

    const cleanPath = finalPath.startsWith("/") ? finalPath : `/${finalPath}`;
    let baseUrl = API_URL?.replace("http://", "https://");
    baseUrl = baseUrl?.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    
    return `${baseUrl}${cleanPath}`;
  };

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const data = await getShopData();
        setBanners(data.banners || []);
      } catch (error) {
        console.error("Hero Banner Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  if (loading) return (
    <div className="h-[600px] flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-[#8B3E48]" size={40} />
    </div>
  );

  return (
    <section className="relative w-full h-[600px] md:h-[750px] overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="h-full w-full"
      >
        {banners.length > 0 ? (
          banners.map((banner, index) => (
            <SwiperSlide key={banner.id}>
              <div className="relative w-full h-full flex items-center justify-center">
                
                {/* ✅ PERFORMANCE & ERROR OPTIMIZED IMAGE */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={getFullImageUrl(banner.image)}
                    alt={banner.title || "Nandani Collection Banner"}
                    fill
                    priority={index === 0} // ✅ Pehle banner ko priority
                    fetchPriority={index === 0 ? "high" : "low"} // ✅ Lighthouse LCP fix
                    quality={75} // ✅ Mobile Score ke liye 90 se ghatakar 75 (Visual fark nahi padega)
                    className="object-cover object-top"
                    sizes="100vw"
                    // ✅ Error handling logic
                    onError={(e: any) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=2574";
                    }}
                  />
                  {/* Overlay for text readability */}
                  <div className="absolute inset-0 bg-black/35 z-10"></div>
                </div>

                {/* CONTENT SECTION */}
                <div className="relative z-20 text-center px-4 max-w-4xl mx-auto space-y-6">
                  <p className="text-white/90 text-sm md:text-base tracking-[0.2em] uppercase font-medium">
                    New Arrivals 2026
                  </p>

                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight drop-shadow-xl">
                    {banner.title || "Elegance for Every Occasion"}
                  </h1>

                  <p className="text-white/90 text-lg md:text-xl font-light max-w-2xl mx-auto pb-4 drop-shadow-md">
                    Discover our exclusive collection of handpicked Sarees and Suits designed to make you shine.
                  </p>

                  <Link 
                    href="/suits" 
                    className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-medium hover:bg-[#8B3E48] hover:text-white transition-all duration-300 transform hover:scale-105 shadow-xl"
                  >
                    Shop Collection
                    <MoveRight size={20} />
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-100 italic text-gray-400">
            Add Banners in Django Admin to see the slider.
          </div>
        )}
      </Swiper>
    </section>
  );
};

export default Hero;