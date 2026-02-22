import { motion } from 'motion/react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { state } = useCart();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#FFE4E6]/30">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/" className="font-['Cormorant'] text-3xl font-light text-[#4A3F3F]">
              deedaa
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:flex items-center gap-8"
          >
            <Link to="/shop" className="font-['Inter'] text-[#4A3F3F] hover:text-[#D4A5A5] transition-colors text-sm tracking-wide">
              Shop
            </Link>
            <a href="#" className="font-['Inter'] text-[#4A3F3F] hover:text-[#D4A5A5] transition-colors text-sm tracking-wide">
              About
            </a>
            <a href="#" className="font-['Inter'] text-[#4A3F3F] hover:text-[#D4A5A5] transition-colors text-sm tracking-wide">
              Ingredients
            </a>
            <a href="#" className="font-['Inter'] text-[#4A3F3F] hover:text-[#D4A5A5] transition-colors text-sm tracking-wide">
              Journal
            </a>
          </motion.div>

          {/* Cart & Mobile Menu */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4"
          >
            <Link to="/cart">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2"
              >
                <ShoppingBag className="w-5 h-5 text-[#4A3F3F]" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E5B4B4] rounded-full flex items-center justify-center text-white text-xs">
                  {state.totalItems}
                </span>
              </motion.button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-[#4A3F3F]" />
              ) : (
                <Menu className="w-6 h-6 text-[#4A3F3F]" />
              )}
            </button>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-6 border-t border-[#FFE4E6]/30"
          >
            <div className="flex flex-col gap-4">
              <Link to="/shop" className="font-['Inter'] text-[#4A3F3F] hover:text-[#D4A5A5] transition-colors text-sm tracking-wide py-2">
                Shop
              </Link>
              <a href="#" className="font-['Inter'] text-[#4A3F3F] hover:text-[#D4A5A5] transition-colors text-sm tracking-wide py-2">
                About
              </a>
              <a href="#" className="font-['Inter'] text-[#4A3F3F] hover:text-[#D4A5A5] transition-colors text-sm tracking-wide py-2">
                Ingredients
              </a>
              <a href="#" className="font-['Inter'] text-[#4A3F3F] hover:text-[#D4A5A5] transition-colors text-sm tracking-wide py-2">
                Journal
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
