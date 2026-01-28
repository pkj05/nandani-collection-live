"use client";

import { useCartStore } from "@/store/useCartStore";
import { X, ShoppingBag, Plus, Minus, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const CartDrawer = () => {
  // Store से डेटा और फंक्शन्स लिए
  const { cart, isOpen, toggleCart, removeItem, updateQuantity } = useCartStore();
  
  // Naya State: Cart items ka live stock store karne ke liye
  const [productStocks, setProductStocks] = useState<{ [key: number]: number }>({});
  const [stockLoading, setStockLoading] = useState(false);

  // --- LIVE STOCK CHECK LOGIC ---
  useEffect(() => {
    const fetchLatestStocks = async () => {
      if (cart.length === 0) return;
      try {
        setStockLoading(true);
        const stockData: { [key: number]: number } = {};
        
        // Har cart item ke liye backend se latest stock mangao
        for (const item of cart) {
          const res = await fetch(`http://192.168.1.8:8000/api/products?id=${item.id}`);
          const data = await res.json();
          if (data.length > 0) {
            stockData[item.id] = data[0].stock;
          }
        }
        setProductStocks(stockData);
      } catch (error) {
        console.error("Cart stock fetch error:", error);
      } finally {
        setStockLoading(false);
      }
    };

    if (isOpen) {
      fetchLatestStocks();
    }
  }, [isOpen, cart.length]); // Drawer khulne par ya item delete hone par update hoga

  // Total Price calculate करने के लिए (Purana Logic)
  const subtotal = cart.reduce((acc, item) => {
    const rawPrice = item.price ? String(item.price).replace(/[^\d]/g, "") : "0";
    const price = parseInt(rawPrice || "0");
    return acc + price * (item.quantity || 1);
  }, 0);

  return (
    <>
      {/* 1. Black Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleCart}
      />

      {/* 2. Side Panel */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[110] shadow-2xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        
        {/* Header Section */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-primary" />
            <h2 className="text-xl font-bold font-serif uppercase tracking-wider">Your Cart</h2>
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{cart.length} Items</span>
          </div>
          <button onClick={toggleCart} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Items List Section */}
        <div className="flex-1 overflow-y-auto p-6 h-[calc(100vh-250px)]">
          {cart.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center">
              <ShoppingBag size={64} className="text-gray-200 mb-4" />
              <p className="text-gray-500 mb-6 font-medium">Your cart is feeling light!</p>
              <button 
                onClick={toggleCart}
                className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity"
              >
                Go Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => {
                const maxStock = productStocks[item.id] ?? 99; // Backend se aaya stock ya fallback
                const isLimitReached = item.quantity >= maxStock;

                return (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4 border-b border-gray-50 pb-6 relative group">
                    <div className="h-24 w-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <h3 className="font-bold text-gray-900 leading-tight pr-4">{item.name}</h3>
                        <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mb-3">Size: {item.size} | Color: {item.color}</p>
                      
                      <div className="flex justify-between items-center">
                        {/* Functional Quantity Control */}
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                          <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="px-3 py-1 hover:bg-white transition-colors"
                          >-</button>
                          <span className="px-2 text-sm font-bold w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => {
                              // Stock Limit Check before adding
                              if (item.quantity < maxStock) {
                                updateQuantity(item.id, item.quantity + 1);
                              }
                            }}
                            className={`px-3 py-1 transition-colors ${isLimitReached ? 'text-gray-300 cursor-not-allowed bg-gray-100' : 'hover:bg-white'}`}
                          >+</button>
                        </div>
                        <span className="font-bold text-gray-900">
                          ₹{(item.price ? parseInt(String(item.price).replace(/[^\d]/g, "")) : 0).toLocaleString()}
                        </span>
                      </div>

                      {/* Stock Warning Message */}
                      {isLimitReached && (
                        <p className="text-[10px] text-red-500 font-bold mt-2 uppercase tracking-tight italic">
                          Maximum available stock reached
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer: Total & Checkout Button */}
        {cart.length > 0 && (
          <div className="absolute bottom-0 left-0 w-full bg-white border-t p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-500 font-medium">Subtotal</span>
              <span className="text-2xl font-bold text-primary">₹{subtotal.toLocaleString()}</span>
            </div>
            <Link 
              href="/checkout" 
              className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:opacity-95 transition-opacity shadow-lg shadow-primary/20"
              onClick={toggleCart}
            >
              Secure Checkout <CreditCard size={18} />
            </Link>
            <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest">
              Shipping & Taxes calculated at checkout
            </p>
          </div>
        )}
      </div>
    </>
  );
};

// CreditCard icon helper
const CreditCard = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
);

export default CartDrawer;