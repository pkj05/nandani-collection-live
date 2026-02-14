import { Mail, Phone, MapPin, Clock, Instagram, Youtube, Facebook } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <div className="bg-gray-50 py-16 border-b">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4 text-gray-900">Contact Us</h1>
          <p className="text-gray-600 max-w-2xl mx-auto italic">
            "Experience the essence of Indian tradition. We are here to help you with your ethnic wear choices."
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Main Grid: Contact Info and Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          
          {/* Left Side: Contact Information & Socials */}
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-serif font-semibold mb-8 text-gray-800 underline underline-offset-8 decoration-gray-300">
                Get In Touch
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="bg-gray-100 p-3 rounded-xl shadow-sm">
                    <MapPin className="text-red-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Our Location</h3>
                    <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                      # 613, Gali No.13, Jyoti Park Colony, Gurgaon, HR - 122001
                    </p>
                  </div>
                </div>
                
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="bg-gray-100 p-3 rounded-xl shadow-sm">
                    <Phone className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone Number</h3>
                    <p className="text-gray-600 text-sm mt-1">+91 9149796456</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="bg-gray-100 p-3 rounded-xl shadow-sm">
                    <Mail className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email Address</h3>
                    <p className="text-gray-600 text-sm mt-1 break-all">
                      nandani.collection05@gmail.com
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="bg-gray-100 p-3 rounded-xl shadow-sm">
                    <Clock className="text-orange-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Business Hours</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Mon - Sat: 10:00 AM - 8:00 PM <br/> 
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* --- NEW SOCIAL MEDIA SECTION --- */}
            <div className="pt-6">
              <h3 className="text-xl font-serif font-semibold mb-6 text-gray-800">Follow Our Collection</h3>
              <div className="flex gap-6">
                {/* Instagram */}
                <a href="https://instagram.com/nandani_collections" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                  <div className="p-3 rounded-2xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white shadow-md">
                    <Instagram size={28} />
                  </div>
                </a>

                {/* YouTube */}
                <a href="https://youtube.com/@Nandani.Collection" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                  <div className="p-3 rounded-2xl bg-[#FF0000] text-white shadow-md">
                    <Youtube size={28} />
                  </div>
                </a>

                {/* Facebook */}
                <a href="#" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                  <div className="p-3 rounded-2xl bg-[#1877F2] text-white shadow-md">
                    <Facebook size={28} />
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Right Side: Contact Form Section */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.08)] border border-gray-100">
            <h2 className="text-2xl font-serif font-semibold mb-6 text-gray-900">Send a Message</h2>
            <form className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none transition-all" 
                  placeholder="Enter your full name" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none transition-all" 
                  placeholder="Enter your email" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                <textarea 
                  rows={4} 
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none transition-all" 
                  placeholder="Tell us what you are looking for..."
                ></textarea>
              </div>
              <button 
                type="button"
                className="w-full bg-gray-900 text-white p-4 rounded-xl font-bold hover:bg-black transition-all shadow-md active:scale-[0.98]"
              >
                Submit Now
              </button>
            </form>
          </div>
        </div>

        {/* --- GOOGLE MAPS SECTION --- */}
        <div className="w-full h-[500px] rounded-3xl overflow-hidden shadow-lg border border-gray-200 bg-gray-50">
          <iframe 
            src="https://https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.632007421042!2d77.0108941!3d28.4605075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1912b9df0a6d%3A0x833187eef72e3cb0!2sNandani%20Collection!5e0!3m2!1sen!2sin!4v1771069094758!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Nandani Collection Location"
          ></iframe>
        </div>
        <p className="text-center text-gray-400 text-xs mt-4 italic">
          * Find us easily at our Gurgaon branch.
        </p>
      </div>
    </div>
  );
}