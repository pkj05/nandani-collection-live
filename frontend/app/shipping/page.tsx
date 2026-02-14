import { Truck, Clock, ShieldCheck, Globe, PackageCheck, AlertCircle } from "lucide-react";

export default function ShippingPolicy() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Truck className="mx-auto mb-6 text-gray-400" size={48} />
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Shipping Policy</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg italic">
            "Delivering Elegance to Your Doorstep with Care and Speed."
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        
        {/* Key Features (Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="p-8 border rounded-3xl shadow-sm hover:shadow-md transition-shadow text-center">
            <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Clock className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Fast Dispatch</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Hum sabhi orders ko 24-48 ghanton ke andar dispatch kar dete hain taaki aapka suit jaldi aap tak pahunche.
            </p>
          </div>

          <div className="p-8 border rounded-3xl shadow-sm hover:shadow-md transition-shadow text-center">
            <div className="bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Secure Packing</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Aapke ethnic wear ko premium waterproof packing mein bheja jata hai taaki koi damage na ho.
            </p>
          </div>

          <div className="p-8 border rounded-3xl shadow-sm hover:shadow-md transition-shadow text-center">
            <div className="bg-purple-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Globe className="text-purple-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Pan India Delivery</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Gurgaon se lekar pure Bharat ke har kone tak humari delivery service available hai.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="max-w-4xl mx-auto space-y-12">
          
          <section className="border-l-4 border-gray-900 pl-8">
            <h2 className="text-2xl font-serif font-bold mb-4 flex items-center gap-3">
              <PackageCheck className="text-gray-900" /> Delivery Timeline
            </h2>
            <div className="text-gray-700 space-y-3 leading-relaxed">
              <p>Hum koshish karte hain ki aapka order jald se jald pahunche:</p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><strong>Metro Cities:</strong> 3-5 Business Days</li>
                <li><strong>Other Regions:</strong> 5-7 Business Days</li>
                <li><strong>Local (Gurgaon/Delhi NCR):</strong> 1-2 Business Days</li>
              </ul>
            </div>
          </section>

          <section className="border-l-4 border-gray-900 pl-8">
            <h2 className="text-2xl font-serif font-bold mb-4">Shipping Charges</h2>
            <p className="text-gray-700 leading-relaxed">
              Nandani Collection par hum transparency mein vishwas rakhte hain:
            </p>
            <div className="bg-gray-50 p-6 rounded-2xl mt-4 text-sm italic border">
              "₹1999 se upar ke sabhi orders par **FREE SHIPPING** di jati hai. Isse kam ke orders par nominal delivery fee apply hoti hai."
            </div>
          </section>

          <section className="border-l-4 border-gray-900 pl-8">
            <h2 className="text-2xl font-serif font-bold mb-4 flex items-center gap-3">
               Tracking Your Order
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm">
              Jaise hi aapka order dispatch hoga, hum aapko WhatsApp aur Email par ek **Tracking ID** bhejenge. Aap humari website par bhi apna order track kar sakte hain.
            </p>
          </section>

          <section className="border-l-4 border-red-600 pl-8">
            <h2 className="text-2xl font-serif font-bold mb-4 flex items-center gap-3 text-red-600">
              <AlertCircle size={24} /> Important Note
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm">
              Tyohaaron (Festivals) ya heavy rains ke samay delivery mein thodi deri ho sakti hai. Hum aapko har step par update karte rahenge. Kisi bhi sawal ke liye aap humein <b>+91 9149796456</b> par WhatsApp kar sakte hain.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}