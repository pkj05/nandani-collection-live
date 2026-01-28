"use client";

import { useEffect, useState, useRef } from "react";
import { useCartStore } from "@/store/useCartStore";
import { CheckCircle, X } from "lucide-react";

const CartToast = () => {
  const [visible, setVisible] = useState(false);
  const [lastItem, setLastItem] = useState<any>(null);
  
  const cart = useCartStore((state) => state.cart);
  const lastAction = useCartStore((state) => state.lastAction); // Action ko store se nikala
  const toggleCart = useCartStore((state) => state.toggleCart);
  
  const isFirstRender = useRef(true);
  const prevCartRef = useRef(cart);
  const [hasMounted, setHasMounted] = useState(false); // 1. Mounting track karein

  // 2. Sirf tabhi chale jab browser me component load ho jaye
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    // 3. Agar component mount nahi hua ya pehla render hai, to skip karo
    if (!hasMounted) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevCartRef.current = cart; // Refresh ke waqt ka data sync karein
      return;
    }

    // 4. Cart ki lambai ya content check karein (JSON stringify deep check ke liye)
    const cartChanged = JSON.stringify(cart) !== JSON.stringify(prevCartRef.current);

    // FIX: Sirf tabhi toast dikhao jab cart badla ho AUR action 'add' ho
    if (cart.length > 0 && cartChanged && lastAction === 'add') {
      const latest = cart[cart.length - 1];
      setLastItem(latest);
      
      setVisible(false); 
      setTimeout(() => setVisible(true), 10);

      const timer = setTimeout(() => {
        setVisible(false);
      }, 3500);

      prevCartRef.current = cart;
      return () => clearTimeout(timer);
    } else {
      // Agar update ya remove hua hai, to sirf reference update karein, toast na dikhayein
      prevCartRef.current = cart;
    }
  }, [cart, hasMounted, lastAction]); // Dependency mein lastAction joda

  // 5. Server-side rendering ke waqt kuch mat dikhao
  if (!hasMounted || !visible || !lastItem) return null;

  return (
    <div className="fixed top-24 right-4 z-[200] animate-in slide-in-from-right-full fade-in duration-300">
      <div className="bg-white border border-gray-100 shadow-2xl rounded-2xl p-4 w-[320px] flex gap-4 items-center ring-1 ring-black/5">
        
        {/* Product Image */}
        <div className="h-16 w-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 shadow-inner">
          <img 
            src={lastItem.image} 
            alt={lastItem.name} 
            className="w-full h-full object-cover" 
          />
        </div>

        {/* Info Section */}
        <div className="flex-1">
          <div className="flex items-center gap-1 text-green-600 mb-0.5">
            <CheckCircle size={14} fill="currentColor" className="text-white" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Added to Cart</span>
          </div>
          <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{lastItem.name}</h4>
          <button 
            onClick={() => { setVisible(false); toggleCart(); }}
            className="text-primary text-xs font-bold underline mt-1 hover:text-primary/80 transition-colors"
          >
            View Cart
          </button>
        </div>

        {/* Close Button */}
        <button 
          onClick={() => setVisible(false)} 
          className="text-gray-300 hover:text-gray-500 p-1 hover:bg-gray-50 rounded-full transition-all"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default CartToast;