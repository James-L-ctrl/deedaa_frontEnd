import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export function PreOrderBanner() {
  return (
    <section className="py-20 bg-gradient-to-r from-[#F4C2C2] via-[#E5B4B4] to-[#D4A5A5] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-[80px]"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white rounded-full blur-[100px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-6 lg:px-20 text-center relative z-10"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="inline-block font-['Inter'] text-white/90 uppercase tracking-[0.4em] text-xs mb-4">
            Coming Soon
          </span>
          <h2 className="font-['Cormorant'] text-5xl md:text-6xl font-light text-white mb-6">
            Pre-Orders Opening Soon
          </h2>
          <p className="font-['Inter'] text-white/90 text-lg mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Be the first to experience our newest formulations. Sign up to get notified when pre-orders open.
          </p>
          <Link to="/shop/crystal-dew-essence">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-[#D4A5A5] hover:bg-white/95 px-12 py-4 rounded-full font-['Inter'] tracking-wider transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Pre-order Crystal Dew
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
