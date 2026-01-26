"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ShoppingBag, Heart, Truck, RotateCcw, ShieldCheck, Star, CreditCard } from "lucide-react";
// 1. Store Import kiya
import { useCartStore } from "@/store/useCartStore";

export default function ProductDetail() {
  // 2. Store se addItem function nikala
  const addItem = useCartStore((state) => state.addItem);

  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Royal Blue");
  const [quantity, setQuantity] = useState(1);
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', backgroundPosition: '0% 0%', left: 0, top: 0 });
  
  const imageRef = useRef<HTMLDivElement>(null);

  const product = {
    id: 1, // Unique ID
    name: "Royal Banarasi Silk Saree",
    price: "₹6,499",
    numericPrice: 6499, // Calculation ke liye
    description: "Experience pure elegance with our hand-woven Banarasi Silk Saree.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=2574&auto=format&fit=crop",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Royal Blue", class: "bg-blue-700" },
      { name: "Ruby Red", class: "bg-red-600" },
      { name: "Emerald Green", class: "bg-green-700" },
      { name: "Golden", class: "bg-yellow-500" },
    ],
  };

  const relatedProducts = [
    { id: 2, name: "Ruby Red Suit", price: "₹3,499", image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=2670&auto=format&fit=crop" },
    { id: 3, name: "Green Silk Saree", price: "₹5,299", image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=2574&auto=format&fit=crop" },
    { id: 4, name: "Cotton Pink Kurti", price: "₹1,299", image: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=2574&auto=format&fit=crop" },
    { id: 5, name: "Party Wear Suit", price: "₹4,999", image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=2534&auto=format&fit=crop" },
  ];

  // 3. Button Click handle karne ka function
  const handleAddToCart = (p = product) => {
    addItem({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
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
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            <div 
              className="absolute pointer-events-none border-4 border-white shadow-2xl rounded-full w-52 h-52 overflow-hidden z-10"
              style={{
                display: zoomStyle.display,
                left: zoomStyle.left,
                top: zoomStyle.top,
                transform: 'translate(-50%, -50%)',
                backgroundImage: `url(${product.image})`,
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
              <p className="text-3xl font-bold text-primary">{product.price}</p>
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

            {/* Colors & Sizes ... (Same as before) */}
            <div className="mb-8">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Color: {selectedColor}</h3>
              <div className="flex gap-4">
                {product.colors.map((color) => (
                  <button key={color.name} onClick={() => setSelectedColor(color.name)} className={`w-10 h-10 rounded-full border-2 p-0.5 ${selectedColor === color.name ? "border-primary scale-110" : "border-transparent"}`}><div className={`w-full h-full rounded-full ${color.class}`}></div></button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Select Size</h3>
              <div className="flex gap-3">
                {product.sizes.map((size) => (
                  <button key={size} onClick={() => setSelectedSize(size)} className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-medium ${selectedSize === size ? "border-primary bg-primary text-white" : "border-gray-200"}`}>{size}</button>
                ))}
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
                {/* --- MAIN ADD TO CART BUTTON --- */}
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
                    {/* --- QUICK ADD BUTTON --- */}
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