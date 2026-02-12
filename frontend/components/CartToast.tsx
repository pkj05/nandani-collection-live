"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { CheckCircle, X } from "lucide-react";

interface CartToastProps {
  onClose: () => void;
}

const CartToast = ({ onClose }: CartToastProps) => {
  const cart = useCartStore((state: any) => state.cart);
  const toggleCart = useCartStore((state: any) => state.toggleCart);

  const lastItem = cart.length > 0 ? cart[cart.length - 1] : null;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!lastItem) return null;

  return (
    // ✅ DESIGN CHANGE: Right Side, Compact (Not Wide), Sleek Dark Glassy Look
    <div className="bg-gray-900/95 backdrop-blur-md text-white shadow-2xl rounded-xl py-3 px-4 w-[300px] flex items-center gap-3 animate-in slide-in-from-right-5 fade-in duration-300 pointer-events-auto border border-white/10">
      
      {/* Small Image */}
      <div className="h-10 w-10 bg-white/10 rounded-md overflow-hidden flex-shrink-0 border border-white/10">
        <img 
          src={lastItem.image} 
          alt={lastItem.name} 
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.src = "https://placehold.co/100?text=IMG"; }} 
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
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
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