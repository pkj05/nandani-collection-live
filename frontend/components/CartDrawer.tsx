"use client";

import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
import Image from "next/image"; // ✅ Next.js Image Component for better performance
import { useEffect, useState } from "react";

export default function CartDrawer() {
  const { cart, isOpen, toggleCart, removeItem, updateQuantity } = useCartStore() as any;
  
  // Hydration Fix
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // ✅ HTTPS FIX: Toast की तरह यहाँ भी इमेज एरर से बचने के लिए
  const getSafeImageUrl = (url: string) => {
    if (!url || url === "" || url === "null") return "https://placehold.co/100x150?text=IMG";
    return url.replace("http://", "https://");
  };

  // Subtotal Calculation
  const subtotal = cart.reduce((acc: number, item: any) => acc + (Number(item.price) * item.quantity), 0);

  return (
    <>
      {/* 1. BACKDROP (Andhera) */}
      <div 
        className={`fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm transition-opacity duration-300
        ${isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
        onClick={toggleCart} 
      />

      {/* 2. DRAWER PANEL (Side se aane wala) */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart Drawer"
        className={`fixed inset-y-0 right-0 z-[101] w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white z-10">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} />
            <h2 className="text-lg font-serif font-bold">Shopping Bag ({cart.length})</h2>
          </div>
          <button 
            onClick={toggleCart}
            aria-label="Close Shopping Bag" // ✅ Accessibility fix
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* CART ITEMS LIST */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-400">
              <ShoppingBag size={64} strokeWidth={1} className="opacity-20" />
              <p className="text-lg font-medium">Your bag is empty.</p>
              <button 
                onClick={toggleCart}
                className="text-black underline font-bold hover:text-gray-600 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item: any) => (
              <div key={`${item.variant_id}-${item.size_id}`} className="flex gap-4 group">
                
                {/* ✅ PERFORMANCE OPTIMIZED IMAGE: Next.js Image with proper sizes */}
                <div className="h-28 w-24 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 relative">
                  <Image 
                    src={getSafeImageUrl(item.image)} 
                    alt={item.name} 
                    fill
                    sizes="100px" // Drawer me images choti hoti hain
                    className="object-cover"
                    onError={(e: any) => { e.currentTarget.src = "https://placehold.co/100x150?text=IMG"; }} 
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                      
                      {/* DELETE BUTTON */}
                      <button 
                        onClick={() => removeItem(item.variant_id, item.size_id)}
                        aria-label={`Remove ${item.name} from bag`} // ✅ Accessibility fix
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <p className="text-xs text-gray-500 uppercase font-medium mt-1">
                      {item.color} {item.size !== "Standard" && `/ ${item.size}`}
                    </p>
                    <p className="text-sm font-bold mt-1">₹{Number(item.price).toLocaleString()}</p>
                  </div>

                  {/* Quantity & Stock Logic */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-gray-200 rounded-lg h-9">
                      
                      {/* MINUS */}
                      <button 
                        onClick={() => {
                            if (item.quantity > 1) {
                                updateQuantity(item.variant_id, item.size_id, item.quantity - 1);
                            }
                        }}
                        aria-label="Decrease quantity"
                        className="w-8 h-full flex items-center justify-center hover:bg-gray-50 rounded-l-lg disabled:opacity-30 disabled:cursor-not-allowed"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      
                      {/* PLUS */}
                      <button 
                        onClick={() => updateQuantity(item.variant_id, item.size_id, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className={`w-8 h-full flex items-center justify-center rounded-r-lg transition-colors
                          ${item.quantity >= item.stock ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'hover:bg-gray-50 text-black'}`}
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {item.quantity >= item.stock && (
                      <span className="text-[10px] text-red-500 font-bold uppercase animate-pulse">Max Stock</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER (Checkout) */}
        {cart.length > 0 && (
          <div className="border-t border-gray-100 p-5 space-y-4 bg-gray-50/50">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 text-center">Shipping & taxes calculated at checkout.</p>
            
            <Link 
              href="/checkout" 
              onClick={toggleCart}
              className="w-full py-4 bg-black text-white rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-900 active:scale-[0.98] transition-all"
            >
              Checkout <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}