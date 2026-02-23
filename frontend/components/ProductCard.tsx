"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; 
import { ShoppingCart, Heart, Star } from "lucide-react"; 
import { useCartStore } from "@/store/useCartStore"; 
import CartToast from "@/components/CartToast"; 

export default function ProductCard({ product }: { product: any }) {
  const { addItem } = useCartStore() as any; 
  const [showToast, setShowToast] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]); 
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const getFullImageUrl = (path: string) => {
    if (!path || path === "" || path === "null") {
      return "https://placehold.co/600x800/f3f4f6/9ca3af?text=No+Image";
    }
    let finalPath = path.replace("http://", "https://");
    if (finalPath.startsWith("http")) return finalPath;
    const cleanPath = finalPath.startsWith("/") ? finalPath : `/${finalPath}`;
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

    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_URL}/api/reviews/${product.id}`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (err) {
        console.error("Error fetching card reviews:", err);
      }
    };
    fetchReviews();
  }, [product]);

  // Rating Calculation
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : null;

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
        
        {/* IMAGE SECTION */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-[1.2rem] bg-gray-50 block will-change-transform">
          <Link href={`/product/${product.id}`} className="block h-full w-full">
            <Image 
              src={displayImage} 
              alt={product.name}
              fill
              quality={75}
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              onError={() => setDisplayImage("https://placehold.co/600x800/f3f4f6/9ca3af?text=Image+Not+Found")}
            />
          </Link>
          {totalStock === 0 ? (
            <div className="absolute top-3 left-3 bg-red-500/90 backdrop-blur-md text-white text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wider shadow-sm z-10">SOLD OUT</div>
          ) : (
            <button className="absolute top-3 right-3 h-8 w-8 flex items-center justify-center bg-white/70 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 text-gray-900 shadow-sm z-10">
              <Heart size={16} />
            </button>
          )}
        </div>

        {/* DETAILS SECTION */}
        <div className="mt-2 flex flex-col flex-grow space-y-0.5 px-1">
          <div>
            <h3 className="text-gray-900 font-serif text-[15px] font-bold truncate group-hover:text-black transition-colors leading-tight">{product.name}</h3>
            
            {/* ✅ SMART RATING BADGE: Only shows if reviews exist */}
            {reviews.length > 0 && (
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center bg-green-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                   {averageRating} <Star size={8} fill="white" className="ml-0.5" />
                </div>
                <span className="text-[10px] text-gray-400 font-medium">({reviews.length})</span>
              </div>
            )}

            <p className="text-gray-500 text-[10px] uppercase tracking-widest font-medium mt-1">{product.category_name || product.category}</p>
          </div>

          <div className="flex items-center justify-between mt-1">
             <div className="flex flex-col">
              <span className="text-lg font-black text-[#8B3E48] tracking-tight">₹{Number(product.base_price).toLocaleString()}</span>
            </div>
            <button 
              onClick={handleQuickAdd} 
              disabled={totalStock === 0} 
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
                  <Image src={getFullImageUrl(v.thumbnail)} alt={v.color_name} width={24} height={24} quality={50} className="object-cover h-full w-full" />
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