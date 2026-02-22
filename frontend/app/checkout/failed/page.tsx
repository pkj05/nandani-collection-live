"use client";

import Link from "next/link";
import { XCircle, RefreshCcw, HeadphonesIcon, ChevronLeft, AlertOctagon } from "lucide-react";

export default function OrderFailedPage() {
  return (
    <div className="min-h-screen bg-[#FCFBFA] flex flex-col items-center justify-center py-12 px-6 font-sans">
      
      <div className="max-w-md w-full space-y-8 animate-in zoom-in duration-500">
        
        {/* Error Header Section */}
        <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-red-100/50 border border-red-50 text-center relative overflow-hidden">
          
          {/* Background Soft Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-red-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center">
            
            {/* Pulsing Error Icon */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-50"></div>
              <div className="bg-red-500 p-5 rounded-full shadow-lg shadow-red-200 relative z-10">
                <XCircle className="text-white" size={48} strokeWidth={2.5} />
              </div>
            </div>

            <h1 className="text-3xl font-serif font-black text-gray-900 tracking-tight mb-3">
              Payment Failed!
            </h1>
            
            <p className="text-gray-500 text-sm leading-relaxed mb-8 px-4">
              Oops! Kisi technical wajah se aapka payment poora nahi ho paya. Ghabraye nahi, aapke bank account se paise nahi katen hain.
            </p>

            {/* Error Detail Box */}
            <div className="w-full bg-red-50/50 border border-red-100 p-4 rounded-2xl flex items-start gap-3 text-left mb-8">
              <AlertOctagon size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-red-800 mb-1">Possible Reasons</p>
                <ul className="text-[11px] text-gray-600 space-y-1 list-disc pl-4 font-medium">
                  <li>Network issue during transaction</li>
                  <li>Incorrect UPI PIN or bank server down</li>
                  <li>Session timed out</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-4">
              <Link 
                href="/checkout" 
                className="w-full bg-gray-900 text-white py-4.5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-gray-200 hover:bg-black hover:-translate-y-1 transition-all duration-300"
              >
                <RefreshCcw size={18} /> Retry Payment
              </Link>
              
              <Link 
                href="/" 
                className="w-full bg-white text-gray-900 border-2 border-gray-100 py-4.5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
              >
                <ChevronLeft size={18} /> Back to Shop
              </Link>
            </div>

          </div>
        </div>

        {/* Support Section */}
        <div className="text-center space-y-4">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Need Assistance?</p>
          <div className="flex justify-center">
            <a 
              href="tel:+919149796456" 
              className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100 text-[#8B3E48] font-bold text-sm hover:shadow-md transition-all"
            >
              <HeadphonesIcon size={16} /> Contact Support
            </a>
          </div>
          <p className="text-[10px] text-gray-400 italic">
            * Agar paise kat gaye hain, toh 24-48 ghanton mein refund ho jayenge.
          </p>
        </div>

      </div>
    </div>
  );
}