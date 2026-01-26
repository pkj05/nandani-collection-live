import Link from "next/link";
import { Filter, ChevronDown, ShoppingBag } from "lucide-react";

// Fake Data for Suits
const suits = [
  {
    id: 1,
    name: "Royal Anarkali Suit",
    price: "₹2,499",
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Velvet Party Wear",
    price: "₹3,999",
    image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=2534&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Cotton Daily Wear",
    price: "₹1,499",
    image: "https://images.unsplash.com/photo-1605763240004-7d93b172d7d5?q=80&w=2574&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Embroidered Georgette",
    price: "₹2,899",
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=2574&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Bridal Heavy Suit",
    price: "₹8,999",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2583&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Sharara Set",
    price: "₹3,299",
    image: "https://images.unsplash.com/photo-1631233859262-0d9b0163374b?q=80&w=2574&auto=format&fit=crop",
  },
];

export default function SuitsPage() {
  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* 1. PAGE HEADER */}
      <div className="bg-gray-50 py-12 text-center">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Designer Suits</h1>
        <p className="text-gray-500 text-sm">Home / Suits</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 flex gap-12">
        
        {/* 2. SIDEBAR FILTERS (Desktop Only) */}
        <div className="hidden md:block w-64 space-y-8 flex-shrink-0">
          
          {/* Price Filter */}
          <div>
            <h3 className="font-serif font-bold text-lg mb-4 flex items-center justify-between">
              Price <ChevronDown size={16} />
            </h3>
            <div className="space-y-2 text-gray-600 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300" /> ₹500 - ₹1000
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300" /> ₹1000 - ₹2500
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300" /> ₹2500 - ₹5000
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300" /> Above ₹5000
              </label>
            </div>
          </div>

          {/* Color Filter */}
          <div>
            <h3 className="font-serif font-bold text-lg mb-4 flex items-center justify-between">
              Color <ChevronDown size={16} />
            </h3>
            <div className="flex flex-wrap gap-2">
              <div className="w-6 h-6 rounded-full bg-red-500 cursor-pointer border hover:scale-110 transition-transform"></div>
              <div className="w-6 h-6 rounded-full bg-blue-500 cursor-pointer border hover:scale-110 transition-transform"></div>
              <div className="w-6 h-6 rounded-full bg-green-500 cursor-pointer border hover:scale-110 transition-transform"></div>
              <div className="w-6 h-6 rounded-full bg-yellow-400 cursor-pointer border hover:scale-110 transition-transform"></div>
              <div className="w-6 h-6 rounded-full bg-black cursor-pointer border hover:scale-110 transition-transform"></div>
              <div className="w-6 h-6 rounded-full bg-pink-500 cursor-pointer border hover:scale-110 transition-transform"></div>
            </div>
          </div>

        </div>

        {/* 3. PRODUCT GRID */}
        <div className="flex-1">
          
          {/* Top Bar (Sort & Mobile Filter) */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-500 text-sm">Showing {suits.length} Products</p>
            
            <div className="flex gap-4">
              <button className="md:hidden flex items-center gap-2 text-sm font-medium border px-4 py-2 rounded">
                <Filter size={16} /> Filters
              </button>
              
              <select className="border-none text-sm font-medium bg-transparent focus:ring-0 cursor-pointer">
                <option>Sort by: Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {suits.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                
                {/* Image */}
                <div className="relative h-[400px] overflow-hidden rounded-lg bg-gray-100 mb-4">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Add to Cart Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button className="w-full bg-white text-gray-900 py-3 rounded shadow-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-gray-900 hover:text-white transition-colors">
                      <ShoppingBag size={16} /> Add to Cart
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div>
                  <h3 className="font-serif text-lg text-gray-900">{product.name}</h3>
                  <p className="text-primary font-medium mt-1">{product.price}</p>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}