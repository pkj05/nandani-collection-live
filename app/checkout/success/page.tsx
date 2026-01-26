"use client";

import Link from "next/link";
import { CheckCircle2, ShoppingBag, Truck, ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

// Loading ke liye chhota component
function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle2 className="text-green-600" size={48} />
          </div>
        </div>

        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Dhanyawad!</h1>
        <p className="text-gray-600 mb-8">Aapka order successfully place ho gaya hai.</p>

        {/* Order Details Card */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Order ID</span>
            <span className="font-bold text-gray-900">#{orderId || "N/A"}</span>
          </div>
          <div className="flex items-start gap-3 pt-4 border-t border-gray-200">
            <Truck className="text-primary mt-1" size={20} />
            <div>
              <p className="font-bold text-sm text-gray-900">Delivery Time</p>
              <p className="text-xs text-gray-500">Aapka order 2-3 dino mein pahunch jayega.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link 
            href="/" 
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all"
          >
            <ShoppingBag size={20} /> Shopping Jaari Rakhein
          </Link>
          <Link 
            href="/" 
            className="w-full text-gray-600 py-2 text-sm font-medium flex items-center justify-center gap-1 hover:text-primary transition-colors"
          >
            Back to Home <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// Main Page with Suspense (Next.js requirement for useSearchParams)
export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}