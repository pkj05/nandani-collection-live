// components/ImageLightbox.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";

export default function ImageLightbox({ src, alt }: { src: string; alt: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* छोटी इमेज जिस पर यूजर क्लिक करेगा */}
      <motion.div
        layoutId={src}
        onClick={() => setIsOpen(true)}
        className="cursor-zoom-in relative w-full h-80 rounded-2xl overflow-hidden shadow-lg"
      >
        <Image 
          src={src} 
          alt={alt} 
          fill 
          className="object-cover"
        />
      </motion.div>

      {/* फुल स्क्रीन लाइटबॉक्स */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-10"
          >
            {/* क्लोज बटन */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all z-[110]"
            >
              <X size={30} />
            </button>

            {/* फुल स्क्रीन इमेज */}
            <motion.div
              layoutId={src}
              className="relative w-full h-full max-w-5xl max-h-[90vh]"
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}