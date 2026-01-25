import Link from "next/link";
import { MoveRight } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative w-full h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
      
      {/* 1. BACKGROUND IMAGE (Royal Saree Look) */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=2574&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center 20%", // Focus on the face/upper body
        }}
      >
        {/* Dark Overlay (Taaki text saaf dikhe) */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* 2. CENTER CONTENT */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6">
        
        <p className="text-white/90 text-sm md:text-base tracking-[0.2em] uppercase font-medium animate-fade-in-up">
          New Arrivals 2026
        </p>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight drop-shadow-lg">
          Elegance for <br className="hidden md:block" /> Every Occasion
        </h1>

        <p className="text-white/90 text-lg md:text-xl font-light max-w-2xl mx-auto pb-4">
          Discover our exclusive collection of handpicked Sarees and Suits designed to make you shine.
        </p>

        {/* Call to Action Button */}
        <Link 
          href="/suits" 
          className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-medium hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105 shadow-xl"
        >
          Shop Collection
          <MoveRight size={20} />
        </Link>

      </div>
    </div>
  );
};

export default Hero;