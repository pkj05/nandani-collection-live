import { 
  FileText, 
  Scale, 
  UserCheck, 
  ShieldAlert, 
  ShoppingCart, 
  HelpCircle,
  Mail,
  Phone,
  Building2,
  CheckCircle2
} from "lucide-react";

export default function TermsConditions() {
  return (
    <div className="bg-[#FCFBFA] min-h-screen font-sans">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <span className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black uppercase tracking-[0.3em] bg-white/10 backdrop-blur-md rounded-full text-gray-300 border border-white/10">
            Legal Framework
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light italic">
            "Rules and guidelines for a seamless shopping experience at Nandani Collection."
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-12 pb-20 relative z-20">
        {/* Key Highlights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-300">
            <div className="bg-purple-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <UserCheck className="text-purple-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">User Account</h3>
            <p className="text-gray-500 text-sm">Aapki account details ki suraksha aapki zimmedari hai.</p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-300">
            <div className="bg-amber-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <ShoppingCart className="text-amber-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Orders & Pricing</h3>
            <p className="text-gray-500 text-sm">Prices bina kisi purv suchna ke badle ja sakte hain.</p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-300">
            <div className="bg-red-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <ShieldAlert className="text-red-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Legal Compliance</h3>
            <p className="text-gray-500 text-sm">Humare sabhi niyam Gurgaon jurisdiction ke antargat aate hain.</p>
          </div>
        </div>

        {/* Details Container */}
        <div className="max-w-4xl mx-auto bg-white rounded-[3rem] p-8 md:p-16 shadow-sm border border-gray-100">
          <section className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white">
                <Scale size={20} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-gray-900">General Conditions</h2>
            </div>
            <div className="space-y-4 text-gray-600 pl-2 md:pl-14">
              <p>Nandani Collection website ka upyog karke aap humari sharton se sahamat hote hain. Hum kisi bhi samay in sharton ko badalne ka adhikaar rakhte hain.</p>
            </div>
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white">
                <FileText size={20} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-gray-900">Intellectual Property</h2>
            </div>
            <div className="space-y-4 text-gray-600 pl-2 md:pl-14">
              <p>Is website par uplabdha sabhi designs, images aur content <b>Nandani Collection</b> ki sampatti hai. Inka bina anumati ke upyog karna varjit hai.</p>
            </div>
          </section>

          {/* Business Card Section */}
          <div className="bg-gray-900 rounded-[2rem] p-8 text-white">
            <h3 className="text-xl font-serif font-bold mb-6">Contact for Legal Queries</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-gray-400" />
                <span className="text-sm">support@nandanicollection.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Building2 size={18} className="text-gray-400" />
                <span className="text-sm">Nandani Collection, Gurgaon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}