import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import FeaturedProducts from "@/components/FeaturedProducts"; // New Import

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. Hero Banner */}
      <Hero />

      {/* 2. Shop by Category */}
      <CategorySection />

      {/* 3. New Arrivals (Products) */}
      <FeaturedProducts />

    </div>
  );
}