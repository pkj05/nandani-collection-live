"use client";

import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/store/useCartStore";
import { Heart, MessageCircle, Truck, RotateCcw, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

// ✅ SWIPER IMPORTS
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Zoom } from 'swiper/modules'; 
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom'; 

// Import Custom Toast
import CartToast from "@/components/CartToast"; 
// ✅ lib/api se relevant function import kiya
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
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  
  const [showToast, setShowToast] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(true);

  // ✅ IMAGE FIXER: Backend path ko full URL me badalne ke liye
  const getFullImageUrl = (path: string) => {
    if (!path) return "https://placehold.co/600x800?text=No+Image";
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const baseUrl = API_URL?.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    return `${baseUrl}${cleanPath}`;
  };

  // --- INITIALIZATION ---
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
    
    // ✅ FETCH RELATED PRODUCTS USING NEW LOGIC
    const fetchRelated = async () => {
      try {
        setLoadingRelated(true);
        const category = product.category_name || "";
        // ✅ lib/api का getProducts इस्तेमाल किया (Modular path /shop/products के लिए)
        const data = await getProducts(category);
        // Current product ko hata kar baki dikhao
        setRelatedProducts(data.filter((p: any) => p.id !== product.id).slice(0, 4));
      } catch (error) {
        console.error("Error fetching related products:", error);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchRelated();
  }, [product]);

  const defaultSize = selectedVariant?.sizes?.[0] || null;
  const [selectedSize, setSelectedSize] = useState<any>(defaultSize);

  // --- CALCULATIONS ---
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
        if (isBuyNow) {
            router.push("/checkout");
        } else {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    }
  };

  const getSliderImages = () => {
    const extraImages = (selectedVariant?.images || []).map((img: any) => img.image || img);
    const mainImage = selectedVariant?.thumbnail || product.thumbnail;
    return [mainImage, ...extraImages].filter((img: any) => img && img !== "").map(img => getFullImageUrl(img));
  };

  const sliderImages = getSliderImages();

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
        <div className="relative w-full h-[45vh] lg:h-[550px] lg:w-[480px] flex-shrink-0 rounded-[1.5rem] border-2 border-[#8B3E48] p-1 shadow-sm overflow-hidden bg-white mx-auto mb-2">
          <div className="w-full h-full rounded-[1.2rem] overflow-hidden bg-gray-50 relative z-0">
            <Swiper
              onSwiper={(s) => (swiperRef.current = s)} 
              modules={[Navigation, Pagination, Autoplay, Zoom]}
              pagination={{ clickable: true, dynamicBullets: true }}
              className="h-full w-full"
              speed={500} 
              loop={sliderImages.length > 1}
              zoom={{ maxRatio: 3, toggle: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              spaceBetween={0} 
              onZoomChange={(swiper, scale) => {
                if (scale > 1) swiper.autoplay.stop();
                else swiper.autoplay.start();
              }}
            >
              {sliderImages.map((img: string, idx: number) => (
                <SwiperSlide key={idx} className="bg-white h-full w-full overflow-hidden">
                  <div className="swiper-zoom-container w-full h-full flex items-center justify-center">
                    <img 
                        src={img} 
                        alt={`Slide ${idx}`} 
                        className="max-h-full max-w-full object-contain" 
                        onError={(e) => { e.currentTarget.src = "https://placehold.co/600x800?text=No+Image"; }} 
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            
            <button className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md text-[#8B3E48]">
              <Heart fill="#8B3E48" size={20} />
            </button>
          </div>
        </div>

        {/* RIGHT: INFO SECTION */}
        <div className="lg:flex-1 flex flex-col gap-3">
          <div>
            <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 leading-tight line-clamp-2">{product.name}</h2>
            <div className="mt-1 flex items-center gap-3">
                <span className="text-2xl lg:text-3xl font-bold text-[#8B3E48]">₹{finalPrice.toLocaleString()}</span>
                {originalPrice && <span className="text-sm lg:text-lg text-gray-400 line-through">₹{originalPrice.toLocaleString()}</span>}
            </div>
            <div className="mt-1">
                {currentStock > 0 ? (
                    <p className={`text-sm font-semibold ${currentStock < 10 ? "text-red-500 animate-pulse" : "text-green-600"}`}>
                        {currentStock < 10 ? `🔥 Hurry! Only ${currentStock} left` : `In Stock: ${currentStock}`}
                    </p>
                ) : (
                    <p className="text-sm font-semibold text-red-600">Out of Stock</p>
                )}
            </div>
          </div>

          <div className="space-y-2 mt-2">
             {product.variants && product.variants.length > 0 && (
                <div className="flex gap-3 overflow-x-auto scrollbar-hide py-1">
                    {product.variants.map((v: any) => (
                        <div key={v.id} onClick={() => handleVariantSwitch(v)} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer">
                            <div className={`relative w-14 h-14 rounded-xl overflow-hidden border-[2px] p-0.5 ${selectedVariant?.id === v.id ? 'border-[#8B3E48] shadow-md scale-105' : 'border-gray-200'}`}>
                                <img src={getFullImageUrl(v.thumbnail)} className="w-full h-full object-cover rounded-lg" alt={v.color_name} />
                            </div>
                            <span className="text-[10px] font-medium">{v.color_name}</span>
                        </div>
                    ))}
                </div>
             )}
          </div>

          {product.has_size && selectedVariant?.sizes?.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
                {selectedVariant.sizes.map((s: any) => (
                    <span key={s.id} onClick={() => handleSizeSwitch(s)} className={`px-4 py-2 border-2 rounded-lg text-sm font-bold cursor-pointer transition-all ${selectedSize?.id === s.id ? 'bg-black text-white' : 'bg-white'}`}>
                        {s.size}
                    </span>
                ))}
            </div>
          )}

          <div className="flex items-center gap-2 py-2 mt-1 mb-1">
             <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Fabric:</span>
             <span className="text-sm font-medium text-gray-900 capitalize bg-gray-50 px-2 py-1 rounded border border-gray-100">{product.fabric || "Premium Cotton"}</span>
          </div>

          <ActionButtons />
          
          <div className="space-y-4 pt-4 border-t border-gray-100 mt-2">
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{product.description}</p>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                <div className="bg-gray-50 px-3 py-2.5 rounded-xl flex items-center gap-2 border border-gray-100 shrink-0">
                    <Truck size={18} className="text-[#8B3E48]" />
                    <div className="text-xs font-bold text-gray-700">Fast Delivery</div>
                </div>
                <div className="bg-gray-50 px-3 py-2.5 rounded-xl flex items-center gap-2 border border-gray-100 shrink-0">
                    <RotateCcw size={18} className="text-[#8B3E48]" />
                    <div className="text-xs font-bold text-gray-700">7 Day Returns</div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ RELATED PRODUCTS SECTION - UPDATED TO USE NEW API PATH */}
      <div className="max-w-6xl mx-auto px-4 mt-16 mb-20">
        <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl md:text-2xl font-serif font-bold text-gray-900">You May Also Like</h3>
            <div className="h-px flex-1 bg-gray-100 ml-6 hidden md:block"></div>
        </div>

        {loadingRelated ? (
            <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-gray-300" size={30} />
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {relatedProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>
        )}
      </div>

      {/* ✅ CART TOAST */}
      {showToast && (
        <div className="fixed top-20 right-0 left-0 z-[9999] flex justify-center px-4 animate-in slide-in-from-top-5 fade-in duration-300 pointer-events-none">
            <div className="pointer-events-auto">
                <CartToast onClose={() => setShowToast(false)} />
            </div>
        </div>
      )}

      <a href={`https://wa.me/919149796456?text=Hi, I want to buy ${product.name}`} target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-4 bg-[#25D366] text-white p-3 rounded-full shadow-lg z-30 hover:scale-110 transition-transform">
        <MessageCircle size={24} fill="white" />
      </a>
    </div>
  );
}