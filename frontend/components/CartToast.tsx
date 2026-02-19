"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { CheckCircle, X } from "lucide-react";
import Image from "next/image"; // ✅ Performance के लिए Image tag का उपयोग

interface CartToastProps {
  onClose: () => void;
}

const CartToast = ({ onClose }: CartToastProps) => {
  const cart = useCartStore((state: any) => state.cart);
  const toggleCart = useCartStore((state: any) => state.toggleCart);

  const lastItem = cart.length > 0 ? cart[cart.length - 1] : null;

  // ✅ HTTPS FIX: Toast में इमेज लोड करते समय एरर न आए
  const getSafeImageUrl = (url: string) => {
    if (!url) return "https://placehold.co/100?text=IMG";
    return url.replace("http://", "https://");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!lastItem) return null;

  return (
    // ✅ DESIGN PRESERVED: Right Side, Compact, Sleek Dark Glassy Look
    <div className="bg-gray-900/95 backdrop-blur-md text-white shadow-2xl rounded-xl py-3 px-4 w-[300px] flex items-center gap-3 animate-in slide-in-from-right-5 fade-in duration-300 pointer-events-auto border border-white/10">
      
      {/* Small Image - ✅ Next.js Image Component for better performance */}
      <div className="h-10 w-10 bg-white/10 rounded-md overflow-hidden flex-shrink-0 border border-white/10 relative">
        <Image 
          src={getSafeImageUrl(lastItem.image)} 
          alt={lastItem.name} 
          fill
          sizes="40px"
          className="object-cover"
          // ✅ Fallback logic
          onError={(e: any) => { e.currentTarget.src = "https://placehold.co/100?text=IMG"; }} 
        />
      </div>

      {/* Text Info (Compact) */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
            <CheckCircle size={12} className="text-green-400" />
            <p className="text-[10px] font-bold uppercase tracking-wider text-green-400">Added</p>
        </div>
        <h4 className="text-xs font-medium text-gray-100 truncate">{lastItem.name}</h4>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-end gap-1">
        {/* ✅ Accessibility Fix: aria-label added */}
        <button 
            onClick={onClose} 
            aria-label="Close notification"
            className="text-gray-400 hover:text-white transition-colors"
        >
            <X size={14} />
        </button>
        <button 
            onClick={() => { onClose(); toggleCart(); }}
            className="text-[10px] font-bold underline decoration-gray-500 underline-offset-2 hover:text-gray-300 transition-colors"
        >
            View Cart
        </button>
      </div>
    </div>
  );
};

export default CartToast;