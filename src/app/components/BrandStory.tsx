import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function BrandStory() {
  return (
    <section className="py-28 bg-gradient-to-b from-white to-[#FFF5F7]">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1764513168260-391d5a3ea21a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0JTIwcGluayUyMGFlc3RoZXRpYyUyMG1pbmltYWxpc3R8ZW58MXx8fHwxNzcwMzgyNDk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Brand aesthetic"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFE4E6]/20 to-transparent"></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2"
          >
            <span className="font-['Inter'] text-[#D4A5A5] uppercase tracking-[0.3em] text-sm mb-6 block">
              Our Story
            </span>
            <h2 className="font-['Cormorant'] text-5xl md:text-6xl font-light text-[#4A3F3F] mb-8 leading-tight">
              Beauty that feels<br />as good as it looks
            </h2>
            <div className="space-y-6 font-['Inter'] text-[#8B7373] text-lg leading-relaxed font-light">
              <p>
                deedaa was born from a simple belief: beauty should be effortless, elegant, and empowering. We create luxurious formulas that enhance your natural beauty without compromise.
              </p>
              <p>
                Every product is thoughtfully crafted with clean, nourishing ingredients that care for your skin while delivering beautiful, long-lasting results. From our signature lip butter balm to our innovative lip tattoo, each formula celebrates the art of understated elegance.
              </p>
              <p>
                Our commitment is to modern femininity—soft, strong, and unapologetically you.
              </p>
            </div>
            <Link to="/about">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-10 bg-transparent border-2 border-[#E5B4B4] text-[#D4A5A5] hover:bg-[#E5B4B4] hover:text-white px-10 py-3 rounded-full font-['Inter'] text-sm tracking-wider transition-all duration-300"
              >
                Learn More
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
