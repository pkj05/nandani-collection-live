"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, ShoppingBag, Truck, ArrowRight, Star, ReceiptText, Copy, CheckCircle2, MessageCircle, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";

interface WheelItem {
  id: number;
  label: string;
  color: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const rawOrderId = searchParams.get("id");
  const [copied, setCopied] = useState(false);
  const API_URL = "https://www.nandanicollection.com/api";

  // --- MAGIC WHEEL STATES ---
  const [wheelItems, setWheelItems] = useState<WheelItem[]>([]);
  const [prizeCode, setPrizeCode] = useState<string | null>(null);
  const [prizeText, setPrizeText] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);

  // ✅ ONLINE PAYMENT LOGIC: Checking if it's a PhonePe Transaction (Starts with 'T') or COD
  const isOnlinePayment = rawOrderId?.startsWith("T");
  const formattedOrderId = rawOrderId 
    ? isOnlinePayment 
      ? `TXN-${rawOrderId}` 
      : `NDN-2026-${rawOrderId.toString().padStart(4, '0')}` 
    : "NDN-2026-WAIT";

  // --- CHECK IF ALREADY SPUN ON LOAD ---
  useEffect(() => {
    const initPage = async () => {
      if (!rawOrderId) return;
      
      try {
        // 1. Fetch Wheel Items
        const itemsRes = await fetch(`${API_URL}/coupons/wheel-items`);
        const itemsData = await itemsRes.json();
        setWheelItems(itemsData);

        // 2. Check Spin Status (Anti-Refresh)
        const statusRes = await fetch(`${API_URL}/coupons/spin-result`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_id: rawOrderId }),
        });
        const statusData = await statusRes.json();

        if (statusData.success && statusData.already_spun) {
          setPrizeCode(statusData.coupon_code);
          setPrizeText(statusData.discount_text);
          setHasSpun(true);
        } else {
          // Pehli baar aaya hai toh celebration
          confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        }
      } catch (err) {
        console.error("Initialization failed", err);
      }
    };

    initPage();
  }, [rawOrderId, API_URL]);

  const handleCopy = (text: string, type: 'order' | 'coupon') => {
    navigator.clipboard.writeText(text);
    if (type === 'order') setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnWhatsApp = () => {
    const message = `Hey! 🌸 Maine abhi Nandani Collection se shopping ki aur Magic Wheel ghumakar ye exclusive discount jeeta! Aap bhi inka amazing collection check karo. 👗%0A%0A🎟 *Coupon Code:* ${prizeCode}%0A🌐 https://www.nandanicollection.com%0A📸 @nandani_collections`;
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
  };

  const handleSpin = async () => {
    if (isSpinning || hasSpun || wheelItems.length === 0 || !rawOrderId) return;
    setIsSpinning(true);

    try {
      const res = await fetch(`${API_URL}/coupons/spin-result`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: rawOrderId }) 
      });
      const data = await res.json();

      if (data.success) {
        setPrizeCode(data.coupon_code);
        setPrizeText(data.discount_text);
        
        const sliceAngle = 360 / wheelItems.length;
        const winningIndex = wheelItems.findIndex(item => item.label === data.discount_text);
        
        const safeIndex = winningIndex >= 0 ? winningIndex : 0;
        const stopAt = 360 - (safeIndex * sliceAngle) - (sliceAngle / 2);
        const totalRotation = 1800 + stopAt; 

        if (wheelRef.current) {
          wheelRef.current.style.transition = "transform 6s cubic-bezier(0.15, 0, 0.15, 1)";
          wheelRef.current.style.transform = `rotate(${totalRotation}deg)`;
        }

        setTimeout(() => {
          setIsSpinning(false);
          setHasSpun(true);
          confetti({ particleCount: 250, spread: 100, origin: { y: 0.7 } });
        }, 6200);
      }
    } catch (err) {
      console.error("Spin failed", err);
      setIsSpinning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6 font-sans">
      <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="bg-green-500 p-6 rounded-full shadow-2xl shadow-green-100">
                <Check className="text-white" size={40} strokeWidth={3} />
              </div>
              <Star className="absolute -top-2 -right-2 text-yellow-400 fill-yellow-400 animate-pulse" size={24} />
            </div>
          </div>
          <h1 className="text-4xl font-serif font-bold text-gray-900 tracking-tight">Shubhkaamnaayein!</h1>
          <p className="text-gray-500 font-medium">Aapka order place ho gaya hai.</p>
          
          {/* ✅ New Online Payment Verification Badge */}
          {isOnlinePayment && (
            <div className="flex justify-center mt-3">
              <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                <ShieldCheck size={14} /> Payment Verified Successfully
              </div>
            </div>
          )}
        </div>

        {/* --- 🎡 3D MAGIC WHEEL SECTION --- */}
        <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-gray-100 text-center relative overflow-hidden group">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Sparkles className="text-yellow-500 animate-spin-slow" size={20} />
            <h3 className="text-xl font-serif font-black italic text-gray-900 tracking-wider">Magic Wheel</h3>
            <Sparkles className="text-yellow-500 animate-spin-slow" size={20} />
          </div>
          
          <div className="relative w-80 h-80 mx-auto mb-10">
            {/* 3D Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-6 z-40 drop-shadow-[0_8px_8px_rgba(0,0,0,0.3)]">
              <div className="w-10 h-14 bg-gray-900 rounded-b-full border-x-2 border-b-4 border-white/20 flex items-end justify-center pb-2">
                <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[16px] border-t-white"></div>
              </div>
            </div>

            {/* Outer 3D Ring Effect */}
            <div className="absolute inset-[-12px] rounded-full bg-gradient-to-b from-gray-100 to-gray-300 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_10px_20px_rgba(0,0,0,0.15)] z-0" />

            {/* The SVG Wheel */}
            <div 
              ref={wheelRef}
              className="w-full h-full rounded-full border-[12px] border-gray-900 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(0,0,0,0.5)] relative z-10 overflow-hidden"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {wheelItems.length > 0 ? wheelItems.map((item, i) => {
                  const angle = 360 / wheelItems.length;
                  const startAngle = i * angle;
                  const endAngle = (i + 1) * angle;
                  
                  const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                  const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
                  const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                  const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);
                  
                  return (
                    <g key={i}>
                      <path 
                        d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`} 
                        fill={item.color} 
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="0.4"
                      />
                      {/* ADJUSTED TEXT: Size reduced to 4.2 and x-position moved to 74 */}
                      <text
                        x="74" y="50"
                        fill="white"
                        fontSize="4.2"
                        fontWeight="1000"
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        transform={`rotate(${startAngle + angle / 2}, 50, 50)`}
                        style={{ textShadow: '2px 2px 3px rgba(0,0,0,0.7)' }}
                      >
                        {item.label}
                      </text>
                    </g>
                  );
                }) : <circle cx="50" cy="50" r="50" fill="#f3f4f6" />}
              </svg>

              {/* Center 3D Cap */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-b from-gray-700 to-gray-900 rounded-full z-20 border-4 border-white/90 shadow-[0_5px_15px_rgba(0,0,0,0.5)] flex items-center justify-center">
                   <div className="w-5 h-5 bg-white/20 rounded-full animate-pulse border border-white/30" />
                </div>
              </div>

              {/* Glossy Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-black/20 pointer-events-none rounded-full" />
            </div>
          </div>

          {!hasSpun ? (
            <button 
              onClick={handleSpin} 
              disabled={isSpinning || wheelItems.length === 0}
              className="relative overflow-hidden group bg-gray-900 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all active:scale-95 disabled:bg-gray-300"
            >
              <span className="relative z-10 uppercase">{isSpinning ? "Luck is Spinning..." : "Spin To Win"}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
            </button>
          ) : (
            <div className="animate-in zoom-in duration-700 space-y-5">
              <h2 className="text-3xl font-serif font-black text-gray-900">{prizeText}</h2>
              <div className="flex items-center justify-center gap-3 bg-gray-50 p-5 rounded-[2rem] border-2 border-dashed border-gray-200">
                <span className="font-mono font-bold text-xl text-[#8B3E48] tracking-widest">{prizeCode}</span>
                <button onClick={() => handleCopy(prizeCode!, 'coupon')} className="p-2 hover:bg-gray-200 rounded-xl transition-all">
                  <Copy size={20} />
                </button>
              </div>

              <button 
                onClick={shareOnWhatsApp}
                className="w-full bg-[#25D366] text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:shadow-lg transition-all"
              >
                <MessageCircle size={20} fill="white" /> Share Magic with Friends
              </button>
            </div>
          )}
        </div>

        {/* Order Info Card */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-gray-200/50 pb-5">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left flex items-center gap-2">
              <ReceiptText size={14} /> {isOnlinePayment ? "Transaction ID" : "Order ID"}
            </span>
            <button onClick={() => handleCopy(formattedOrderId, 'order')} className="font-mono text-sm font-bold text-gray-900 flex items-center gap-2">
              {formattedOrderId} {copied ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} className="opacity-20" />}
            </button>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-gray-50 p-3 rounded-2xl text-[#8B3E48]"><Truck size={22} /></div>
            <div className="text-left">
              <p className="font-bold text-gray-900 text-sm italic">Express Delivery</p>
              <p className="text-[11px] text-gray-500 leading-relaxed mt-1">Aapka exclusive collection 3-5 dino mein pahunchega.</p>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-4 pb-10">
          <Link href="/" className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 uppercase tracking-widest text-xs shadow-xl active:scale-[0.98]">
            <ShoppingBag size={18} /> Continue Shopping
          </Link>
          <Link href="/orders" className="w-full text-gray-400 py-2 text-[10px] font-black flex items-center justify-center gap-2 uppercase tracking-widest hover:text-[#8B3E48]">
            View Order Status <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-gray-900" size={40} /></div>}>
      <SuccessContent />
    </Suspense>
  );
}