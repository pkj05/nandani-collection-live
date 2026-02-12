"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Package, ChevronRight, Truck, Clock, Loader2, ShoppingBag, ArrowLeft, Inbox } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MyOrdersPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ FIX: Server par env variable fail na ho isliye Hardcode kiya
  const API_URL = "https://www.nandanicollection.com/api";

  useEffect(() => {
    if (user && token) {
      const fetchOrders = async () => {
        try {
          // ✅ Corrected URL
          const response = await fetch(`${API_URL}/orders/my-orders`, {
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
          });
          
          if (!response.ok) {
             throw new Error("Failed to fetch orders");
          }
          
          const data = await response.json();
          setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Order fetch failed:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user, token]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <Loader2 className="animate-spin text-[#8B3E48]" size={40} />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Fetching your orders...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
        <div className="bg-gray-50 p-8 rounded-full mb-6">
          <Package size={48} className="text-gray-200" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Login to see orders</h2>
        <p className="text-gray-500 text-sm mb-8 max-w-xs">Please login with your phone number to track your Nandani collection.</p>
        <Link href="/login" className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-xs tracking-widest uppercase shadow-xl active:scale-95 transition-all">
          Login Now
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24 font-sans">
      <div className="max-w-2xl mx-auto px-4 py-12">

        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-serif font-bold text-gray-900 leading-tight">My Orders</h1>
            <p className="text-[#8B3E48] text-[10px] font-black uppercase tracking-[0.2em] mt-1">Nandani Exclusive Tracking</p>
          </div>
          <Link href="/" className="p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow">
            <ArrowLeft size={20} className="text-gray-400" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-[3rem] shadow-xl shadow-gray-200/20 border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Inbox size={32} className="text-gray-200" />
            </div>
            <p className="text-gray-900 font-bold text-lg mb-2">No orders yet</p>
            <p className="text-gray-400 text-sm mb-10">Your favorite ethnic wear is just a click away.</p>
            <Link href="/" className="inline-flex items-center gap-3 bg-[#8B3E48] text-white px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-[#8B3E48]/20">
                SHOP NOW <ShoppingBag size={18} />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => router.push(`/orders/${order.id}`)}
                className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/40 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-1">Receipt ID</span>
                    <span className="font-mono font-black text-lg text-gray-900">#NDN-{order.id.toString().padStart(4, '0')}</span>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${
                    order.status === 'delivered' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${order.status === 'delivered' ? 'bg-green-600' : 'bg-orange-600 animate-pulse'}`} />
                    {order.status}
                  </div>
                </div>

                <div className="flex items-center gap-6 py-6 border-y border-gray-50">
                  <div className="bg-gray-50 w-14 h-14 rounded-2xl flex items-center justify-center text-gray-300">
                    <Truck size={24} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-gray-900">{order.items?.length || 0} Products Ordered</p>
                    <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase mt-1">
                        <Clock size={12} /> {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-gray-900">₹{order.total_amount.toLocaleString()}</p>
                    <p className="text-[9px] text-[#8B3E48] font-black uppercase tracking-tighter mt-1">{order.payment_method}</p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between text-[10px] font-black text-gray-400 group-hover:text-black transition-colors uppercase tracking-[0.2em]">
                  Track Package Detail <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}