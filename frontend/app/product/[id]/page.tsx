"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation"; 
import { ShoppingBag, Truck, RotateCcw, Loader2, ZoomIn, ZoomOut, ChevronUp } from "lucide-react"; 
import Link from "next/link";

// Swiper & Pinch Zoom Library Imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import QuickPinchZoom, { make3dTransformValue } from "react-quick-pinch-zoom";

// Cart Store Import
import { useCartStore } from "@/store/useCartStore";

export default function ProductDetail() {
  const params = useParams(); 
  const router = useRouter(); 
  const productId = params.id;
  
  const cart = useCartStore((state) => state.cart);
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<any>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  const pzRefs = useRef<any[]>([]);
  const imgRefs = useRef<any[]>([]);

  // Performance: Scroll Listener for Back to Top
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const onUpdate = useCallback((index: number) => ({ x, y, scale }: any) => {
    const img = imgRefs.current[index];
    if (img) {
      const value = make3dTransformValue({ x, y, scale });
      img.style.setProperty("transform", value);
      if (scale > 1.05) {
        setIsZoomed(true);
        if (swiperInstance) swiperInstance.allowTouchMove = false;
      } else {
        setIsZoomed(false);
        if (swiperInstance) swiperInstance.allowTouchMove = true;
      }
    }
  }, [swiperInstance]);

  // Fetch Logic with Variant Grouping
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://192.168.1.8:8000/api/products?id=${productId}`);
        const data = await res.json();
        
        if (Array.isArray(data) && data.length > 0) {
          const item = data[0];
          setProduct(item);
          setSelectedSize(item.size);

          // Similar products fetch based on category
          const similarRes = await fetch(`http://192.168.1.8:8000/api/products?category=${item.category_name}`);
          const similarData = await similarRes.json();
          const filteredSimilar = similarData.filter((p: any) => p.id !== item.id && p.stock > 0);
          setSimilarProducts(filteredSimilar.slice(0, 4));
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchAllData();
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
    <div className="bg-white min-h-screen font-sans relative">
      {/* FEATURE: Back to Top Navigation */}
      {showBackToTop && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-10 right-10 z-50 p-4 bg-black text-white rounded-full shadow-2xl transition-all hover:scale-110 active:scale-90"
        >
          <ChevronUp size={24} />
        </button>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          
          {/* IMAGE SECTION (Performance: Priority images) */}
          <div className="relative rounded-3xl overflow-hidden bg-gray-100 h-[550px] md:h-[750px] shadow-sm">
            <Swiper modules={[Navigation, Pagination, Autoplay]} onSwiper={setSwiperInstance} spaceBetween={0} slidesPerView={1} navigation={!isZoomed} pagination={{ clickable: true }} className="w-full h-full">
              {allImages.map((img, index) => (
                <SwiperSlide key={index}>
                  <QuickPinchZoom 
                    ref={(el: any) => { if (el) pzRefs.current[index] = el; }} 
                    onUpdate={onUpdate(index)} 
                    draggableUnZoomed={false} 
                    containerProps={{ style: { width: "100%", height: "100%" } }}
                  >
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <img 
                        ref={(el: any) => { if (el) imgRefs.current[index] = el; }} 
                        src={img} 
                        alt={`${product.name}-${index}`} 
                        className="w-full h-full object-cover pointer-events-none" 
                        style={{ willChange: "transform" }} 
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                    </div>
                  </QuickPinchZoom>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="absolute top-6 right-6 z-40 flex flex-col gap-4">
              <button onClick={() => handleManualZoom('in')} className="p-4 bg-white/90 rounded-2xl shadow-2xl text-black active:scale-90 transition-all border border-gray-100"><ZoomIn size={24} /></button>
              <button onClick={() => handleManualZoom('out')} className="p-4 bg-white/90 rounded-2xl shadow-2xl text-black active:scale-90 transition-all border border-gray-100"><ZoomOut size={24} /></button>
            </div>
          </div>

          {/* DETAILS SECTION */}
          <div className="flex flex-col space-y-8 py-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">{product.name}</h1>
              <div className="flex items-center gap-6">
                <p className="text-4xl font-bold text-primary">₹{product.selling_price?.toLocaleString()}</p>
                <p className="text-2xl text-gray-400 line-through font-light italic">₹{product.original_price?.toLocaleString()}</p>
              </div>
              <p className={`text-sm mt-3 font-bold ${product.stock < 5 ? 'text-red-500 font-extrabold animate-pulse' : 'text-green-600'}`}>
                {product.stock > 0 ? `Only ${product.stock} items left in stock!` : 'Out of Stock'}
              </p>
            </div>

            <p className="text-gray-600 leading-relaxed text-xl font-light">{product.description}</p>

            {/* FEATURE: Color Variant Circles (Grouping) */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Available Colors</h3>
                <div className="flex flex-wrap gap-4">
                  {/* Current Product Circle */}
                  <div className="w-16 h-16 rounded-full border-2 border-black p-1 shadow-md">
                    <img src={product.thumbnail} className="w-full h-full rounded-full object-cover" alt="current" />
                  </div>
                  {/* Variant Circles */}
                  {product.variants.map((v: any) => (
                    <Link key={v.id} href={`/product/${v.id}`} className={`relative w-16 h-16 rounded-full border-2 border-transparent hover:border-gray-300 transition-all p-1 ${v.stock === 0 ? 'opacity-40 grayscale' : ''}`}>
                      <img src={v.thumbnail} className="w-full h-full rounded-full object-cover" alt={v.color_name} />
                      {v.stock === 0 && <div className="absolute inset-0 flex items-center justify-center font-bold text-[10px] text-red-600">SOLD</div>}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* FEATURE: Dynamic Logic for Size & Fabric */}
            <div className="flex gap-12 border-t pt-6 border-gray-100">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Fabric</h3>
                <p className="font-semibold text-lg">{product.fabric || "Premium Silk"}</p>
              </div>
              {/* Size only shows if category 'has_size' is true */}
              {product.has_size && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Select Size</h3>
                  <div className="w-14 h-14 flex items-center justify-center rounded-2xl border-2 border-primary bg-primary text-white font-bold text-xl shadow-lg shadow-primary/10">
                    {product.size}
                  </div>
                </div>
              )}
            </div>

            {product.stock > 0 ? (
              <div className="space-y-6 pt-4">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Quantity Selector */}
                  <div className="flex items-center bg-gray-50 rounded-3xl p-3 flex-1 justify-between px-6 border border-gray-100">
                    <button onClick={() => quantity > 1 && setQuantity(quantity - 1)} className="text-3xl font-light hover:text-primary transition-colors">-</button>
                    <span className="font-bold text-2xl">{quantity}</span>
                    <button onClick={() => quantity < product.stock && setQuantity(quantity + 1)} className={`text-3xl font-light ${quantity >= product.stock ? 'text-gray-300 cursor-not-allowed' : 'hover:text-primary'}`}>+</button>
                  </div>

                  <button 
                    onClick={() => {
                      const itemInCart = cart.find(i => i.id === product.id);
                      const currentInCart = itemInCart ? itemInCart.quantity : 0;
                      if (currentInCart + quantity > product.stock) {
                        alert(`Limit Reached: Only ${product.stock} items available.`);
                        return;
                      }
                      addItem({
                        id: product.id, name: product.name, price: `₹${product.selling_price}`,
                        image: product.thumbnail, size: product.size, 
                        color: product.color_name || product.color, quantity: quantity
                      });
                    }}
                    className="flex-[2] h-20 border-2 border-black rounded-3xl font-bold text-xl hover:bg-black hover:text-white transition-all flex items-center justify-center gap-4 active:scale-95"
                  >
                    <ShoppingBag size={24} /> Add to Cart
                  </button>
                </div>

                <button 
                  onClick={() => {
                    const itemInCart = cart.find(i => i.id === product.id);
                    if ((itemInCart ? itemInCart.quantity : 0) + quantity <= product.stock) {
                      addItem({
                        id: product.id, name: product.name, price: `₹${product.selling_price}`,
                        image: product.thumbnail, size: product.size, 
                        color: product.color_name || product.color, quantity: quantity
                      });
                    }
                    router.push("/checkout");
                  }}
                  className="w-full h-20 bg-primary text-white rounded-3xl font-bold text-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all"
                >
                  Buy Now
                </button>
              </div>
            ) : (
              <div className="w-full h-20 bg-gray-100 text-gray-400 rounded-3xl font-bold text-xl flex items-center justify-center border-2 border-dashed border-gray-200">Out of Stock</div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                <Truck size={20} className="text-primary" /> 
                <span className="text-sm font-semibold">Free Delivery</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                <RotateCcw size={20} className="text-primary" /> 
                <span className="text-sm font-semibold">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- SIMILAR PRODUCTS SECTION --- */}
        {similarProducts.length > 0 && (
          <div className="mt-32 border-t pt-20">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8 text-center">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {similarProducts.map((simProduct) => (
                <Link key={simProduct.id} href={`/product/${simProduct.id}`} className="group">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-50 mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                    <img src={simProduct.thumbnail} alt={simProduct.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  </div>
                  <h3 className="font-serif text-lg text-gray-900 truncate group-hover:text-primary transition-colors">{simProduct.name}</h3>
                  <p className="text-primary font-bold">₹{simProduct.selling_price.toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}