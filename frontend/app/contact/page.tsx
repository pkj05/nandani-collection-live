import { Mail, Phone, MapPin, Clock, Instagram, Youtube, Facebook, Send, MessageSquare } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-[#FCFBFA] min-h-screen font-sans">
      {/* Premium Hero Section */}
      <div className="bg-gray-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute transform -rotate-45 -left-10 -top-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <span className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black uppercase tracking-[0.3em] bg-white/10 backdrop-blur-md rounded-full text-gray-300 border border-white/10">
            Connect With Us
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 tracking-tight">
            Contact Us
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light leading-relaxed italic">
            "Experience the essence of Indian tradition. We are here to help you with your ethnic wear choices."
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-12 pb-20 relative z-20">
        
        {/* Main Grid: Contact Info and Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Left Side: Contact Information (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 h-full">
              <h2 className="text-2xl font-serif font-bold mb-8 text-gray-900 flex items-center gap-3">
                <MessageSquare className="text-gray-400" size={24} /> Get In Touch
              </h2>
              
              <div className="space-y-8">
                {/* Address */}
                <div className="flex items-start gap-5 group">
                  <div className="bg-red-50 p-4 rounded-2xl group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                    <MapPin size={24} className="text-red-600 group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Our Location</h3>
                    <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                      # 613, Gali No.13, Jyoti Park Colony, <br/> Gurgaon, HR - 122001
                    </p>
                  </div>
                </div>
                
                {/* Phone */}
                <div className="flex items-start gap-5 group">
                  <div className="bg-green-50 p-4 rounded-2xl group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                    <Phone size={24} className="text-green-600 group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Phone Number</h3>
                    <p className="text-gray-500 text-sm mt-1 font-medium">+91 9149796456</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-5 group">
                  <div className="bg-blue-50 p-4 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <Mail size={24} className="text-blue-600 group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Email Address</h3>
                    <p className="text-gray-500 text-sm mt-1 break-all uppercase">nandani.collection05@gmail.com</p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-5 group">
                  <div className="bg-orange-50 p-4 rounded-2xl group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                    <Clock size={24} className="text-orange-600 group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Business Hours</h3>
                    <p className="text-gray-500 text-sm mt-1">
                      Mon - Sat: 10:00 AM - 8:00 PM <br/> 
                      <span className="text-red-400 font-medium italic">Sunday: Closed</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-12 pt-8 border-t border-gray-100">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 text-center lg:text-left">Follow Our Collection</h3>
                <div className="flex justify-center lg:justify-start gap-4">
                  <a href="https://instagram.com/nandani_collections" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                    <div className="p-3 rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white shadow-md">
                      <Instagram size={20} />
                    </div>
                  </a>
                  <a href="https://youtube.com/@Nandani.Collection" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                    <div className="p-3 rounded-xl bg-[#FF0000] text-white shadow-md">
                      <Youtube size={20} />
                    </div>
                  </a>
                  <a href="#" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                    <div className="p-3 rounded-xl bg-[#1877F2] text-white shadow-md">
                      <Facebook size={20} />
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Contact Form Section (7 Columns) */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
              <h2 className="text-3xl font-serif font-bold mb-2 text-gray-900">Send a Message</h2>
              <p className="text-gray-500 mb-8">Humare products se judi kisi bhi jankari ke liye message karein.</p>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-gray-900 focus:ring-0 outline-none transition-all text-gray-900" 
                      placeholder="Enter your name" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-gray-900 focus:ring-0 outline-none transition-all text-gray-900" 
                      placeholder="Enter your email" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Your Message</label>
                  <textarea 
                    rows={5} 
                    className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-gray-900 focus:ring-0 outline-none transition-all text-gray-900" 
                    placeholder="Tell us what you are looking for..."
                  ></textarea>
                </div>
                
                <button 
                  type="button"
                  className="w-full bg-gray-900 text-white py-5 rounded-2xl font-bold hover:bg-black transition-all shadow-lg flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  <Send size={20} /> Submit Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* --- GOOGLE MAPS SECTION (FIXED LINK) --- */}
        <div className="w-full h-[450px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white bg-gray-50 relative">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.632007421042!2d77.0108941!3d28.4605075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1912b9df0a6d%3A0x833187eef72e3cb0!2sNandani%20Collection!5e0!3m2!1sen!2sin!4v1771520923324!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Nandani Collection Location"
            className="hover:grayscale-0 transition-all duration-1000"
          ></iframe>
        </div>
        <p className="text-center text-gray-400 text-xs mt-6 italic">
          * Visit our showroom in Gurgaon to explore the premium collection.
        </p>
      </div>
    </div>
  );
}