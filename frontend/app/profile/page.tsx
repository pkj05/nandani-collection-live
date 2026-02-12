"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation"; 
import { User, MapPin, Phone, Mail, Save, Loader2, ChevronLeft, CheckCircle } from "lucide-react";
import Link from "next/link";

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
      // ✅ UPDATE: Hardcoded URL for safety
      const res = await fetch("https://www.nandanicollection.com/api/accounts/update-profile", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json(); // ✅ Server response capture kiya

      if (res.ok) {
        // 1. Context refresh karein
        await refreshUser();
        
        // 2. Success message dikhayein
        setSuccess(true);

        // 3. Redirect logic
        setTimeout(() => {
          router.push("/"); 
        }, 1500);

      } else {
        // ✅ Specific Error Message dikhana
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
    <div className="min-h-screen bg-gray-50/50 pb-20 font-sans">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-black mb-8 transition-colors group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Wapas Home
        </Link>

        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Aapki Profile</h1>
        <p className="text-[#8B3E48] text-[10px] font-black uppercase tracking-[0.2em] mb-10">Manage your Nandani Account</p>

        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-2xl flex items-center gap-3 border border-green-100 animate-in fade-in slide-in-from-top-4">
            <CheckCircle size={20} />
            <p className="text-sm font-bold">Details saved! Redirecting to Home...</p>
          </div>
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
            disabled={loading}
            className="w-full bg-gray-900 text-white py-5 rounded-[2rem] font-black hover:bg-black transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl shadow-gray-200 disabled:bg-gray-400 uppercase tracking-widest text-xs"
          >
            {loading ? <Loader2 className="animate-spin" /> : success ? <CheckCircle className="text-green-400" /> : <><Save size={18} /> Save Profile Details</>}
          </button>
        </form>
      </div>
    </div>
  );
}