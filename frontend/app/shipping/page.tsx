import { 
  Truck, 
  Clock, 
  ShieldCheck, 
  RotateCcw, 
  CreditCard, 
  HelpCircle,
  Mail,
  Phone,
  Building2,
  CheckCircle2
} from "lucide-react";

export default function PolicyPage() {
  return (
    <div className="bg-[#FCFBFA] min-h-screen font-sans">
      {/* Premium Hero Section */}
      <div className="bg-gray-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute transform -rotate-45 -left-10 -top-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <span className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black uppercase tracking-[0.3em] bg-white/10 backdrop-blur-md rounded-full text-gray-300 border border-white/10">
            Trust & Transparency
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 tracking-tight">
            Shipping & Returns
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light leading-relaxed italic">
            "At Nandani Collection, we ensure your elegance arrives on time and your satisfaction is guaranteed."
          </p>
        </div>
      </div>

      {/* ✅ Adjusted container to prevent clipping of box borders */}
      <div className="max-w-7xl mx-auto px-4 -mt-12 pb-20 relative z-20">
        
        {/* Quick Timeline Stats (Premium Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {/* Fast Delivery Box */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-300">
            <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Truck className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Fast Delivery</h3>
            <p className="text-2xl font-serif font-bold text-blue-600 mb-2">3-4 Working Days</p>
            <p className="text-gray-500 text-sm leading-relaxed">Across all major cities in India with express tracking.</p>
          </div>

          {/* Easy Returns Box */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-300">
            <div className="bg-orange-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <RotateCcw className="text-orange-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Easy Returns</h3>
            <p className="text-2xl font-serif font-bold text-orange-600 mb-2">3-4 Days Window</p>
            <p className="text-gray-500 text-sm leading-relaxed">Not happy? Request a return within 3-4 days of delivery.</p>
          </div>

          {/* Quick Refunds Box */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-300">
            <div className="bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <CreditCard className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Quick Refunds</h3>
            <p className="text-2xl font-serif font-bold text-green-600 mb-2">5-7 Working Days</p>
            <p className="text-gray-500 text-sm leading-relaxed">Directly credited back to your original payment mode.</p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="max-w-4xl mx-auto bg-white rounded-[3rem] p-8 md:p-16 shadow-sm border border-gray-100">
          
          {/* Shipping Detail */}
          <section className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white">
                <Truck size={20} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-gray-900">Shipping Information</h2>
            </div>
            <div className="space-y-4 text-gray-600 leading-relaxed pl-2 md:pl-14">
              <p>Hum sabhi orders ko Gurgaon, Haryana se dispatch karte hain. Humara goal hai ki aapka selection aap tak surakshit aur jaldi pahunche.</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-green-600 mt-1 flex-shrink-0" />
                  <span><b>Standard Delivery:</b> Sabhi orders 3-4 working days ke andar deliver kar diye jate hain.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-green-600 mt-1 flex-shrink-0" />
                  <span><b>Free Shipping:</b> ₹1499 se upar ke orders par koi delivery charge nahi hai.</span>
                </li>
              </ul>
            </div>
          </section>

          <hr className="border-gray-100 mb-16" />

          {/* Return & Refund Detail */}
          <section className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white">
                <RotateCcw size={20} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-gray-900">Return & Refund Policy</h2>
            </div>
            <div className="space-y-4 text-gray-600 leading-relaxed pl-2 md:pl-14">
              <p>Agar aap apne order se puri tarah santusht nahi hain, toh hum use asan banate hain:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-2">How to Return?</h4>
                  <p className="text-sm">Order milne ke <b>3-4 working days</b> ke andar aap return request raise kar sakte hain.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-2">Refund Process</h4>
                  <p className="text-sm">Quality check ke baad, apka amount <b>5-7 working days</b> mein original payment mode mein credit ho jayega.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Business Contact Footer */}
          <section className="bg-gray-900 rounded-[2rem] p-8 md:p-10 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl font-serif font-bold mb-8 flex items-center gap-3">
                <HelpCircle size={24} className="text-gray-400" /> Need Help?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-[#8B3E48] transition-colors">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-widest">WhatsApp/Call</p>
                      <p className="font-bold">+91 9149796456</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-[#8B3E48] transition-colors">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-widest">Email Us</p>
                      <p className="font-bold text-sm">nandani.collection05@gmail.com</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4 pt-2 md:pt-0">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">Business Name</p>
                    <p className="font-bold text-lg">Nandani Collection</p>
                    <p className="text-sm text-gray-400 mt-1">Premium Ethnic Wear, Gurgaon, India</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}