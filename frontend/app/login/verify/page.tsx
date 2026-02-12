"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";
import { auth } from "@/firebase"; // ✅ Firebase Import
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";

// ✅ FIX: TypeScript ko batao ki window me recaptchaVerifier hai
declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();
  
  // URL se phone number nikalo aur clean karo
  const rawPhone = searchParams.get("phone") || "";
  // Ensure +91 format
  const phone = rawPhone.startsWith("+") ? rawPhone : `+91${rawPhone.trim()}`;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState(""); // User feedback message
  
  // Firebase Confirmation Object
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  // ✅ Hardcoded API URL
  const API_URL = "https://www.nandanicollection.com/api";

  // 1. Initialize Recaptcha & Auto Send OTP on Mount
  useEffect(() => {
    if (!phone || phone.length < 10) return;

    // ✅ FIX: Window object check ke sath init karo
    if (typeof window !== "undefined" && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
           console.log("Recaptcha Solved");
        }
      });
    }

    // Agar pehli baar page load hua hai to OTP bhejo
    if (!confirmationResult) {
       sendOtpToUser();
    }
  }, [phone]);

  // --- FUNCTION: Send OTP (Firebase) ---
  const sendOtpToUser = async () => {
    setLoading(true);
    setError("");
    setMsg("Sending OTP...");
    
    try {
      if (!window.recaptchaVerifier) return;
      
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(confirmation);
      setMsg("OTP Sent Successfully! ✅");
    } catch (err: any) {
      console.error("OTP Send Error:", err);
      setError(err.message || "Failed to send OTP. Try 'Resend'.");
      setMsg("");
      
      // Agar recaptcha error hai to reset karo
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  // --- FUNCTION: Verify & Login ---
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length < 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    if (!confirmationResult) {
      setError("Session expired. Please click Resend.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Firebase Verify (Client Side)
      const result = await confirmationResult.confirm(otp);
      const idToken = await result.user.getIdToken(); // 🔥 Ye hai असली Token

      console.log("Firebase Verified! Token Generated.");

      // 2. Backend Login (Server Side)
      const response = await fetch(`${API_URL}/accounts/firebase-login`, {  
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            id_token: idToken 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Login Success
        const token = data.token || data.access_token;
        if (token) {
            login(token, data.user || {}); 
            router.push("/"); 
        } else {
            setError("Login failed: Token missing from server");
        }
      } else {
        setError(data.message || "Server Verification Failed.");
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-verification-code') {
        setError("Invalid OTP entered.");
      } else {
        setError("Verification failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50 font-sans">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100 text-center">
        
        {/* Invisible Recaptcha Container */}
        <div id="recaptcha-container"></div>

        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-6">
            <ShieldCheck className="text-green-600" size={32} />
        </div>
        
        <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">Verify OTP</h1>
        <p className="text-gray-500 text-sm mb-4">
            Enter the code sent to <br/> 
            <span className="font-bold text-gray-900">{phone}</span>
        </p>

        {/* Status Messages */}
        {msg && <p className="text-green-600 text-xs font-bold mb-4">{msg}</p>}

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <input 
            type="tel" 
            placeholder="000000"  
            maxLength={6}         
            className="w-full p-5 border-2 border-gray-100 rounded-2xl text-center text-3xl font-black tracking-[0.5em] outline-none focus:border-[#8B3E48] focus:bg-white bg-gray-50 transition-all"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            autoFocus
          />

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-black shadow-xl active:scale-95 disabled:bg-gray-400 uppercase tracking-widest text-xs"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>VERIFY & LOGIN <CheckCircle2 size={18} /></>}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-400 text-[10px] font-bold uppercase tracking-widest">
          Code not received? 
          <button 
            type="button" 
            onClick={sendOtpToUser} 
            disabled={loading}
            className="text-[#8B3E48] hover:text-black transition-colors ml-1 disabled:opacity-50"
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#8B3E48]" size={40} /></div>}>
      <VerifyContent />
    </Suspense>
  );
}