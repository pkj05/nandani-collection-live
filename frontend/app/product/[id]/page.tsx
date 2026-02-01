"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; 
import { Loader2 } from "lucide-react"; 
import ProductDetail from "@/components/ProductDetail"; // Import the component above

export default function ProductPage() {
  const params = useParams(); 
  const productId = params.id;
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`);
        const data = await response.json();

        if (data) {
          // Filter variants to remove broken images (Safety)
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

  // --- LOADING STATE ---
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
    return <div className="text-center py-20">Product Not Found</div>;
  }

  // --- RENDER MAIN UI ---
  return <ProductDetail product={product} />;
}