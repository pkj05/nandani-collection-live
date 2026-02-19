"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; // ✅ Next.js Image Component for high performance
import { ShoppingCart, Heart } from "lucide-react"; 
import { useCartStore } from "@/store/useCartStore"; 
import CartToast from "@/components/CartToast"; 

export default function ProductCard({ product }: { product: any }) {
  const { addItem } = useCartStore() as any; 
  const [showToast, setShowToast] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // ✅ IMPROVED IMAGE FIXER: Null handling aur HTTPS enforcement to fix 400 error
  const getFullImageUrl = (path: string) => {
    if (!path || path === "" || path === "null") {
      return "https://placehold.co/600x800/f3f4f6/9ca3af?text=No+Image";
    }
    
    // ✅ लिंक में http को जबरदस्ती https में बदलें (Mixed Content fix)
    let finalPath = path.replace("http://", "https://");
    
    if (finalPath.startsWith("http")) return finalPath;

    const cleanPath = finalPath.startsWith("/") ? finalPath : `/${finalPath}`;
    
    // ✅ API_URL को भी https में बदलें
    let baseUrl = API_URL?.replace("http://", "https://");
    baseUrl = baseUrl?.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    
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
    } else {
        setDisplayImage(getFullImageUrl(product.thumbnail));
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
      image: getFullImageUrl(selectedVariant.thumbnail),
      color: selectedVariant.color_name,
      size: defaultSize ? defaultSize.size : "Standard",
      quantity: 1,
      stock: currentStock,
    });

    if (success) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <>
      <div className="group relative bg-white rounded-[1.5rem] p-2 shadow-sm hover:shadow-xl transition-all duration-500 border border-transparent hover:border-gray-100 flex flex-col h-full">
        
        {/* IMAGE SECTION - ✅ Performance Optimized */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-[1.2rem] bg-gray-50 block will-change-transform">
          <Link href={`/product/${product.id}`} className="block h-full w-full" aria-label={`View details for ${product.name}`}>
            <Image 
              src={displayImage} 
              alt={product.name}
              fill
              quality={75} // ✅ Quality optimized for Mobile performance
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 20vw" // ✅ Precision sizing for Lighthouse
              priority={false}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              onError={() => {
                setDisplayImage("https://placehold.co/600x800/f3f4f6/9ca3af?text=Image+Not+Found");
              }}
            />
          </Link>
          {totalStock === 0 ? (
            <div className="absolute top-3 left-3 bg-red-500/90 backdrop-blur-md text-white text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wider shadow-sm z-10">SOLD OUT</div>
          ) : (
            <button 
              aria-label="Add to Wishlist" // ✅ Accessibility fix
              className="absolute top-3 right-3 h-8 w-8 flex items-center justify-center bg-white/70 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 text-gray-900 shadow-sm z-10"
            >
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
            <button 
              onClick={handleQuickAdd} 
              disabled={totalStock === 0} 
              aria-label={`Add ${product.name} to cart`} // ✅ Accessibility fix
              className={`h-9 w-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm relative overflow-hidden ${totalStock === 0 ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-900 hover:shadow-md hover:scale-105'}`}
            >
              <ShoppingCart size={16} strokeWidth={2.5} />
            </button>
          </div>

          {/* Variants Circles */}
          {product.variants && product.variants.length > 0 && (
            <div className="pt-2 border-t border-gray-50/50 mt-auto flex flex-wrap gap-2" onMouseLeave={() => setDisplayImage(getFullImageUrl(selectedVariant?.thumbnail))}>
              {product.variants.map((v: any) => (
                <div 
                  key={v.id} 
                  onClick={(e) => { e.preventDefault(); setSelectedVariant(v); setDisplayImage(getFullImageUrl(v.thumbnail)); }} 
                  onMouseEnter={() => setDisplayImage(getFullImageUrl(v.thumbnail))} 
                  className={`w-6 h-6 rounded-full border-[1.5px] cursor-pointer relative overflow-hidden transition-all duration-300 ${displayImage === getFullImageUrl(v.thumbnail) ? 'border-black scale-110 shadow-sm' : 'border-transparent opacity-80'}`}
                >
                  <Image 
                    src={getFullImageUrl(v.thumbnail)} 
                    alt={v.color_name}
                    width={24}
                    height={24}
                    quality={50} // ✅ Very low quality for tiny circles to save data
                    className="object-cover h-full w-full"
                    onError={(e: any) => {
                      e.currentTarget.src = "https://placehold.co/100x100?text=x";
                    }}
                  />
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