import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold tracking-tight">Nandani</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Experience the essence of Indian tradition with our handcrafted ethnic wear. Elegance in every thread.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Column 2: Shop Links */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-6">Shop</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/suits" className="hover:text-primary transition-colors">Designer Suits</Link></li>
              <li><Link href="/sarees" className="hover:text-primary transition-colors">Banarasi Sarees</Link></li>
              <li><Link href="/kurtis" className="hover:text-primary transition-colors">Premium Kurtis</Link></li>
              <li><Link href="/new-arrivals" className="hover:text-primary transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-6">Support</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
              <li><Link href="/returns" className="hover:text-primary transition-colors">Returns & Exchange</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span># 613, Gali No.13, Jyoti Park Colony, Gurgaon (H.R) - 122001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} />
                <span>+91 9149796456</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} />
                <span>nandani.collection05@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Nandani Collection. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;