import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import FeaturedProducts from "@/components/FeaturedProducts";

// SEO Metadata for Google Ranking
export const metadata = {
  title: "Nandani Collection | Designer Sarees & Suits",
  description: "Shop the latest premium ethnic wear collection. Designer sarees and suits crafted for perfection.",
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. Hero Banner - First impression */}
      <Hero />

      {/* 2. Shop by Category - Quick navigation */}
      <CategorySection />

      {/* 3. Featured Products - New Arrivals */}
      {/* Note: Is component ke andar heading pehle se hai, isliye yahan extra code ki zaroorat nahi */}
      <FeaturedProducts />

    </div>
  );
}
