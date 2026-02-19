"use client";

import Link from "next/link";
import { Facebook, Instagram, Mail, Phone, MapPin, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand Info & Socials */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold tracking-tight text-white">Nandani</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Experience the essence of Indian tradition with our handcrafted ethnic wear. Elegance in every thread.
            </p>
            
            {/* Colourful Social Icons */}
            <div className="flex gap-5 pt-4">
              <a 
                href="https://instagram.com/nandani_collections" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-pink-500 rounded-lg"
                title="Follow us on Instagram"
                aria-label="Instagram" 
              >
                <div className="p-2 rounded-lg bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white">
                  <Instagram size={20} />
                </div>
              </a>

              <a 
                href="https://youtube.com/@Nandani.Collection" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-red-600 rounded-lg"
                title="Subscribe to our YouTube channel"
                aria-label="YouTube"
              >
                <div className="p-2 rounded-lg bg-[#FF0000] text-white">
                  <Youtube size={20} />
                </div>
              </a>

              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg"
                title="Follow us on Facebook"
                aria-label="Facebook"
              >
                <div className="p-2 rounded-lg bg-[#1877F2] text-white">
                  <Facebook size={20} />
                </div>
              </a>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-6 text-white border-b border-gray-700 pb-2 inline-block">Shop</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link href="/suits" className="hover:text-white transition-colors">Designer Suits</Link></li>
              <li><Link href="/sarees" className="hover:text-white transition-colors">Banarasi Sarees</Link></li>
              <li><Link href="/kurtis" className="hover:text-white transition-colors">Premium Kurtis</Link></li>
            </ul>
          </div>

          {/* Column 3: Support & Legal */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-6 text-white border-b border-gray-700 pb-2 inline-block">Support</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
              {/* ✅ Privacy & Terms Links Added */}
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-6 text-white border-b border-gray-700 pb-2 inline-block">Reach Us</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-1 flex-shrink-0 text-red-500" aria-hidden="true" />
                <span># 613, Gali No.13, Jyoti Park Colony, Gurgaon (H.R) - 122001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-green-500" aria-hidden="true" />
                <a href="tel:+919149796456" className="hover:text-white transition-colors" aria-label="Call us at +91 9149796456">+91 9149796456</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-blue-400" aria-hidden="true" />
                <a href="mailto:nandani.collection05@gmail.com" className="hover:text-white transition-colors break-all" aria-label="Email us at nandani.collection05@gmail.com">
                  nandani.collection05@gmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Nandani Collection. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;