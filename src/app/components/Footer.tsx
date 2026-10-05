import { motion } from 'motion/react';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-[#4A3F3F] text-white py-16">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-['Cormorant'] text-5xl font-light text-[#F4C2C2] mb-4"
            >
              deedaa
            </motion.h3>
            <p className="font-['Inter'] text-white/70 font-light leading-relaxed mb-6">
              Luxury beauty crafted with care. Soft on lips, strong on confidence.
            </p>
            <div className="flex gap-4">
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#E5B4B4] flex items-center justify-center transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#E5B4B4] flex items-center justify-center transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#E5B4B4] flex items-center justify-center transition-all duration-300"
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-['Inter'] text-white mb-4 tracking-wider uppercase text-sm">Shop</h4>
            <ul className="space-y-3 font-['Inter'] text-white/70 font-light">
              <li><Link to="/shop" className="hover:text-[#E5B4B4] transition-colors">All Products</Link></li>
              <li><Link to="/shop" className="hover:text-[#E5B4B4] transition-colors">Best Sellers</Link></li>
              <li><Link to="/shop" className="hover:text-[#E5B4B4] transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop/crystal-dew-essence" className="hover:text-[#E5B4B4] transition-colors">Pre-order</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-['Inter'] text-white mb-4 tracking-wider uppercase text-sm">Support</h4>
            <ul className="space-y-3 font-['Inter'] text-white/70 font-light">
              <li><Link to="/contact" className="hover:text-[#E5B4B4] transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping" className="hover:text-[#E5B4B4] transition-colors">Shipping</Link></li>
              <li><Link to="/shipping" className="hover:text-[#E5B4B4] transition-colors">Returns</Link></li>
              <li><Link to="/account" className="hover:text-[#E5B4B4] transition-colors">Your orders</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-['Inter'] text-white/60 text-sm font-light">
            © 2026 deedaa. All rights reserved.
          </p>
          <div className="flex gap-6 font-['Inter'] text-white/60 text-sm font-light">
            <Link to="/privacy" className="hover:text-[#E5B4B4] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#E5B4B4] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
