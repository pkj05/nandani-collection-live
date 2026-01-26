"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation"; // URL se ID lene ke liye
import { ShoppingBag, Heart, Truck, RotateCcw, ShieldCheck, Star, CreditCard, Loader2 } from "lucide-react";
// 1. Store Import kiya
import { useCartStore } from "@/store/useCartStore";

export default function ProductDetail() {
  const params = useParams(); // ID nikalne ke liye
  const productId = params.id;

  // 2. Store se addItem function nikala
  const addItem = useCartStore((state) => state.addItem);

  // --- Dynamic State ---
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', backgroundPosition: '0% 0%', left: 0, top: 0 });
  
  const imageRef = useRef<HTMLDivElement>(null);

  // --- Backend se data mangana ---
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/products?id=${productId}`);
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          const item = data[0];
          setProduct(item);
          setSelectedSize(item.size);
          setSelectedColor(item.color);
        }
      } catch (error) {
        console.error("Product detail fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProductDetails();
  }, [productId]);

  // Related Products (Inhe filhaal fake rakhte hain, baad mein dynamic karenge)
  const relatedProducts = [
    { id: 2, name: "Ruby Red Suit", price: "₹3,499", image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=2670&auto=format&fit=crop" },
    { id: 3, name: "Green Silk Saree", price: "₹5,299", image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=2574&auto=format&fit=crop" },
    { id: 4, name: "Cotton Pink Kurti", price: "₹1,299", image: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=2574&auto=format&fit=crop" },
    { id: 5, name: "Party Wear Suit", price: "₹4,999", image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=2534&auto=format&fit=crop" },
  ];

  // 3. Button Click handle karne ka function
  const handleAddToCart = (p = product) => {
    if (!p) return;
    addItem({
      id: p.id,
      name: p.name,
      price: `₹${p.selling_price || p.price}`, // Dynamic price from DB
      image: p.thumbnail || p.image,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const xPos = e.clientX - left;
    const yPos = e.clientY - top;
    const xPercent = (xPos / width) * 100;
    const yPercent = (yPos / height) * 100;

    setZoomStyle({ display: 'block', backgroundPosition: `${xPercent}% ${yPercent}%`, left: xPos, top: yPos });
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-primary" size={48} />
      <p className="font-medium text-gray-500 font-serif">Nandani Collection: Loading Details...</p>
    </div>
  );

  if (!product) return <div className="text-center py-20 text-xl font-serif">Product Not Found!</div>;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-24">
          
          {/* IMAGE SECTION */}
          <div 
            className="relative h-[650px] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 cursor-none shadow-sm group"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setZoomStyle(prev => ({ ...prev, display: 'none' }))}
            ref={imageRef}
          >
            <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
            <div 
              className="absolute pointer-events-none border-4 border-white shadow-2xl rounded-full w-52 h-52 overflow-hidden z-10"
              style={{
                display: zoomStyle.display,
                left: zoomStyle.left,
                top: zoomStyle.top,
                transform: 'translate(-50%, -50%)',
                backgroundImage: `url(${product.thumbnail})`,
                backgroundPosition: zoomStyle.backgroundPosition,
                backgroundSize: '350%',
                backgroundRepeat: 'no-repeat',
              }}
            ></div>
          </div>

          {/* DETAILS SECTION */}
          <div className="flex flex-col">
            <div className="mb-6">
              <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-4">
                <p className="text-3xl font-bold text-primary">₹{product.selling_price.toLocaleString()}</p>
                <p className="text-xl text-gray-400 line-through">₹{product.original_price.toLocaleString()}</p>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

            {/* Colors Section (Using DB Data) */}
            <div className="mb-8">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Color: {selectedColor}</h3>
              <div className="flex gap-4">
                <button className={`w-10 h-10 rounded-full border-2 p-0.5 border-primary scale-110`}>
                  <div className="w-full h-full rounded-full" style={{ backgroundColor: product.color.toLowerCase() }}></div>
                </button>
              </div>
            </div>

            {/* Sizes Section (Using DB Data) */}
            <div className="mb-8">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Size: {selectedSize}</h3>
              <div className="flex gap-3">
                <button className="w-12 h-12 flex items-center justify-center rounded-lg border-2 border-primary bg-primary text-white font-medium">{product.size}</button>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-6 mb-10">
              <div className="flex flex-col gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-lg h-14 w-32">
                  <button onClick={() => quantity > 1 && setQuantity(quantity-1)} className="flex-1 text-xl">-</button>
                  <span className="px-2 font-bold text-lg">{quantity}</span>
                  <button onClick={() => setQuantity(quantity+1)} className="flex-1 text-xl">+</button>
                </div>
                <button className="h-14 w-32 border-2 border-gray-200 rounded-lg flex items-center justify-center group">
                  <Heart size={24} className="text-gray-400 group-hover:text-red-500" />
                </button>
              </div>

              <div className="flex-1 flex flex-col gap-4">
                <button 
                  onClick={() => handleAddToCart()} 
                  className="h-14 border-2 border-gray-900 text-gray-900 rounded-lg font-bold flex items-center justify-center gap-3 hover:bg-gray-900 hover:text-white transition-all"
                >
                  <ShoppingBag size={20} /> Add to Cart
                </button>
                <button className="h-14 bg-primary text-white rounded-lg font-bold flex items-center justify-center gap-3 shadow-lg">
                  <CreditCard size={20} /> Buy Now
                </button>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck size={18} className="text-primary" />
                <span>Delivery within 2-3 days</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <RotateCcw size={18} className="text-primary" />
                <span>Easy 7-day returns & exchange</span>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        <div className="border-t border-gray-100 pt-16">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-10 text-center">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="relative h-80 overflow-hidden rounded-xl bg-gray-100 mb-4">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 invisible group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(item as any); }}
                      className="w-full bg-white/95 backdrop-blur-sm text-gray-900 py-3 rounded-lg shadow-xl font-bold text-xs flex items-center justify-center gap-2"
                    >
                      <ShoppingBag size={14} /> Quick Add
                    </button>
                  </div>
                </div>
                <h3 className="font-serif text-lg text-gray-900">{item.name}</h3>
                <p className="text-primary font-bold">{item.price}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}