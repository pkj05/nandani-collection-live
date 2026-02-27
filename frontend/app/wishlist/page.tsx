"use client";

import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import ProductCard from "@/components/ProductCard";
import { Heart, ArrowLeft, Trash2, Sparkles, X, CheckCircle2 } from "lucide-react"; 
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react"; // ✅ useEffect import किया

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlistStore() as any;
  const { cart } = useCartStore() as any; // ✅ addItem की जगह cart ले लिया
  const [movedItem, setMovedItem] = useState<string | null>(null);

  // ✅ SMART LOGIC: अगर कोई आइटम कार्ट में आ गया है, तो उसे विशलिस्ट से हटा दो
  useEffect(() => {
    // चेक करो कि विशलिस्ट का कौन सा आइटम कार्ट में मौजूद है
    const itemsInCart = wishlist.filter((wItem: any) => 
      cart.some((cItem: any) => cItem.id === wItem.id)
    );

    // अगर कोई आइटम मैच होता है, तो उसे विशलिस्ट से रिमूव करो और नोटिफिकेशन दिखाओ
    if (itemsInCart.length > 0) {
      itemsInCart.forEach((item: any) => {
        removeFromWishlist(item.id);
        setMovedItem(item.name); // Success message दिखाओ
        setTimeout(() => setMovedItem(null), 2000); // 2 सेकंड बाद मैसेज हटाओ
      });
    }
  }, [cart, wishlist, removeFromWishlist]);

  // Animation variants for stagger effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#FCFBFA] pb-20">
      
      {/* ✅ Add to Bag Success Notification */}
      <AnimatePresence>
        {movedItem && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            className="fixed top-10 left-1/2 z-[100] bg-black text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/10"
          >
            <CheckCircle2 size={18} className="text-green-400" />
            <p className="text-sm font-medium">{movedItem} added to bag!</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 pt-16 pb-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Link href="/" className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4 hover:text-[#8B3E48] transition-colors group w-fit">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Shop
            </Link>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 flex items-center gap-4">
              My Wishlist <Heart fill="#8B3E48" className="text-[#8B3E48] animate-pulse" size={32} />
            </h1>
            <p className="text-gray-500 mt-3 text-sm md:text-base italic">Keep track of the pieces you love.</p>
          </div>

          {wishlist.length > 0 && (
            <button 
              onClick={clearWishlist}
              className="text-[10px] font-black text-red-400 uppercase tracking-[0.15em] hover:text-red-600 transition-all flex items-center gap-2 border border-red-50 px-6 py-3 rounded-full hover:bg-red-50 hover:border-red-100 w-fit"
            >
              <Trash2 size={14} /> Clear My Collection
            </button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-12">
        <AnimatePresence mode="wait">
          {wishlist.length === 0 ? (
            /* --- EMPTY STATE --- */
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <div className="w-28 h-28 bg-white shadow-inner rounded-full flex items-center justify-center mb-8 border border-gray-50">
                <Heart size={44} className="text-gray-200" strokeWidth={1.5} />
              </div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
              <p className="text-gray-400 max-w-sm mx-auto mb-10 leading-relaxed">
                Pieces you heart while shopping will appear here for you to revisit anytime.
              </p>
              <Link 
                href="/" 
                className="bg-[#8B3E48] text-white px-12 py-4 rounded-full font-bold text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#8B3E48]/30 hover:bg-[#6d3139] hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
              >
                <Sparkles size={18} /> Discover Now
              </Link>
            </motion.div>
          ) : (
            /* --- WISHLIST GRID --- */
            <motion.div 
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10"
            >
              {wishlist.map((product: any) => (
                <motion.div 
                  layout
                  key={product.id}
                  variants={itemVariants}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative flex flex-col"
                >
                  {/* Remove Button Tag */}
                  <button 
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-4 right-4 z-30 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg text-gray-400 hover:text-red-500 hover:rotate-90 transition-all duration-300"
                    title="Remove item"
                  >
                    <X size={16} />
                  </button>

                  <div className="flex-grow">
                    <ProductCard product={product} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Visual Decor */}
      {wishlist.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 mt-24 text-center">
            <div className="inline-flex items-center gap-6 text-gray-300">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-gray-200"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Nandani Collection Premium</p>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-gray-200"></div>
            </div>
        </div>
      )}
    </div>
  );
}