import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFF5F7] via-white to-[#FFF0F3]">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#F4C2C2] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#FFE4E6] rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <span className="text-[#D4A5A5] uppercase tracking-[0.3em] text-sm font-light">New Collection</span>
            </motion.div>
            
            <h1 className="font-['Cormorant'] text-6xl md:text-7xl lg:text-8xl font-light text-[#4A3F3F] mb-8 leading-[1.1]">
              deedaa
            </h1>
            
            <p className="font-['Cormorant'] text-3xl md:text-4xl font-light text-[#8B7373] mb-12 leading-relaxed italic">
              Soft on lips.<br />
              Strong on confidence.
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#E5B4B4] hover:bg-[#D4A5A5] text-white px-12 py-4 rounded-full font-['Inter'] font-light tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Discover Collection
            </motion.button>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            <div className="relative aspect-[3/4] rounded-[40px] overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1635693048930-8a68d217e21a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwd29tYW4lMjBuYXR1cmFsJTIwbWFrZXVwfGVufDF8fHx8MTc3MDM4MjQ5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Elegant beauty"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FFF5F7]/30 to-transparent"></div>
            </div>
            
            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="absolute -bottom-6 -left-6 bg-white rounded-full px-8 py-6 shadow-xl"
            >
              <p className="font-['Inter'] text-[#4A3F3F] text-sm">
                <span className="font-['Cormorant'] text-3xl font-light text-[#D4A5A5]">100%</span><br />
                <span className="text-xs tracking-wider">Natural</span>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
