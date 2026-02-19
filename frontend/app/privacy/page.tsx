import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  Database, 
  Globe, 
  HelpCircle,
  Mail,
  Building2,
  CheckCircle2
} from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="bg-[#FCFBFA] min-h-screen font-sans">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <span className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black uppercase tracking-[0.3em] bg-white/10 backdrop-blur-md rounded-full text-gray-300 border border-white/10">
            Privacy First
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light italic">
            "Your data security is our top priority. We respect your privacy."
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-12 pb-20 relative z-20">
        {/* Privacy Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-300">
            <div className="bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <Lock className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Data Protection</h3>
            <p className="text-gray-500 text-sm">Aapka personal data encrypted aur secure servers par store kiya jata hai.</p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-300">
            <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <EyeOff className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">No Third-Party Sell</h3>
            <p className="text-gray-500 text-sm">Hum aapka data kisi bhi bahari company ko nahi bechte.</p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-300">
            <div className="bg-orange-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <Database className="text-orange-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Cookie Usage</h3>
            <p className="text-gray-500 text-sm">Cookies ka upyog sirf aapke shopping experience ko behtar banane ke liye hota hai.</p>
          </div>
        </div>

        {/* Policy Details Container */}
        <div className="max-w-4xl mx-auto bg-white rounded-[3rem] p-8 md:p-16 shadow-sm border border-gray-100">
          <section className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white">
                <ShieldCheck size={20} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-gray-900">What we Collect?</h2>
            </div>
            <div className="space-y-4 text-gray-600 pl-2 md:pl-14">
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-green-600" /> Name, Phone Number aur Delivery Address.
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-green-600" /> Email address for order updates.
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-green-600" /> Payment details (Processed securely via PhonePe).
                </li>
              </ul>
            </div>
          </section>

          <section className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
               <Globe size={20} /> Data Security
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Hum industry-standard security measures ka upyog karte hain taaki aapka data unauthorized access se bacha rahe. Humare payment gateways PCI-DSS compliant hain.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-100 text-center">
             <p className="text-gray-400 text-sm italic">Last Updated: February 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}