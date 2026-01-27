"use client";
import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";

export default function ProductCard({ product }: { product: any }) {
  // FEATURE: Dots par hover karne se image badalne ki state
  const [displayImage, setDisplayImage] = useState(product.thumbnail);

  return (
    <div className="group relative bg-white rounded-3xl p-3 shadow-sm hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-gray-100 flex flex-col h-full">
      
      {/* 1. IMAGE SECTION */}
      <Link href={`/product/${product.id}`} className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-50 block">
        <img 
          src={displayImage} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Badges (Stock/New) */}
        {product.stock === 0 ? (
          <div className="absolute top-3 left-3 bg-red-500/90 backdrop-blur-sm text-white text-[10px] px-3 py-1 rounded-full font-bold">SOLD OUT</div>
        ) : (
          <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-gray-900">
            <Heart size={16} />
          </button>
        )}
      </Link>

      {/* 2. PRODUCT INFO */}
      <div className="mt-4 flex flex-col flex-grow space-y-2 px-1">
        <div>
          <h3 className="text-gray-900 font-serif text-base font-bold truncate group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-400 text-[10px] uppercase tracking-widest">{product.category_name}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-black text-gray-900">₹{product.selling_price.toLocaleString()}</span>
            {product.original_price && (
                <span className="text-[10px] text-gray-400 line-through">₹{product.original_price.toLocaleString()}</span>
            )}
          </div>
          
          <Link href={`/product/${product.id}`} className="p-2.5 bg-gray-900 text-white rounded-xl hover:bg-primary transition-colors">
            <ShoppingCart size={18} />
          </Link>
        </div>

        {/* 3. FEATURE: COLOR CIRCLES (Variant Logic) */}
        {product.variants && product.variants.length > 0 && (
          <div className="pt-3 border-t border-gray-50 mt-auto flex flex-wrap gap-2">
            {/* Base Product Circle */}
            <div 
              onMouseEnter={() => setDisplayImage(product.thumbnail)}
              className={`w-6 h-6 rounded-full border-2 cursor-pointer overflow-hidden transition-all
                ${displayImage === product.thumbnail ? 'border-black scale-110' : 'border-transparent hover:border-gray-200'}`}
            >
              <img src={product.thumbnail} className="w-full h-full object-cover" alt="main" />
            </div>

            {/* Other Color Variants Circles */}
            {product.variants.slice(0, 3).map((v: any) => (
              <div 
                key={v.id}
                onMouseEnter={() => setDisplayImage(v.thumbnail)}
                className={`w-6 h-6 rounded-full border-2 cursor-pointer overflow-hidden transition-all
                  ${displayImage === v.thumbnail ? 'border-black scale-110' : 'border-transparent hover:border-gray-200'}
                  ${v.stock === 0 ? 'opacity-30 grayscale' : ''}`}
              >
                <img src={v.thumbnail} className="w-full h-full object-cover" alt={v.color_name} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}