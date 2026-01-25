import Link from "next/link";
import { ShoppingBag } from "lucide-react";

// Abhi ke liye Fake Data (Baad me Backend se aayega)
const products = [
  {
    id: 1,
    name: "Royal Anarkali Suit",
    category: "Suits",
    price: "₹2,499",
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Banarasi Silk Saree",
    category: "Sarees",
    price: "₹4,999",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=2574&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Embroidered Kurti",
    category: "Kurtis",
    price: "₹1,299",
    image: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=2574&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Velvet Party Suit",
    category: "Suits",
    price: "₹3,999",
    image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=2534&auto=format&fit=crop",
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            New Arrivals
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              
              {/* Image Container */}
              <div className="relative h-[350px] overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* 'Add to Cart' Button (Hidden by default, shown on hover) */}
                <div className="absolute bottom-4 left-0 right-0 px-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button className="w-full bg-white text-gray-900 font-medium py-3 rounded shadow-lg flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors">
                    <ShoppingBag size={18} />
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  {product.category}
                </p>
                <h3 className="text-lg font-serif font-medium text-gray-900 mb-2 truncate">
                  {product.name}
                </h3>
                <p className="text-primary font-bold text-lg">
                  {product.price}
                </p>
              </div>

            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/suits" className="inline-block border-2 border-gray-900 text-gray-900 px-8 py-3 rounded-full font-medium hover:bg-gray-900 hover:text-white transition-colors">
            View All Collection
          </Link>
        </div>

      </div>
    </section>
  );
};

export default FeaturedProducts;