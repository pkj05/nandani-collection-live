import { RotateCcw, ShieldCheck, CheckCircle2, XCircle, Truck, HelpCircle, PackageOpen } from "lucide-react";

export default function ReturnsPolicy() {
  return (
    <div className="bg-white min-h-screen">
      {/* Premium Hero Section */}
      <div className="bg-rose-50 border-b border-rose-100 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <RotateCcw className="mx-auto mb-6 text-rose-500 animate-pulse" size={50} />
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">Returns & Exchange</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Humari koshish hai ki aap har purchase se khush rahein. Agar koi dikat ho, toh hum usey suljhane ke liye yahan hain.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        
        {/* Quick Policy Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center group hover:border-rose-200 transition-all">
            <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <RotateCcw size={28} />
            </div>
            <h3 className="font-bold text-gray-900">7-Day Return</h3>
            <p className="text-gray-500 text-xs mt-2">Delivery ke 7 din ke andar return request karein.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center group hover:border-rose-200 transition-all">
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
              <ShieldCheck size={28} />
            </div>
            <h3 className="font-bold text-gray-900">Easy Exchange</h3>
            <p className="text-gray-500 text-xs mt-2">Size ya fabric ki dikat hone par turant exchange karein.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center group hover:border-rose-200 transition-all">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <PackageOpen size={28} />
            </div>
            <h3 className="font-bold text-gray-900">Free Pickup</h3>
            <p className="text-gray-500 text-xs mt-2">Hum aapke ghar se parcel khud pickup karwayenge.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center group hover:border-rose-200 transition-all">
            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="font-bold text-gray-900">Quick Refund</h3>
            <p className="text-gray-500 text-xs mt-2">QC pass hone ke bad 3-5 din mein paise wapas.</p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-3">
                <CheckCircle2 className="text-green-600" /> Return Kab Hoga?
              </h2>
              <ul className="space-y-4 text-gray-600">
                <li className="flex gap-3 text-sm">
                   Aapko galat item, damaged product, ya wrong size mila ho.
                </li>
                <li className="flex gap-3 text-sm">
                   Product unused (bina pehna hua) aur tags ke sath hona chahiye.
                </li>
                <li className="flex gap-3 text-sm">
                   Product original packing mein hona chahiye.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-3">
                <XCircle className="text-red-600" /> Return Kab Nahi Hoga?
              </h2>
              <ul className="space-y-4 text-gray-600">
                <li className="flex gap-3 text-sm">
                   Agar tags hata diye gaye hon ya product wash kar diya ho.
                </li>
                <li className="flex gap-3 text-sm">
                   Sale (Discounts) ke dauran liye gaye products sirf exchange ho sakte hain.
                </li>
                <li className="flex gap-3 text-sm">
                   Delivery ke 7 din beet jane ke baad request accept nahi hogi.
                </li>
              </ul>
            </section>
          </div>

          <div className="bg-gray-50 p-10 rounded-[40px] border border-gray-100">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8">Process Kaise Karein?</h2>
            <div className="space-y-8 relative">
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-rose-200"></div>
              
              <div className="relative flex gap-6">
                <div className="z-10 w-6 h-6 bg-rose-500 rounded-full border-4 border-white"></div>
                <div>
                  <h4 className="font-bold text-sm">Step 1: WhatsApp Karo</h4>
                  <p className="text-gray-500 text-xs mt-1">Humare number +91 9149796456 par apni Order ID aur photos bhejein.</p>
                </div>
              </div>

              <div className="relative flex gap-6">
                <div className="z-10 w-6 h-6 bg-rose-500 rounded-full border-4 border-white"></div>
                <div>
                  <h4 className="font-bold text-sm">Step 2: Approval & Pickup</h4>
                  <p className="text-gray-500 text-xs mt-1">Team check karegi aur 24 ghanton mein pickup schedule karegi.</p>
                </div>
              </div>

              <div className="relative flex gap-6">
                <div className="z-10 w-6 h-6 bg-rose-500 rounded-full border-4 border-white"></div>
                <div>
                  <h4 className="font-bold text-sm">Step 3: Refund/Exchange</h4>
                  <p className="text-gray-500 text-xs mt-1">QC pass hote hi aapka naya product ya refund process kar diya jayega.</p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-white rounded-2xl border border-rose-100 flex items-center gap-4">
              <HelpCircle className="text-rose-500 shrink-0" />
              <p className="text-xs text-gray-600">
                Koi sawal? Humein mail karein: <br/>
                <span className="font-bold text-gray-900">nandani.collection05@gmail.com</span>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}