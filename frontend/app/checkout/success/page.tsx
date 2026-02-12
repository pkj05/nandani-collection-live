"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, ShoppingBag, Truck, ArrowRight, Star, ReceiptText, Copy, CheckCircle2, MessageCircle } from "lucide-react";
import confetti from "canvas-confetti";

function SuccessContent() {
  const searchParams = useSearchParams();
  const rawOrderId = searchParams.get("id");
  const [copied, setCopied] = useState(false);

  // Professional Order ID Format: NDN-2026-XXXX
  const formattedOrderId = rawOrderId ? `NDN-2026-${rawOrderId.padStart(4, '0')}` : "NDN-2026-WAIT";

  // Copy Function
  const handleCopy = () => {
    if (rawOrderId) {
      navigator.clipboard.writeText(formattedOrderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Celebration Animation
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Success Icon Section */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="bg-green-500 p-6 rounded-full shadow-2xl shadow-green-100 animate-bounce">
              <Check className="text-white" size={40} strokeWidth={3} />
            </div>
            <Star className="absolute -top-2 -right-2 text-yellow-400 fill-yellow-400 animate-pulse" size={24} />
            <Star className="absolute -bottom-2 -left-4 text-[#8B3E48] fill-[#8B3E48] animate-pulse delay-75" size={18} />
          </div>
        </div>

        <div className="text-center space-y-3">
          <h1 className="text-4xl font-serif font-bold text-gray-900 tracking-tight">Shubhkaamnaayein!</h1>
          <p className="text-gray-500 font-medium px-4 leading-relaxed">
            Aapka order successfully place ho gaya hai. Hum jaldi hi ise packing ke liye bhejenge.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="mt-10 bg-gray-50/80 backdrop-blur-sm rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-gray-200/50 pb-5">
            <div className="flex items-center gap-2">
              <ReceiptText size={16} className="text-[#8B3E48]" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Order ID</span>
            </div>
            <button 
              onClick={handleCopy}
              className="group flex items-center gap-2 font-mono text-sm font-bold text-gray-900 hover:text-[#8B3E48] transition-colors"
            >
              {formattedOrderId}
              {copied ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} className="opacity-30 group-hover:opacity-100" />}
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-white p-3 rounded-2xl shadow-sm text-[#8B3E48]">
                <Truck size={22} />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Express Delivery</p>
                <p className="text-[11px] text-gray-500 leading-relaxed mt-1">
                  Aapka exclusive collection 3-5 dino mein aapke dwar par hoga.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white p-3 rounded-2xl shadow-sm text-blue-500">
                <MessageCircle size={22} />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Updates on WhatsApp</p>
                <p className="text-[11px] text-gray-500 leading-relaxed mt-1">
                  Hum aapko tracking link WhatsApp par bhi bhej denge.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="mt-10 space-y-4">
          <Link 
            href="/" 
            className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-[0.98] uppercase tracking-widest text-xs"
          >
            <ShoppingBag size={18} /> Continue Shopping
          </Link>
          
          {/* ✅ MATCHED: Ab ye button aapke 'orders/page.tsx' par le jayega */}
          <Link 
            href={rawOrderId ? `/orders/${rawOrderId}` : "/orders"} 
            className="w-full text-gray-400 py-2 text-[10px] font-black flex items-center justify-center gap-2 hover:text-[#8B3E48] transition-all group tracking-widest uppercase"
          >
            View Order Status
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Bottom Decorative Branding */}
        <div className="mt-16 flex flex-col items-center gap-2 opacity-20">
           <div className="w-16 h-[1px] bg-gray-400"></div>
           <p className="text-[10px] uppercase tracking-[0.5em] font-black text-gray-900">
             Nandani Ethnic Wear
           </p>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <div className="w-10 h-10 border-4 border-gray-100 border-t-gray-900 rounded-full animate-spin" />
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Confirming Order...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}