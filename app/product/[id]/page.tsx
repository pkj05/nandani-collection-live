"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation"; 
import { ShoppingBag, Heart, Truck, RotateCcw, CreditCard, Loader2, ZoomIn, ZoomOut, Play, X } from "lucide-react";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import QuickPinchZoom, { make3dTransformValue } from "react-quick-pinch-zoom";

import { useCartStore } from "@/store/useCartStore";

export default function ProductDetail() {
  const params = useParams(); 
  const router = useRouter(); 
  const productId = params.id;
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showVideo, setShowVideo] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  
  const pzRefs = useRef<any[]>([]);
  const imgRefs = useRef<any[]>([]);

  const onUpdate = useCallback((index: number) => ({ x, y, scale }: any) => {
    const img = imgRefs.current[index];
    if (img) {
      const value = make3dTransformValue({ x, y, scale });
      img.style.setProperty("transform", value);
      if (scale > 1.05) {
        setIsZoomed(true);
        if (swiperInstance) {
          swiperInstance.allowTouchMove = false;
          if (swiperInstance.autoplay) swiperInstance.autoplay.stop();
        }
      } else {
        setIsZoomed(false);
        if (swiperInstance) swiperInstance.allowTouchMove = true;
      }
    }
  }, [swiperInstance]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://192.168.1.7:8000/api/products?id=${productId}`);
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const item = data[0];
          setProduct(item);
          setSelectedSize(item.size);
          setSelectedColor(item.color);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchProductDetails();
  }, [productId]);

  const handleManualZoom = (type: 'in' | 'out') => {
    const activeIndex = swiperInstance?.activeIndex || 0;
    const currentPz = pzRefs.current[activeIndex];
    if (currentPz) {
      if (type === 'in') currentPz.scaleTo({ scale: 3, x: 0, y: 0 });
      else currentPz.scaleTo({ scale: 1, x: 0, y: 0 });
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
      <Loader2 className="animate-spin text-primary" size={48} />
      <p className="font-serif text-gray-400 italic">Nandani Collection Loading...</p>
    </div>
  );

  if (!product) return <div className="text-center py-20 font-serif">Product Not Found!</div>;

  const allImages = [product.thumbnail, ...(product.images?.map((img: any) => img.image) || [])];

  return (
    <div className="bg-white min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          <div className="relative rounded-3xl overflow-hidden bg-gray-100 h-[550px] md:h-[750px] shadow-sm">
            {!showVideo ? (
              <>
                <Swiper modules={[Navigation, Pagination, Autoplay]} onSwiper={setSwiperInstance} spaceBetween={0} slidesPerView={1} navigation={!isZoomed} pagination={{ clickable: true }} autoplay={isZoomed ? false : { delay: 4000, disableOnInteraction: true }} className="w-full h-full">
                  {allImages.map((img, index) => (
                    <SwiperSlide key={index}>
                      <QuickPinchZoom ref={(el) => { if (el) pzRefs.current[index] = el; }} onUpdate={onUpdate(index)} draggableUnZoomed={false} enforceBounds={false} containerProps={{ style: { width: "100%", height: "100%" } }}>
                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                          <img ref={(el) => { if (el) imgRefs.current[index] = el; }} src={img} alt={`${product.name}-${index}`} className="w-full h-full object-cover pointer-events-none" style={{ willChange: "transform" }} />
                        </div>
                      </QuickPinchZoom>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="absolute top-6 right-6 z-40 flex flex-col gap-4">
                  <button onClick={() => handleManualZoom('in')} className="p-4 bg-white/90 rounded-2xl shadow-2xl text-black active:scale-90 transition-all border border-gray-100"><ZoomIn size={24} /></button>
                  <button onClick={() => handleManualZoom('out')} className="p-4 bg-white/90 rounded-2xl shadow-2xl text-black active:scale-90 transition-all border border-gray-100"><ZoomOut size={24} /></button>
                </div>
                {product.video && (
                  <button onClick={() => setShowVideo(true)} className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full shadow-2xl font-bold active:scale-95 transition-all">
                    <Play size={20} fill="white" /> Watch Product Video
                  </button>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-black relative flex items-center justify-center">
                <video src={product.video} controls autoPlay className="max-h-full w-full" />
                <button onClick={() => setShowVideo(false)} className="absolute top-6 right-6 z-50 bg-white p-2 rounded-full text-black shadow-xl"><X size={28} /></button>
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-8 py-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">{product.name}</h1>
              <div className="flex items-center gap-6">
                <p className="text-4xl font-bold text-primary">₹{product.selling_price?.toLocaleString()}</p>
                <p className="text-2xl text-gray-400 line-through font-light italic">₹{product.original_price?.toLocaleString()}</p>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed text-xl font-light">{product.description}</p>

            <div className="flex gap-12">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Color</h3>
                <div className="w-14 h-14 rounded-full border-2 border-primary p-1">
                  <div className="w-full h-full rounded-full shadow-inner" style={{ backgroundColor: product.color?.toLowerCase() || 'gray' }}></div>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Size</h3>
                <div className="w-14 h-14 flex items-center justify-center rounded-2xl border-2 border-primary bg-primary text-white font-bold text-xl shadow-lg shadow-primary/10">{product.size}</div>
              </div>
            </div>

            {/* Cart & Buy Actions - Stock Check Implementation */}
            {product.stock > 0 ? (
              <>
                <div className="flex flex-col sm:flex-row gap-6 pt-4">
                  <div className="flex items-center bg-gray-50 rounded-3xl p-3 flex-1 justify-between px-6 border border-gray-100">
                    <button onClick={() => quantity > 1 && setQuantity(quantity-1)} className="text-3xl font-light hover:text-primary transition-colors">-</button>
                    <span className="font-bold text-2xl">{quantity}</span>
                    <button onClick={() => setQuantity(quantity+1)} className="text-3xl font-light hover:text-primary transition-colors">+</button>
                  </div>
                  <button 
                    onClick={() => addItem({
                      id: product.id, name: product.name, price: `₹${product.selling_price}`,
                      image: product.thumbnail, size: selectedSize || product.size || "Free Size", 
                      color: selectedColor || product.color || "Multi", quantity: quantity
                    })}
                    className="flex-[2] h-20 border-2 border-black rounded-3xl font-bold text-xl hover:bg-black hover:text-white transition-all flex items-center justify-center gap-4 shadow-sm active:scale-95"
                  >
                    <ShoppingBag size={24} /> Add to Cart
                  </button>
                </div>
                <button 
                  onClick={() => {
                    addItem({
                      id: product.id, name: product.name, price: `₹${product.selling_price}`,
                      image: product.thumbnail, size: selectedSize || product.size || "Free Size", 
                      color: selectedColor || product.color || "Multi", quantity: quantity
                    }); 
                    router.push("/checkout");
                  }}
                  className="w-full h-20 bg-primary text-white rounded-3xl font-bold text-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all"
                >
                  Buy Now
                </button>
              </>
            ) : (
              <div className="pt-4 space-y-4">
                <div className="w-full h-20 bg-gray-100 text-gray-400 rounded-3xl font-bold text-xl flex items-center justify-center border-2 border-dashed border-gray-200 cursor-not-allowed">
                  Currently Out of Stock
                </div>
                <p className="text-center text-red-500 font-medium italic">We're sorry! This designer piece is currently unavailable.</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3 p-5 bg-gray-50 rounded-2xl">
                <Truck size={22} className="text-primary" />
                <span className="text-sm font-semibold">Free Express Delivery</span>
              </div>
              <div className="flex items-center gap-3 p-5 bg-gray-50 rounded-2xl">
                <RotateCcw size={22} className="text-primary" />
                <span className="text-sm font-semibold">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}