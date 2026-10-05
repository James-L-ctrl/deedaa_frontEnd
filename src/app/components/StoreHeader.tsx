import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { useCart } from '../contexts/CartContext';

export function StoreHeader({ backTo, backLabel }: { backTo: string; backLabel: string }) {
  const { totalItems } = useCart();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#FFE4E6]/30">
      <div className="container mx-auto px-8 md:px-16 lg:px-20 max-w-7xl">
        <div className="flex items-center justify-between h-20 w-full">
          <div className="flex items-center">
            <Link
              to={backTo}
              className="flex items-center gap-3 text-[#4A3F3F] hover:text-[#D4A5A5] transition-colors mr-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-['Inter'] text-sm tracking-wide">{backLabel}</span>
            </Link>
            <Link to="/" className="font-['Cormorant'] text-3xl font-light text-[#4A3F3F]">
              deedaa
            </Link>
          </div>
          <Link to="/cart">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="relative p-2">
              <ShoppingBag className="w-5 h-5 text-[#4A3F3F]" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E5B4B4] rounded-full flex items-center justify-center text-white text-xs">
                {totalItems}
              </span>
            </motion.button>
          </Link>
        </div>
      </div>
    </header>
  );
}
