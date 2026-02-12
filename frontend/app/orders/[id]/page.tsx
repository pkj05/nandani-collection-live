"use client";

// ✅ 1. Next.js ko force karo ki har baar naya data laye
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  Package, Truck, CheckCircle2, Clock, MapPin, 
  ChevronLeft, ShoppingBag, Receipt, Loader2, Lock
} from "lucide-react";
import Link from "next/link";

export default function OrderTrackingPage() {
  const params = useParams();
  const id = params?.id ? String(params.id) : null;
  
  const { token } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Server API URL
  const API_URL = "https://www.nandanicollection.com/api";

  useEffect(() => {
    if (token && id) {
      fetch(`${API_URL}/orders/my-orders`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        // ID match logic
        const found = Array.isArray(data) ? data.find((o: any) => o.id.toString() === id) : null;
        setOrder(found);
        setLoading(false);
      })
      .catch((err) => {
          console.error(err);
          setLoading(false);
      });
    } else {
        // Agar token nahi hai to loading band karo
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }
  }, [id, token]);

  // --- LOADING STATE ---
  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-[#8B3E48]" size={40} />
    </div>
  );

  // --- NOT LOGGED IN STATE ---
  if (!token) return (
    <div className="h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="bg-gray-50 p-6 rounded-full text-[#8B3E48]">
        <Lock size={40} />
      </div>
      <div>
        <h2 className="text-xl font-serif font-bold text-gray-900">Login Required</h2>
        <p className="text-sm text-gray-500 mt-2">Apna order track karne ke liye login karein.</p>
      </div>
      <Link href="/login" className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-xs tracking-widest uppercase shadow-xl">
        Login Now
      </Link>
    </div>
  );

  // --- ORDER NOT FOUND STATE ---
  if (!order) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
      <div className="bg-gray-50 p-6 rounded-full text-gray-300">
        <Package size={40} />
      </div>
      <p className="font-bold text-gray-800 italic">Afsos! Order #{id} nahi mila.</p>
      <Link href="/orders" className="text-[#8B3E48] font-black underline text-sm mt-2">Wapas My Orders par jayein</Link>
    </div>
  );

  // --- ✅ YAHAN SE AAPKA PURANA DESIGN SHURU ---
  const currentStatus = order.status ? order.status.toLowerCase() : "pending";
  
  const steps = [
    { label: "Order Placed", date: order.created_at, icon: <Package size={18} />, active: true },
    { label: "Processing", desc: "Packing", icon: <Clock size={18} />, active: ["confirmed", "shipped", "delivered"].includes(currentStatus) },
    { label: "Shipped", desc: "On the way", icon: <Truck size={18} />, active: ["shipped", "delivered"].includes(currentStatus) },
    { label: "Delivered", desc: "Completed", icon: <CheckCircle2 size={18} />, active: currentStatus === "delivered" }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 font-sans">
      <div className="max-w-xl mx-auto px-4 py-8">
        
        <Link href="/orders" className="flex items-center gap-2 text-gray-400 hover:text-black mb-8 transition-colors group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Back to Orders</span>
        </Link>

        {/* 1. Status Tracker Card */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 mb-6">
          <div className="flex justify-between items-start mb-10">
            <div>
              <p className="text-[10px] font-black text-[#8B3E48] uppercase tracking-[0.2em] mb-1">Live Tracking</p>
              <h1 className="text-2xl font-black text-gray-900 font-mono">#NDN-{order.id.toString().padStart(4, '0')}</h1>
            </div>
            <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${currentStatus === 'delivered' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
              {order.status}
            </div>
          </div>

          <div className="space-y-10 relative">
            <div className="absolute left-[17px] top-2 bottom-2 w-0.5 bg-gray-100" />
            {steps.map((step, idx) => (
              <div key={idx} className="flex gap-6 relative">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center z-10 transition-all duration-500 ${step.active ? 'bg-[#8B3E48] text-white shadow-lg shadow-[#8B3E48]/30' : 'bg-white border-2 border-gray-100 text-gray-300'}`}>
                  {step.icon}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-black uppercase tracking-wide ${step.active ? 'text-gray-900' : 'text-gray-300'}`}>{step.label}</p>
                  <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                    {step.active ? (step.date ? new Date(step.date).toLocaleDateString('en-IN', {day:'numeric', month:'short'}) : "Updated") : "Waiting..."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Items List (Jo gayab ho gaya tha) */}
        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm mb-6">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <ShoppingBag size={14} className="text-[#8B3E48]" /> Items in this Order
          </h3>
          <div className="space-y-4">
            {order.items?.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50/50 rounded-2xl border border-gray-50">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#8B3E48] font-bold text-xs border border-gray-100">
                  {item.quantity}x
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900 line-clamp-1">{item.product_name}</p>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter mt-0.5">
                    {item.color} | {item.size}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-gray-900">₹{item.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Address & Bill Info (Ye bhi wapas aa gaya) */}
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <MapPin size={14} className="text-[#8B3E48]" /> Delivery Address
            </h3>
            <p className="text-sm font-black text-gray-900">{order.full_name}</p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{order.address}, {order.pincode}</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Receipt size={14} className="text-[#8B3E48]" /> Bill Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between font-bold text-gray-500 text-[11px] uppercase tracking-widest">
                <span>Payment Mode</span>
                <span className="text-gray-900">{order.payment_method}</span>
              </div>
              <div className="flex justify-between text-lg font-black pt-4 border-t border-gray-50 text-gray-900 tracking-tighter">
                <span>Grand Total</span>
                <span className="text-[#8B3E48]">₹{order.total_amount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}