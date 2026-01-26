"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { CheckCircle, X, ShoppingBag } from "lucide-react";

const CartToast = () => {
  const [visible, setVisible] = useState(false);
  const [lastItem, setLastItem] = useState<any>(null);
  const cart = useCartStore((state) => state.cart);
  const toggleCart = useCartStore((state) => state.toggleCart);

  // Jab bhi cart me naya item judega, toast dikhao
  useEffect(() => {
    if (cart.length > 0) {
      const latest = cart[cart.length - 1];
      setLastItem(latest);
      setVisible(true);

      // 4 second baad apne aap gayab ho jaye
      const timer = setTimeout(() => {
        setVisible(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [cart]);

  if (!visible || !lastItem) return null;

  return (
    <div className="fixed top-20 right-4 z-[200] animate-in slide-in-from-right-full duration-300">
      <div className="bg-white border border-gray-100 shadow-2xl rounded-2xl p-4 w-[320px] flex gap-4 items-center">
        {/* Product Image */}
        <div className="h-16 w-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          <img src={lastItem.image} alt={lastItem.name} className="w-full h-full object-cover" />
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-1 text-green-600 mb-1">
            <CheckCircle size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Added to Cart</span>
          </div>
          <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{lastItem.name}</h4>
          <button 
            onClick={() => { setVisible(false); toggleCart(); }}
            className="text-primary text-xs font-bold underline mt-1"
          >
            View Cart
          </button>
        </div>

        {/* Close */}
        <button onClick={() => setVisible(false)} className="text-gray-300 hover:text-gray-500">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default CartToast;