"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; 
import { Loader2 } from "lucide-react"; 
import ProductDetail from "@/components/ProductDetail"; 
// ✅ lib/api से प्रोफेशनल फंक्शन इम्पोर्ट किया
import { getProductDetail } from "@/lib/api";
import ProductReviews from "@/components/ProductReviews";

export default function ProductPage() {
  const params = useParams(); 
  const productId = params.id as string;
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        
        // ✅ Purane fetch ki jagah lib/api ka centralized function use kiya
        // Ye apne aap naye path '/api/shop/products/[id]' par request bhejega
        const data = await getProductDetail(productId);

        if (data) {
          // Filter variants to remove broken images (Safety logic preserved)
          if (data.variants) {
             data.variants = data.variants.filter((v: any) => v.thumbnail && v.thumbnail.trim() !== "");
          }
          setProduct(data);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProductDetails();
  }, [productId]);

  // --- LOADING STATE (Original Design Preserved) ---
  if (loading) {
    return (
        <div className="h-screen flex flex-col justify-center items-center bg-white gap-4">
          <Loader2 className="animate-spin text-[#8B3E48]" size={40} />
          <p className="text-gray-400 font-serif italic tracking-wide">Loading Collection...</p>
        </div>
    );
  }

  // --- NOT FOUND STATE ---
  if (!product) {
    return <div className="text-center py-20 font-serif italic text-gray-500">Product Not Found</div>;
  }

  // --- RENDER MAIN UI ---
  // ✅ FIX: ProductDetail और ProductReviews दोनों को एक साथ दिखाने के लिए React Fragment (<></>) लगाया है
  return (
    <>
      <ProductDetail product={product} />
      <ProductReviews productId={product.id} />
    </>
  );
}