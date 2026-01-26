"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { ShieldCheck, Truck, CreditCard, Smartphone, QrCode, Banknote, ChevronLeft, Ticket, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [coupon, setCoupon] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  
  // Validation State
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: ""
  });
  const [error, setError] = useState("");

  // Calculation Logic
  const subtotal = cart.reduce((acc, item) => {
    const price = parseInt(item.price.replace(/[^\d]/g, ""));
    return acc + price * item.quantity;
  }, 0);

  const discount = isCouponApplied ? subtotal * 0.1 : 0; // 10% Discount Example
  const shipping = subtotal > 1499 ? 0 : 99;
  const total = subtotal - discount + shipping;

  const handlePlaceOrder = () => {
    if (!form.name || form.phone.length !== 10 || !form.address || !form.pincode) {
      setError("Please fill all details correctly. Phone must be 10 digits.");
      return;
    }
    setError("");
    alert(`Order placing via ${paymentMethod}...`);
    // Yahan hum Django API call karenge
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-serif mb-4">Aapka cart khali hai!</h2>
        <Link href="/" className="bg-primary text-white px-8 py-3 rounded-full font-bold">Shopping Shuru Karein</Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-primary mb-8 transition-colors">
          <ChevronLeft size={16} /> Back
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: Shipping & Payment */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Delivery Details */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
                <Truck className="text-primary" /> Delivery Details
              </h2>
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input 
                  type="text" placeholder="Full Name" 
                  className="w-full p-3 border rounded-lg outline-primary"
                  onChange={(e) => setForm({...form, name: e.target.value})}
                />
                
                {/* Phone with +91 Prefix */}
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium border-r pr-2">+91</span>
                  <input 
                    type="tel" placeholder="Phone Number" 
                    maxLength={10}
                    className="w-full p-3 pl-14 border rounded-lg outline-primary"
                    onChange={(e) => setForm({...form, phone: e.target.value.replace(/\D/g, "")})}
                  />
                </div>

                <input 
                  type="text" placeholder="Complete Address (House no, Colony, City)" 
                  className="w-full p-3 border rounded-lg outline-primary md:col-span-2"
                  onChange={(e) => setForm({...form, address: e.target.value})}
                />
                
                <input 
                  type="text" placeholder="Pincode" 
                  maxLength={6}
                  className="w-full p-3 border rounded-lg outline-primary"
                  onChange={(e) => setForm({...form, pincode: e.target.value.replace(/\D/g, "")})}
                />
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
                <ShieldCheck className="text-primary" /> Payment Method
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: "upi", title: "UPI (GPay/PhonePe)", icon: <Smartphone />, desc: "Fast & Secure" },
                  { id: "qr", title: "Scan QR Code", icon: <QrCode />, desc: "Pay via Any App" },
                  { id: "card", title: "Card / Netbanking", icon: <CreditCard />, desc: "Safe & Reliable" },
                  { id: "cod", title: "Cash on Delivery", icon: <Banknote />, desc: "Pay at Doorstep" }
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => setPaymentMethod(item.id)}
                    className={`p-4 border-2 rounded-xl flex items-center gap-4 transition-all ${paymentMethod === item.id ? "border-primary bg-primary/5" : "border-gray-100"}`}
                  >
                    <div className="text-primary">{item.icon}</div>
                    <div className="text-left">
                      <p className="font-bold text-sm">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Summary & Coupon */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-xl font-bold mb-6 border-b pb-4">Order Summary</h3>
              
              {/* Coupon Section */}
              <div className="mb-6">
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block tracking-wider">Discount Coupon</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="text" placeholder="Apply Coupon"
                      className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm outline-primary"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    />
                  </div>
                  <button 
                    onClick={() => setIsCouponApplied(!isCouponApplied)}
                    className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors"
                  >
                    {isCouponApplied ? "Remove" : "Apply"}
                  </button>
                </div>
                {isCouponApplied && <p className="text-xs text-green-600 mt-2 font-medium">Coupon applied successfully!</p>}
              </div>

              {/* Bill Details */}
              <div className="space-y-3 text-sm border-t pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                {isCouponApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-600 font-bold" : ""}>
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t pt-3 mt-3">
                  <span>Total Payable</span>
                  <span className="text-primary">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder}
                className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold mt-8 hover:bg-black transition-all active:scale-[0.98]"
              >
                Place Order via {paymentMethod.toUpperCase()}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}