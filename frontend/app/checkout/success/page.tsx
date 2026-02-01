"use client";

import { useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, ShoppingBag, Truck, ArrowRight, Star, ReceiptText } from "lucide-react";
import confetti from "canvas-confetti";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  // Celebration Animation
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

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
        
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="bg-green-500 p-6 rounded-full shadow-2xl shadow-green-100 animate-bounce">
              <Check className="text-white" size={40} strokeWidth={3} />
            </div>
            <Star className="absolute -top-2 -right-2 text-yellow-400 fill-yellow-400 animate-pulse" size={20} />
            <Star className="absolute -bottom-2 -left-4 text-blue-400 fill-blue-400 animate-pulse delay-75" size={16} />
          </div>
        </div>

        <div className="text-center space-y-3">
          <h1 className="text-4xl font-serif font-bold text-gray-900 tracking-tight">Dhanyawad!</h1>
          <p className="text-gray-500 font-medium px-4">Aapka order successfully place ho gaya hai.</p>
        </div>

        {/* Order Info Card */}
        <div className="mt-10 bg-gray-50/80 backdrop-blur-sm rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-gray-200/50 pb-4">
            <div className="flex items-center gap-2">
              <ReceiptText size={16} className="text-gray-400" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Order ID</span>
            </div>
            <span className="font-mono text-sm font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg">
               #{orderId || "NC-2026-X"}
            </span>
          </div>

          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="bg-white p-2.5 rounded-2xl shadow-sm text-gray-900">
                <Truck size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm italic">Arriving Soon</p>
                <p className="text-xs text-gray-500 leading-relaxed mt-1">
                  Aapka exclusive collection packing ke liye bhej diya gaya hai. 2-4 dino mein delivery ho jayegi.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-10 space-y-4">
          <Link 
            href="/" 
            className="w-full bg-gray-900 text-white py-5 rounded-[1.5rem] font-black flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95"
          >
            <ShoppingBag size={20} /> SHOPPING JAARI RAKHEIN
          </Link>
          
          <Link 
            href="/" 
            className="w-full text-gray-400 py-2 text-xs font-bold flex items-center justify-center gap-2 hover:text-black transition-all group tracking-widest uppercase"
          >
            Go back to Home 
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Bottom Branding */}
        <div className="mt-16 flex flex-col items-center gap-2 opacity-30">
           <div className="w-12 h-[1px] bg-gray-400"></div>
           <p className="text-[9px] uppercase tracking-[0.4em] font-black text-gray-500">
             Nandani Collection
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