"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation"; 
import { User, MapPin, Phone, Mail, Save, Loader2, ChevronLeft, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion"; // ✅ Smooth animations ke liye

export default function ProfilePage() {
  const { user, token, refreshUser } = useAuth(); 
  const router = useRouter(); 
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: "",
    address: "",
    pincode: "",
    email: ""
  });

  // Check if profile is incomplete to show alert
  const isIncomplete = !user?.full_name || !user?.address || user?.full_name.trim() === "";

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        address: user.address || "",
        pincode: user.pincode || "",
        email: user.email || ""
      });
    }
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch("https://www.nandanicollection.com/api/accounts/update-profile", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        await refreshUser();
        setSuccess(true);

        // Redirect logic
        setTimeout(() => {
          router.push("/"); 
        }, 2000);

      } else {
        alert(data.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      alert("Server connection failed. Please check internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 font-sans relative">
      
      {/* ✅ SUCCESS TOAST NOTIFICATION */}
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            className="fixed top-10 left-1/2 z-[100] bg-black text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 border border-white/10 whitespace-nowrap"
          >
            <div className="bg-green-500 rounded-full p-1">
                <CheckCircle size={16} className="text-white" />
            </div>
            <p className="text-sm font-bold tracking-wide uppercase">Profile Updated Successfully!</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-black mb-8 transition-colors group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Wapas Home
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Aapki Profile</h1>
            <p className="text-[#8B3E48] text-[10px] font-black uppercase tracking-[0.2em]">Manage your Nandani Account</p>
          </div>
        </div>

        {/* ✅ INCOMPLETE PROFILE ALERT BANNER */}
        {isIncomplete && !success && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-5 bg-[#8B3E48]/5 border border-[#8B3E48]/10 rounded-3xl flex items-start gap-4"
          >
            <div className="bg-[#8B3E48] p-2 rounded-2xl text-white mt-1">
              <AlertCircle size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Profile Incomplete</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Please complete your details to enjoy faster checkouts and personalized reviews. It only takes a minute!
              </p>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 gap-6">
              
              {/* --- 1. FULL NAME --- */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-gray-400 ml-1 flex items-center gap-2">
                  <User size={12} /> Full Name
                </label>
                <input 
                  type="text" 
                  className="w-full p-4 border border-gray-100 rounded-2xl outline-none focus:border-[#8B3E48] bg-gray-50 focus:bg-white transition-all font-medium"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* --- 2. PHONE (Disabled) --- */}
              <div className="space-y-2 opacity-60">
                <label className="text-[10px] uppercase font-black text-gray-400 ml-1 flex items-center gap-2">
                  <Phone size={12} /> Phone Number (Verified)
                </label>
                <input 
                  type="text" 
                  disabled 
                  className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-100 font-mono font-bold text-gray-500" 
                  value={user?.phone || user?.phone_number || ""} 
                />
              </div>

              {/* --- 3. EMAIL --- */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-gray-400 ml-1 flex items-center gap-2">
                  <Mail size={12} /> Email Address
                </label>
                <input 
                  type="email" 
                  className="w-full p-4 border border-gray-100 rounded-2xl outline-none focus:border-[#8B3E48] bg-gray-50 focus:bg-white transition-all font-medium"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="name@example.com"
                />
              </div>

              {/* --- 4. ADDRESS --- */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-gray-400 ml-1 flex items-center gap-2">
                  <MapPin size={12} /> Default Shipping Address
                </label>
                <textarea 
                  rows={3}
                  className="w-full p-4 border border-gray-100 rounded-2xl outline-none focus:border-[#8B3E48] bg-gray-50 focus:bg-white transition-all font-medium resize-none"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="House No, Street, Landmark..."
                  required
                />
              </div>

              {/* --- 5. PINCODE --- */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-gray-400 ml-1 flex items-center gap-2">
                  <MapPin size={12} /> Pincode
                </label>
                <input 
                  type="text" maxLength={6}
                  className="w-full p-4 border border-gray-100 rounded-2xl outline-none focus:border-[#8B3E48] bg-gray-50 focus:bg-white transition-all font-medium tracking-widest"
                  value={formData.pincode}
                  onChange={(e) => setFormData({...formData, pincode: e.target.value.replace(/\D/g, "")})}
                  placeholder="000000"
                  required
                />
              </div>

            </div>
          </div>

          <button 
            type="submit"
            disabled={loading || success}
            className="w-full bg-gray-900 text-white py-5 rounded-[2rem] font-black hover:bg-black transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl shadow-gray-200 disabled:bg-gray-400 uppercase tracking-widest text-xs"
          >
            {loading ? <Loader2 className="animate-spin" /> : success ? <CheckCircle className="text-green-400" /> : <><Save size={18} /> Save Profile Details</>}
          </button>
        </form>
      </div>
    </div>
  );
}