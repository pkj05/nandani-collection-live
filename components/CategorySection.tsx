import Link from "next/link";
import { MoveRight } from "lucide-react";

const categories = [
  {
    id: 1,
    title: "Designer Suits",
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=2670&auto=format&fit=crop", // Suit Image
    link: "/suits",
  },
  {
    id: 2,
    title: "Banarasi Sarees",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=2574&auto=format&fit=crop", // Saree Image
    link: "/sarees",
  },
  {
    id: 3,
    title: "Premium Kurtis",
    image: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=2574&auto=format&fit=crop", // Kurti Image (Generic Ethnic)
    link: "/kurtis",
  },
];

const CategorySection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our handcrafted collection of ethnic wear, designed to make every moment special.
          </p>
        </div>

        {/* 3 CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              href={cat.link}
              className="group relative h-[400px] md:h-[500px] overflow-hidden rounded-lg cursor-pointer"
            >
              {/* Background Image with Zoom Effect */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${cat.image}')` }}
              ></div>

              {/* Black Overlay (Text ko readable banane ke liye) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

              {/* Text Content (Bottom) */}
              <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-2xl font-serif text-white font-medium mb-2">
                  {cat.title}
                </h3>
                <div className="flex items-center gap-2 text-white/80 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                  Explore Now <MoveRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CategorySection;