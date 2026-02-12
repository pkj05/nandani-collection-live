"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react"; 
import { useCartStore } from "@/store/useCartStore"; 
import CartToast from "@/components/CartToast"; 

export default function ProductCard({ product }: { product: any }) {
  const { addItem } = useCartStore() as any; 
  const [showToast, setShowToast] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // ✅ IMAGE FIXER: Backend path ko full URL me badalne ke liye
  const getFullImageUrl = (path: string) => {
    if (!path) return "https://placehold.co/600x800/f3f4f6/9ca3af?text=No+Image";
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const baseUrl = API_URL?.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    return `${baseUrl}${cleanPath}`;
  };

  const getInitialVariant = () => {
    if (product.variants && product.variants.length > 0) {
      return product.variants.find((v: any) => v.thumbnail && v.thumbnail.trim() !== "") || product.variants[0];
    }
    return null;
  };

  const [selectedVariant, setSelectedVariant] = useState<any>(getInitialVariant());
  const [displayImage, setDisplayImage] = useState<string>(
    getFullImageUrl(selectedVariant?.thumbnail || product.thumbnail)
  );

  useEffect(() => {
    const initial = getInitialVariant();
    if (initial) {
        setSelectedVariant(initial);
        setDisplayImage(getFullImageUrl(initial.thumbnail));
    }
  }, [product]);

  const totalStock = product.variants?.reduce((acc: number, v: any) => acc + (v.stock || 0), 0) || 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation(); 
    if (totalStock === 0 || !selectedVariant) return;

    const defaultSize = selectedVariant.sizes?.[0] || null;
    const currentStock = defaultSize ? defaultSize.stock : selectedVariant.stock;
    const price = defaultSize ? (Number(product.base_price) + Number(defaultSize.price_adjustment || 0)) : Number(product.base_price);

    const success = addItem({
      id: product.id,
      variant_id: selectedVariant.id,
      size_id: defaultSize?.id || null,
      name: product.name,
      price: price,
      image: getFullImageUrl(selectedVariant.thumbnail), // Fixed Path
      color: selectedVariant.color_name,
      size: defaultSize ? defaultSize.size : "Standard",
      quantity: 1,
      stock: currentStock,
    });

    if (success) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } else {
      alert(`Max limit reached for ${selectedVariant.color_name}!`);
    }
  };

  return (
    <>
      <div className="group relative bg-white rounded-[1.5rem] p-2 shadow-sm hover:shadow-xl transition-all duration-500 border border-transparent hover:border-gray-100 flex flex-col h-full">
        
        {/* IMAGE SECTION */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-[1.2rem] bg-gray-50 block will-change-transform">
          <Link href={`/product/${product.id}`}>
            <img src={displayImage} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </Link>
          {totalStock === 0 ? (
            <div className="absolute top-3 left-3 bg-red-500/90 backdrop-blur-md text-white text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wider shadow-sm">SOLD OUT</div>
          ) : (
            <button className="absolute top-3 right-3 h-8 w-8 flex items-center justify-center bg-white/70 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 text-gray-900 shadow-sm">
              <Heart size={16} />
            </button>
          )}
        </div>

        {/* DETAILS SECTION */}
        <div className="mt-2 flex flex-col flex-grow space-y-0.5 px-1">
          <div>
            <h3 className="text-gray-900 font-serif text-[15px] font-bold truncate group-hover:text-black transition-colors leading-tight">{product.name}</h3>
            <p className="text-gray-500 text-[10px] uppercase tracking-widest font-medium mt-0.5">{product.category_name || product.category}</p>
          </div>

          <div className="flex items-center justify-between mt-1">
             <div className="flex flex-col">
              <span className="text-lg font-black text-[#8B3E48] tracking-tight">₹{Number(product.base_price).toLocaleString()}</span>
            </div>
            <button onClick={handleQuickAdd} disabled={totalStock === 0} className={`h-9 w-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm relative overflow-hidden ${totalStock === 0 ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-900 hover:shadow-md hover:scale-105'}`}>
              <ShoppingCart size={16} strokeWidth={2.5} />
            </button>
          </div>

          {product.variants && product.variants.length > 0 && (
            <div className="pt-2 border-t border-gray-50/50 mt-auto flex flex-wrap gap-2" onMouseLeave={() => setDisplayImage(getFullImageUrl(selectedVariant?.thumbnail))}>
              {product.variants.map((v: any) => (
                <div 
                  key={v.id} 
                  onClick={(e) => { e.preventDefault(); setSelectedVariant(v); setDisplayImage(getFullImageUrl(v.thumbnail)); }} 
                  onMouseEnter={() => setDisplayImage(getFullImageUrl(v.thumbnail))} 
                  className={`w-6 h-6 rounded-full border-[1.5px] cursor-pointer overflow-hidden transition-all duration-300 ${displayImage === getFullImageUrl(v.thumbnail) ? 'border-black scale-110 shadow-sm' : 'border-transparent opacity-80'}`}
                >
                  <img src={getFullImageUrl(v.thumbnail)} className="w-full h-full object-cover" alt={v.color_name} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showToast && (
        <div className="fixed top-24 right-4 z-[99999] animate-in slide-in-from-right-10 duration-300">
            <CartToast onClose={() => setShowToast(false)} />
        </div>
      )}
    </>
  );
}