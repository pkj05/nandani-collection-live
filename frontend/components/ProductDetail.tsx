"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  selling_price: number;
  size: string;
  has_size: boolean; // Backend se category logic
  color_name: string;
  thumbnail: string;
  stock: number;
  group_id?: string;
  images: { id: number; image: string }[];
}

export default function ProductDetail({ 
  product, 
  variants = [] // Ek hi group_id wale dusre colors
}: { 
  product: Product, 
  variants: Product[] 
}) {
  const [mainImage, setMainImage] = useState(product.thumbnail);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Performance: Scroll to top arrow logic
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* LEFT: Image Gallery Section */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100">
            <Image 
              src={mainImage} 
              alt={product.name} 
              fill 
              className="object-cover transition-opacity duration-300"
              priority // LCP Optimization
            />
          </div>
          
          {/* Thumbnail Circles for Images (Lazy Loaded) */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {[product.thumbnail, ...product.images.map(img => img.image)].map((img, i) => (
              <div 
                key={i}
                onClick={() => setMainImage(img)}
                className={`relative w-20 h-24 flex-shrink-0 cursor-pointer rounded-md overflow-hidden border-2 
                  ${mainImage === img ? 'border-black' : 'border-transparent'}`}
              >
                <Image src={img} alt="thumb" fill className="object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Product Info Section */}
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-500 mt-2">{product.description}</p>
          </div>

          {/* Pricing */}
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-green-700">₹{product.selling_price}</span>
            {product.original_price && (
              <span className="text-gray-400 line-through text-lg">₹{product.original_price}</span>
            )}
          </div>

          <hr />

          {/* FEATURE: Product Grouping (Color Variants) */}
          {variants.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider text-gray-700">
                More Colors ({product.color_name})
              </h3>
              <div className="flex flex-wrap gap-4">
                {variants.map((v) => (
                  <a 
                    href={`/product/${v.id}`} 
                    key={v.id}
                    className={`relative w-12 h-12 rounded-full border-2 p-0.5 transition-all
                      ${v.id === product.id ? 'border-black' : 'border-gray-200 hover:border-gray-400'}
                      ${v.stock === 0 ? 'opacity-40 grayscale' : ''}`}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden relative">
                      <Image src={v.thumbnail} alt={v.color_name} fill className="object-cover" />
                    </div>
                    {/* Out of Stock Logic */}
                    {v.stock === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-red-600 bg-white/20 rounded-full">
                         SOLD
                      </div>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* FEATURE: Dynamic Sizes */}
          {product.has_size && (
            <div>
              <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider text-gray-700">Select Size</h3>
              <div className="flex gap-3">
                {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => {
                  const isAvailable = product.size === sz; // Simplification: agar ek product ek hi size ka hai
                  return (
                    <button
                      key={sz}
                      disabled={!isAvailable || product.stock === 0}
                      className={`min-w-[50px] py-2 border rounded-md font-medium transition-all
                        ${isAvailable ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-300 cursor-not-allowed'}`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stock Alert & Buttons */}
          <div className="pt-6">
            {product.stock > 0 ? (
              <button className="w-full bg-black text-white py-4 rounded-full font-bold hover:bg-gray-800 transition-colors">
                ADD TO CART
              </button>
            ) : (
              <button disabled className="w-full bg-red-100 text-red-600 py-4 rounded-full font-bold cursor-not-allowed">
                OUT OF STOCK
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FEATURE: Navigation (Back to Top) */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-black text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50"
        >
          ↑
        </button>
      )}
    </div>
  );
}