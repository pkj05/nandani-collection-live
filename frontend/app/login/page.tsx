"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Validation
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // ✅ UPDATE: Ab hum Backend API call nahi karenge.
      // Hum sidha Verify Page par jayenge, wahan Firebase OTP sambhal lega.
      
      const formattedPhone = `+91${phone}`;
      
      // Redirect to Verify Page with Phone Number
      router.push(`/login/verify?phone=${encodeURIComponent(formattedPhone)}`);

    } catch (err) {
      console.error("Navigation Error:", err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
    // Note: setLoading(false) yahan nahi lagaya kyunki redirect hone tak loader dikhna chahiye
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50 font-sans">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-gray-100 border border-gray-100">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#8B3E48]/10 rounded-full mb-4">
            <ShieldCheck className="text-[#8B3E48]" size={32} />
          </div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 leading-tight">Welcome Back</h1>
          <p className="text-gray-500 mt-2 italic text-sm">Experience the elegance of Nandani</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs border border-red-100 animate-pulse text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 ml-2 mb-2 block">
              Phone Number
            </label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold border-r border-gray-200 pr-3 transition-colors group-focus-within:text-[#8B3E48]">
                +91
              </span>
              <input 
                type="tel" 
                placeholder="00000 00000"
                maxLength={10}
                required
                className="w-full p-4 pl-16 border-2 border-gray-100 rounded-2xl outline-none focus:border-[#8B3E48]/30 focus:ring-4 focus:ring-[#8B3E48]/5 bg-gray-50 focus:bg-white transition-all text-lg tracking-widest font-medium"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-[0.98] disabled:bg-gray-400 disabled:scale-100 uppercase tracking-widest text-sm"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>Send OTP <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <div className="mt-10 text-center border-t border-gray-50 pt-6">
          <p className="text-gray-400 text-[11px] font-bold tracking-wider uppercase">
            New to Nandani?{" "}
            <Link href="/signup" className="text-[#8B3E48] hover:text-black transition-colors ml-1 border-b-2 border-[#8B3E48]/20">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}