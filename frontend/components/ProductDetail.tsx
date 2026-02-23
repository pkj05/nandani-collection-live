"use client";

import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/store/useCartStore";
import { Heart, MessageCircle, Truck, RotateCcw, Loader2, X, Maximize2, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image"; 
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";

// ✅ ProductReviews Component and Badge Import
import ProductReviews, { ReviewBadge } from "@/components/ProductReviews";

// ✅ SWIPER IMPORTS
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Zoom } from 'swiper/modules'; 
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom'; 

import CartToast from "@/components/CartToast"; 
import { getProducts } from "@/lib/api";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  selling_price: number;
  size: string;
  has_size: boolean;
  color_name: string;
  thumbnail: string;
  stock: number;
  group_id?: string;
  images?: { id: number; image: string }[]; 
  variants?: any[];
  base_price?: number; 
  fabric?: string;
  category_name?: string;
}

export default function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem, cart } = useCartStore() as any;
  const swiperRef = useRef<any>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://nandanicollection.com";
  
  const [showToast, setShowToast] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(true);

  // --- REVIEW STATES ---
  const [reviews, setReviews] = useState<any[]>([]);

  // --- LIGHTBOX & DESCRIPTION STATE ---
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isDescExpanded, setIsDescExpanded] = useState(false); 

  const getFullImageUrl = (path: string) => {
    if (!path || path === "" || path === "null") {
      return "https://placehold.co/600x800/f3f4f6/9ca3af?text=No+Image";
    }
    let finalPath = path.replace("http://", "https://");
    if (finalPath.startsWith("http")) return finalPath;
    const cleanPath = finalPath.startsWith("/") ? finalPath : `/${finalPath}`;
    let baseUrl = API_URL?.replace("http://", "https://");
    baseUrl = baseUrl?.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    return `${baseUrl}${cleanPath}`;
  };

  const getInitialVariant = () => {
    if (product?.variants && product.variants.length > 0) {
      return product.variants.find((v: any) => v.thumbnail && v.thumbnail.trim() !== "") || product.variants[0];
    }
    return {
        id: product.id,
        thumbnail: product.thumbnail,
        color_name: product.color_name || "Default",
        stock: product.stock,
        images: product.images || []
    };
  };

  const [selectedVariant, setSelectedVariant] = useState<any>(getInitialVariant());
  
  useEffect(() => {
    const initial = getInitialVariant();
    if (initial) setSelectedVariant(initial);
    
    const fetchPageData = async () => {
      try {
        setLoadingRelated(true);
        const category = product.category_name || "";
        const data = await getProducts(category);
        setRelatedProducts(data.filter((p: any) => p.id !== product.id).slice(0, 4));

        const res = await fetch(`${API_URL}/api/reviews/${product.id}`);
        if (res.ok) {
          const reviewData = await res.json();
          setReviews(reviewData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchPageData();
  }, [product]);

  const defaultSize = selectedVariant?.sizes?.[0] || null;
  const [selectedSize, setSelectedSize] = useState<any>(defaultSize);

  const currentStock = selectedSize ? selectedSize.stock : (selectedVariant?.stock || 0);
  const basePrice = Number(product.base_price || product.selling_price || 0);
  const finalPrice = selectedSize ? basePrice + Number(selectedSize.price_adjustment || 0) : basePrice;
  const originalPrice = product.original_price ? Number(product.original_price) : null;

  const cartItem = cart.find((item: any) => 
    item.id === product.id && 
    item.variant_id === selectedVariant.id && 
    (selectedSize ? item.size_id === selectedSize.id : true)
  );
  const qtyInCart = cartItem ? cartItem.quantity : 0;

  const handleVariantSwitch = (v: any) => {
    setSelectedVariant(v);
    if (v.sizes && v.sizes.length > 0) setSelectedSize(v.sizes[0]);
    else setSelectedSize(null);
  };

  const handleSizeSwitch = (s: any) => {
    setSelectedSize(s);
  };

  const scrollToReviews = () => {
    const section = document.getElementById("reviews-display-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleAddToCart = (isBuyNow = false) => {
    if (qtyInCart >= currentStock) {
        alert("Maximum stock limit reached!");
        return;
    }
    const payload = {
      id: product.id,
      variant_id: selectedVariant?.id,
      size_id: selectedSize?.id || null,
      name: product.name,
      price: finalPrice,
      image: getFullImageUrl(selectedVariant?.thumbnail || product.thumbnail),
      color: selectedVariant?.color_name || "Default",
      size: selectedSize?.size || "Standard",
      quantity: 1, 
      stock: currentStock
    };
    const success = addItem(payload);
    if (success) {
        if (isBuyNow) router.push("/checkout");
        else {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    }
  };

  const sliderImages = (() => {
    const extraImages = (selectedVariant?.images || []).map((img: any) => img.image || img);
    const mainImage = selectedVariant?.thumbnail || product.thumbnail;
    const allImages = [mainImage, ...extraImages].filter((img: any) => img && img !== "");
    if (allImages.length === 0) return ["https://placehold.co/600x800/f3f4f6/9ca3af?text=No+Image+Available"];
    return allImages.map(img => getFullImageUrl(img));
  })();

  const openLightbox = (index: number) => {
    setActiveImageIndex(index);
    setIsLightboxOpen(true);
  };

  const ActionButtons = ({ className = "" }) => (
    <div className={`flex gap-3 ${className}`}>
      <button
        onClick={() => handleAddToCart(true)}
        disabled={currentStock === 0}
        className="flex-1 bg-[#658C5A] text-white py-3.5 rounded-xl font-bold shadow-md shadow-green-100 active:scale-[0.98] transition-all disabled:bg-gray-300 text-base"
      >
        {currentStock === 0 ? "Out of Stock" : "Buy Now"}
      </button>
      <button
        onClick={() => handleAddToCart(false)}
        disabled={currentStock === 0}
        className="flex-1 bg-white border-2 border-[#658C5A] text-[#658C5A] py-3.5 rounded-xl font-bold active:scale-[0.98] transition-all disabled:border-gray-300 disabled:text-gray-300 text-base"
      >
        Add to Cart
      </button>
    </div>
  );

  return (
    <div className="bg-white pb-10 font-sans min-h-screen relative">
      <div className="px-4 pt-2 lg:flex lg:gap-10 lg:items-start lg:max-w-6xl lg:mx-auto lg:py-8">

        {/* LEFT: GALLERY */}
        <div className="relative w-full h-[55vh] lg:h-[650px] lg:w-[500px] flex-shrink-0 rounded-[2rem] border-2 border-[#8B3E48] p-1.5 shadow-xl overflow-hidden bg-white mx-auto mb-2 group">
          <div className="w-full h-full rounded-[1.6rem] overflow-hidden bg-gray-50 relative z-0">
            <Swiper
              onSwiper={(s) => (swiperRef.current = s)} 
              modules={[Navigation, Pagination, Autoplay, Zoom]}
              pagination={{ clickable: true, dynamicBullets: true }}
              className="h-full w-full"
              speed={600} 
              loop={sliderImages.length > 1}
              zoom={{ maxRatio: 2, toggle: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              spaceBetween={0} 
            >
              {sliderImages.map((img: string, idx: number) => (
                <SwiperSlide key={idx} className="bg-white h-full w-full cursor-zoom-in" onClick={() => openLightbox(idx)}>
                  <div className="swiper-zoom-container w-full h-full relative">
                    <Image src={img} alt={`${product.name} - View ${idx + 1}`} fill priority={idx === 0} quality={85} sizes="(max-width: 768px) 100vw, 500px" className="object-cover" onError={(e: any) => { e.currentTarget.src = "https://placehold.co/600x800/f3f4f6/9ca3af?text=Image+Not+Found"; }} />
                  </div>
                  <div className="absolute bottom-12 right-6 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Maximize2 size={18} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <button aria-label="Add to wishlist" className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg text-[#8B3E48]">
              <Heart fill="#8B3E48" size={22} />
            </button>
          </div>
        </div>

        {/* RIGHT: INFO SECTION */}
        <div className="lg:flex-1 flex flex-col gap-4">
          <div className="pt-2">
            <h2 className="text-2xl lg:text-4xl font-serif font-bold text-gray-900 leading-tight">{product.name}</h2>
            
            {/* ✅ SMART REVIEW BADGE: Only shows if reviews exist */}
            {reviews.length > 0 && (
              <div className="mt-2">
                <ReviewBadge reviews={reviews} onClick={scrollToReviews} />
              </div>
            )}

            <div className="mt-4 flex items-center gap-4">
                <span className="text-3xl lg:text-4xl font-bold text-[#8B3E48]">₹{finalPrice.toLocaleString()}</span>
                {originalPrice && <span className="text-lg text-gray-400 line-through">₹{originalPrice.toLocaleString()}</span>}
                <span className="bg-[#8B3E48]/10 text-[#8B3E48] text-xs font-bold px-2 py-1 rounded">SALE</span>
            </div>
            <div className="mt-2">
                {currentStock > 0 ? (
                    <p className={`text-sm font-bold ${currentStock < 10 ? "text-red-500 animate-pulse" : "text-green-600"}`}>
                        {currentStock < 10 ? `🔥 Limited Edition: Only ${currentStock} left` : `✅ Ready to Ship (Stock: ${currentStock})`}
                    </p>
                ) : (
                    <p className="text-sm font-bold text-red-600">⚠️ Out of Stock</p>
                )}
            </div>
          </div>

          <div className="space-y-3 mt-2">
              {product.variants && product.variants.length > 0 && (
                <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2">
                    {product.variants.map((v: any) => (
                        <div key={v.id} onClick={() => handleVariantSwitch(v)} className="flex flex-col items-center gap-2 shrink-0 cursor-pointer">
                            <div className={`relative w-16 h-16 rounded-2xl overflow-hidden border-[3px] p-0.5 transition-all ${selectedVariant?.id === v.id ? 'border-[#8B3E48] shadow-lg scale-110' : 'border-gray-100'}`}>
                                <Image src={getFullImageUrl(v.thumbnail)} alt={v.color_name} width={64} height={64} className="object-cover rounded-xl" onError={(e: any) => { e.currentTarget.src = "https://placehold.co/100x100?text=NA"; }} />
                            </div>
                            <span className="text-[11px] font-bold text-gray-600">{v.color_name}</span>
                        </div>
                    ))}
                </div>
              )}
          </div>

          {product.has_size && selectedVariant?.sizes?.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-black uppercase text-gray-400 tracking-widest">Select Size</span>
              <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
                  {selectedVariant.sizes.map((s: any) => (
                      <span key={s.id} onClick={() => handleSizeSwitch(s)} className={`px-6 py-2.5 border-2 rounded-xl text-sm font-black cursor-pointer transition-all ${selectedSize?.id === s.id ? 'bg-gray-900 border-gray-900 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-900 hover:border-gray-300'}`}>
                          {s.size}
                      </span>
                  ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 py-2">
             <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Fabric:</span>
             <span className="text-sm font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded-full">{product.fabric || "Premium Cotton"}</span>
          </div>

          <ActionButtons className="mt-2" />
          
          <div className="space-y-4 pt-6 border-t border-gray-100 mt-4">
            <h3 className="text-sm font-black uppercase text-gray-400 tracking-widest">Product Description</h3>
            <div className="relative border border-[#8B3E48]/20 bg-[#FCFBFA] p-5 rounded-2xl shadow-sm transition-all duration-300">
                <div className={`text-gray-600 text-sm leading-relaxed whitespace-pre-line relative ${!isDescExpanded ? "line-clamp-4" : ""}`}>
                    {product.description}
                    {!isDescExpanded && (
                        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#FCFBFA] to-transparent pointer-events-none"></div>
                    )}
                </div>
                <button onClick={() => setIsDescExpanded(!isDescExpanded)} className="mt-3 text-xs font-bold text-[#8B3E48] uppercase tracking-widest flex items-center gap-1 hover:text-black transition-colors">
                    {isDescExpanded ? "- Show Less" : "+ Read More"}
                </button>
            </div>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pt-2">
                <div className="bg-gray-50 px-4 py-3 rounded-2xl flex items-center gap-3 border border-gray-100 shrink-0">
                    <Truck size={20} className="text-[#8B3E48]" />
                    <div className="text-xs font-black text-gray-700 uppercase italic">Free Express Shipping</div>
                </div>
                <div className="bg-gray-50 px-4 py-3 rounded-2xl flex items-center gap-3 border border-gray-100 shrink-0">
                    <RotateCcw size={20} className="text-[#8B3E48]" />
                    <div className="text-xs font-black text-gray-700 uppercase italic">Safe 7-Day Returns</div>
                </div>
            </div>
          </div>
        </div>
      </div>

      <ProductReviews productId={product.id} />

      {/* LIGHTBOX ANIMATION */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[10000] bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
            <button onClick={() => setIsLightboxOpen(false)} aria-label="Close Gallery" className="absolute top-8 right-8 text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all z-[10001]">
              <X size={32} />
            </button>
            <div className="relative w-full h-full flex items-center justify-center">
               <Swiper initialSlide={activeImageIndex} modules={[Navigation, Pagination, Zoom]} navigation pagination={{ type: 'fraction' }} zoom={{ maxRatio: 3 }} className="w-full h-[80vh]">
                 {sliderImages.map((img, idx) => (
                   <SwiperSlide key={idx} className="flex items-center justify-center">
                      <div className="swiper-zoom-container relative w-full h-full">
                        <Image src={img} alt="Full screen view" fill quality={95} className="object-contain pointer-events-none" onError={(e: any) => { e.currentTarget.src = "https://placehold.co/800x1200/f3f4f6/9ca3af?text=Image+Not+Found"; }} />
                      </div>
                   </SwiperSlide>
                 ))}
               </Swiper>
            </div>
            <p className="text-white/50 text-xs font-bold uppercase tracking-widest mt-4 italic">Scroll or use arrows to view more</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RELATED PRODUCTS */}
      <div className="max-w-6xl mx-auto px-4 mt-20 mb-20">
        <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">You May Also Like</h3>
            <div className="h-px flex-1 bg-gray-200 ml-10 hidden md:block"></div>
        </div>
        {loadingRelated ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#8B3E48]" size={40} /></div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
                {relatedProducts.map((p) => ( <ProductCard key={p.id} product={p} /> ))}
            </div>
        )}
      </div>

      {showToast && (
        <div className="fixed top-20 right-0 left-0 z-[9999] flex justify-center px-4 animate-in slide-in-from-top-5 fade-in duration-300 pointer-events-none">
            <div className="pointer-events-auto"><CartToast onClose={() => setShowToast(false)} /></div>
        </div>
      )}

      <a href={`https://wa.me/919149796456?text=Hi, I want to buy ${product.name}`} target="_blank" rel="noopener noreferrer" className="fixed bottom-8 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-2xl z-30 hover:scale-110 transition-transform">
        <MessageCircle size={28} fill="white" />
      </a>
    </div>
  );
}