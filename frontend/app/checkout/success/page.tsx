"use client";

import { useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, ShoppingBag, Truck, ArrowRight, Star } from "lucide-react";
import confetti from "canvas-confetti"; // Confetti import

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  // Apple UX: Screen load hote hi celebration animation
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // Do sides se confetti udayein
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Apple Style Minimalist Success Icon */}
        <div className="flex justify-center mb-10">
          <div className="relative">
            <div className="bg-green-500 p-6 rounded-full shadow-2xl shadow-green-200 animate-bounce">
              <Check className="text-white" size={48} strokeWidth={3} />
            </div>
            {/* Chhote decorative stars */}
            <Star className="absolute -top-2 -right-2 text-yellow-400 fill-yellow-400 animate-pulse" size={20} />
            <Star className="absolute -bottom-2 -left-4 text-blue-400 fill-blue-400 animate-pulse delay-75" size={16} />
          </div>
        </div>

        <div className="text-center space-y-3">
          <h1 className="text-4xl font-serif font-bold text-gray-900 tracking-tight">Dhanyawad!</h1>
          <p className="text-gray-500 font-medium">Aapka order successfully place ho gaya hai.</p>
        </div>

        {/* Order Info Card - Glassmorphism touch */}
        <div className="mt-12 bg-gray-50/50 backdrop-blur-sm rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-gray-200/50 pb-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order Receipt</span>
            <span className="font-mono text-sm font-bold text-primary">#{orderId || "NANDANI-786"}</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-white p-2 rounded-xl shadow-sm">
                <Truck className="text-gray-900" size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Arriving Soon</p>
                <p className="text-xs text-gray-500 leading-relaxed">Aapka designer collection 2-3 dino mein aapke ghar pahunch jayega.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Apple Style Rounded buttons */}
        <div className="mt-10 space-y-4">
          <Link 
            href="/" 
            className="w-full bg-gray-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-gray-200"
          >
            <ShoppingBag size={20} /> Shopping Jaari Rakhein
          </Link>
          
          <Link 
            href="/" 
            className="w-full text-gray-400 py-2 text-sm font-bold flex items-center justify-center gap-2 hover:text-primary transition-all group"
          >
            Go back to Home 
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Footer Note */}
        <p className="mt-12 text-center text-[10px] text-gray-300 uppercase tracking-[0.2em] font-bold">
          Nandani Designer Collection
        </p>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-primary rounded-full animate-spin" />
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Generating Bill...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}