"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore"; 
import { ShieldCheck, Truck, Banknote, ChevronLeft, AlertCircle, Loader2, User, Smartphone, Tag, Ticket, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth(); 
  const { cart, clearCart } = useCartStore() as any; 
  const [paymentMethod, setPaymentMethod] = useState("upi");
  
  // --- COUPON STATES ---
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  
  const [loading, setLoading] = useState(false); 
  
  // ✅ 1. Hardcoded API URL (Django Backend)
  const API_URL = "https://www.nandanicollection.com/api";

  // Logic: Phone number se prefix (+91) hatane ke liye
  const formatPhone = (phoneStr: string) => {
    if (!phoneStr) return "";
    return phoneStr.replace(/\D/g, "").slice(-10);
  };

  // INITIAL STATE
  const [form, setForm] = useState({
    name: user?.full_name || "",
    phone: formatPhone(user?.phone || ""),
    address: user?.address || "", 
    pincode: user?.pincode || ""  
  });

  const [error, setError] = useState("");

  // EFFECT: Auto-fill form on login
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.full_name || prev.name,
        phone: formatPhone(user.phone || ""),
        address: user.address || prev.address,
        pincode: user.pincode || prev.pincode
      }));
    }
  }, [user]);

  // --- CALCULATION LOGIC ---
  const subtotal = cart.reduce((acc: number, item: any) => {
    const price = typeof item.price === "string" 
      ? parseInt(item.price.replace(/[^\d]/g, "")) 
      : Number(item.price);
    return acc + (price || 0) * (item.quantity || 1);
  }, 0);

  // Dynamic Discount Calculation from Backend Data
  const discount = appliedCoupon ? Number(appliedCoupon.discount_amount) : 0; 
  const shipping = subtotal > 1499 ? 0 : 99;
  const total = subtotal - discount + shipping;

  // --- APPLY COUPON LOGIC ---
  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponLoading(true);
    setCouponError("");

    try {
      const response = await fetch(`${API_URL}/coupons/validate-coupon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, cart_total: subtotal }),
      });
      const result = await response.json();

      if (result.success) {
        setAppliedCoupon(result);
        setIsCouponApplied(true);
        setCouponError("");
      } else {
        setCouponError(result.message);
        setAppliedCoupon(null);
        setIsCouponApplied(false);
      }
    } catch (err) {
      setCouponError("Coupon check fail ho gaya.");
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setIsCouponApplied(false);
    setCouponCode("");
    setCouponError("");
  };

  // --- ORDER & PAYMENT LOGIC ---
  const handlePlaceOrder = async () => {
    if (!form.name || form.phone.length !== 10 || !form.address || !form.pincode) {
      setError("Please fill all details correctly. Phone must be exactly 10 digits.");
      return;
    }
    setError("");
    setLoading(true);

    const orderData = {
      full_name: form.name,
      phone_number: `+91${form.phone}`, 
      address: form.address,
      pincode: form.pincode,
      payment_method: paymentMethod,
      total_amount: total,
      shipping_charges: shipping,
      coupon_code: appliedCoupon ? appliedCoupon.coupon_code : null,
      items: cart.map((item: any) => ({
          product_id: item.id,
          variant_id: item.variant_id, 
          size_id: item.size_id || null, 
          quantity: item.quantity,
          price: typeof item.price === "string" ? parseInt(item.price.replace(/[^\d]/g, "")) : Number(item.price),
          size: item.size || "Standard", 
          color: item.color || "Default"
      }))
    };

    try {
      // Step 1: Django Backend me Order Create karna
      const response = await fetch(`${API_URL}/orders/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        // Step 2: Check Payment Method
        if (paymentMethod === "upi") {
          // --- PHONEPE PAYMENT INTEGRATION ---
          try {
            const payRes = await fetch("/payment/pay", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                amount: total, 
                transactionId: `NDN-${result.order_id}`, // Apne order ID ko PhonePe transaction ID bana diya
                name: form.name,
                mobile: form.phone
              })
            });
            const payData = await payRes.json();
            
            if (payData.success && payData.url) {
              clearCart(); // Payment page par bhejne se pehle cart clear kar do
              window.location.href = payData.url; // Redirecting to PhonePe
            } else {
              setError(payData.error || "Payment Gateway link generate nahi hua.");
              setLoading(false);
            }
          } catch (payErr) {
            setError("Payment initiate karne me error aayi. Please try again.");
            setLoading(false);
          }
        } else {
          // --- COD LOGIC (Old Flow) ---
          clearCart(); 
          router.push(`/checkout/success?id=${result.order_id}`);
        }
      } else {
        setError(result.message || "Something went wrong while creating order.");
        setLoading(false);
      }
    } catch (err) {
      setError("Server connection failed. Is your Django backend running?");
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-serif mb-4 italic text-gray-400">Aapka cart khali hai!</h2>
        <Link href="/" className="bg-[#8B3E48] text-white px-8 py-3 rounded-full font-bold shadow-lg">Shopping Shuru Karein</Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 pb-24 lg:pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-[#8B3E48] mb-8 transition-colors group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-8 space-y-8">
            {!user && (
              <div className="bg-[#8B3E48]/5 border border-[#8B3E48]/10 p-4 rounded-2xl flex items-center justify-between">
                <p className="text-[10px] text-[#8B3E48] font-black uppercase tracking-widest">Login for a faster checkout experience</p>
                <Link href="/login" className="text-xs font-black text-[#8B3E48] underline underline-offset-4">LOGIN</Link>
              </div>
            )}

            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-serif font-bold mb-8 flex items-center gap-3 text-gray-900">
                <Truck className="text-[#8B3E48]" size={28} /> Delivery Details
              </h2>
              
              {error && (
                <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-2 text-sm border border-red-100 font-medium">
                  <AlertCircle size={18} /> {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-gray-400 ml-1">Full Name</label>
                  <input 
                    type="text" placeholder="Recipient Name" 
                    className="w-full p-4 border border-gray-100 rounded-2xl outline-none focus:border-[#8B3E48] bg-gray-50 focus:bg-white transition-all font-medium"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-gray-400 ml-1">Contact Number</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold border-r border-gray-200 pr-3 transition-colors group-focus-within:text-[#8B3E48]">+91</span>
                    <input 
                      type="tel" placeholder="10 Digit Number" 
                      maxLength={10}
                      className="w-full p-4 pl-16 border border-gray-100 rounded-2xl outline-none focus:border-[#8B3E48] bg-gray-50 focus:bg-white transition-all font-medium tracking-widest"
                      value={form.phone}
                      onChange={(e) => setForm({...form, phone: e.target.value.replace(/\D/g, "")})}
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] uppercase font-black text-gray-400 ml-1">Shipping Address</label>
                  <input 
                    type="text" placeholder="House no, Street Name, Landmark, City" 
                    className="w-full p-4 border border-gray-100 rounded-2xl outline-none focus:border-[#8B3E48] bg-gray-50 focus:bg-white transition-all font-medium"
                    value={form.address}
                    onChange={(e) => setForm({...form, address: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-gray-400 ml-1">Pincode</label>
                  <input 
                    type="text" placeholder="6 Digit Code" 
                    maxLength={6}
                    className="w-full p-4 border border-gray-100 rounded-2xl outline-none focus:border-[#8B3E48] bg-gray-50 focus:bg-white transition-all font-medium"
                    value={form.pincode}
                    onChange={(e) => setForm({...form, pincode: e.target.value.replace(/\D/g, "")})}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-serif font-bold mb-8 flex items-center gap-3 text-gray-900">
                <ShieldCheck className="text-[#8B3E48]" size={28} /> Payment Selection
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: "upi", title: "Online Payment", icon: <Smartphone />, desc: "UPI, Cards, Wallets" },
                  { id: "cod", title: "Cash on Delivery", icon: <Banknote />, desc: "Pay at Doorstep" }
                ].map((item) => (
                  <button 
                    key={item.id}
                    type="button"
                    onClick={() => setPaymentMethod(item.id)}
                    className={`p-5 border-2 rounded-2xl flex items-center gap-5 transition-all text-left ${paymentMethod === item.id ? "border-[#8B3E48] bg-[#8B3E48]/5" : "border-gray-50 hover:border-gray-200"}`}
                  >
                    <div className="text-[#8B3E48] bg-white p-2 rounded-lg shadow-sm">{item.icon}</div>
                    <div>
                      <p className="font-black text-xs text-gray-900 uppercase tracking-wide">{item.title}</p>
                      <p className="text-[10px] text-gray-400 font-bold mt-0.5 uppercase tracking-tighter">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 sticky top-24">
              <h3 className="text-xl font-bold mb-8 border-b border-gray-50 pb-5 text-gray-900">Order Summary</h3>
              
              <div className="max-h-60 overflow-y-auto mb-8 space-y-5 pr-3 scrollbar-hide">
                {cart.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-start text-sm">
                        <div className="flex flex-col max-w-[70%]">
                            <span className="font-bold text-gray-800 line-clamp-1 leading-tight">{item.name}</span>
                            <span className="text-[10px] text-gray-400 font-black mt-1 uppercase tracking-tighter">
                              {item.color} | {item.size} × {item.quantity}
                            </span>
                        </div>
                        <span className="font-bold text-gray-900">₹{(Number(item.price) * item.quantity).toLocaleString()}</span>
                    </div>
                ))}
              </div>

              {/* --- DYNAMIC COUPON INPUT --- */}
              <div className="mb-8 p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Ticket size={16} className="text-[#8B3E48]" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-gray-600">Have a Coupon?</span>
                </div>
                
                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Enter Code"
                      className="flex-1 bg-white border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-[#8B3E48] uppercase"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button 
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponCode}
                      className="bg-gray-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-black disabled:bg-gray-300 transition-colors"
                    >
                      {couponLoading ? "..." : "Apply"}
                    </button>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-100 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-green-600 p-1 rounded-md text-white"><Tag size={10} /></div>
                      <span className="text-xs font-black text-green-700 uppercase tracking-tighter">{appliedCoupon.coupon_code}</span>
                    </div>
                    <button onClick={removeCoupon} className="text-green-800 hover:text-red-500 transition-colors"><X size={14} /></button>
                  </div>
                )}
                {couponError && <p className="text-[10px] text-red-500 font-bold mt-2 ml-1 italic">{couponError}</p>}
              </div>

              <div className="space-y-4 text-sm border-t border-gray-50 pt-8">
                <div className="flex justify-between text-gray-500 font-bold uppercase text-[11px] tracking-widest">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600 font-bold uppercase text-[11px] tracking-widest animate-in fade-in slide-in-from-top-1">
                    <span>Discount</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-500 font-bold uppercase text-[11px] tracking-widest">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-600 font-black" : ""}>
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-3xl font-black border-t border-gray-50 pt-6 mt-6 text-gray-900 tracking-tighter">
                  <span>Total</span>
                  <span className="text-[#8B3E48]">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black mt-10 hover:bg-black transition-all active:scale-[0.97] flex items-center justify-center gap-3 shadow-2xl shadow-gray-300 disabled:bg-gray-300 uppercase tracking-widest text-sm"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (paymentMethod === 'upi' ? `Pay ₹${total.toLocaleString()} Now` : `Place COD Order`)}
              </button>
              
              <div className="flex items-center justify-center gap-2 mt-6">
                <ShieldCheck size={14} className="text-green-500" />
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Secure Checkout Powered by Nandani</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}