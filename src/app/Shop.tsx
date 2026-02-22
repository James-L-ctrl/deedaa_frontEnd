import { motion } from 'motion/react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from './contexts/CartContext';

const shopProducts = [
  {
    id: 1,
    name: 'Nude Glow Lip Balm',
    description: 'A nourishing lip balm with subtle nude tint and natural shine',
    price: 26,
    image: 'https://images.unsplash.com/photo-1583209814468-fce526b91543?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwYmVhdXR5JTIwcHJvZHVjdCUyMGJsdXNofGVufDF8fHx8MTc3MDM4MjQ5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 5
  },
  {
    id: 2,
    name: 'Rose Quartz Tint',
    description: 'Luxurious pink lip gloss with rose quartz shimmer and hydration',
    price: 30,
    image: 'https://images.unsplash.com/photo-1764777858430-a285d6d9cf50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwaW5rJTIwbGlwJTIwZ2xvc3MlMjBjb3NtZXRpY3N8ZW58MXx8fHwxNzcwMzgyNDk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 5
  },
  {
    id: 3,
    name: 'Blush Velvet Cream',
    description: 'Rich blush cream with velvet texture for natural radiance',
    price: 34,
    image: 'https://images.unsplash.com/photo-1767379462101-b93554f3025c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjb3NtZXRpYyUyMHBhY2thZ2luZyUyMHJvc2V8ZW58MXx8fHwxNzcwMzgyNDk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 5
  },
  {
    id: 4,
    name: 'Pearl Radiance Serum',
    description: 'Illuminating face serum with pearl extract for glowing skin',
    price: 42,
    image: 'https://images.unsplash.com/photo-1556228634-2e0de958b4b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHNlcnVtJTIwYm90dGxlJTIwZ2xvc3MlMjBjb3NtZXRpY3N8ZW58MXx8fHwxNzcwMzgyNDk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 5
  },
  {
    id: 5,
    name: 'Amber Night Cream',
    description: 'Overnight recovery cream with amber essence for deep nourishment',
    price: 38,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhbSUyMGNvc21ldGljJTIwY3JlYW0lMjBqYXJ8ZW58MXx8fHwxNzcwMzgyNDk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 5
  },
  {
    id: 6,
    name: 'Sage Eye Gel',
    description: 'Cooling eye gel with sage extract to reduce puffiness',
    price: 28,
    image: 'https://images.unsplash.com/photo-1570172629677-c5b89d2b5c53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleWUlMjBnZWwlMjBjb3NtZXRpYyUyMGJvdHRsZXxlbnwxfHx8MTc3MDM4MjQ5OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 5
  },
  {
    id: 7,
    name: 'Lavender Mist',
    description: 'Hydrating facial mist with calming lavender essential oil',
    price: 22,
    image: 'https://images.unsplash.com/photo-1570172629677-c5b89d2b5c53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleWUlMjBnZWwlMjBjb3NtZXRpYyUyMGJvdHRsZXxlbnwxfHx8MTc3MDM4MjQ5OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 5
  },
  {
    id: 8,
    name: 'Coconut Body Butter',
    description: 'Rich body butter with coconut oil for deep skin hydration',
    price: 32,
    image: 'https://images.unsplash.com/photo-1572561613741-445fbbf9f0f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2R5JTIwYnV0dGVyJTIwY3JlYW0lMjB3aGl0ZXxlbnwxfHx8MTc3MDM4MjQ5OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 5
  }
];

export default function Shop() {
  const { addToCart, state } = useCart();
  return (
    <div className="min-h-screen bg-white">
      {/* Shop Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#FFE4E6]/30">
        <div className="container mx-auto px-8 md:px-16 lg:px-20 max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-20 w-full">
            {/* Left Section - Home Button */}
            <div className="flex items-center">
              <Link 
                to="/"
                className="flex items-center gap-3 text-[#4A3F3F] hover:text-[#D4A5A5] transition-colors mr-6"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-['Inter'] text-sm tracking-wide">Home</span>
              </Link>
              
              {/* Logo */}
              <Link 
                to="/"
                className="font-['Cormorant'] text-3xl font-light text-[#4A3F3F]"
              >
                deedaa
              </Link>
            </div>

            {/* Cart Button */}
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        <div className="container mx-auto px-8 md:px-16 lg:px-20 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="font-['Cormorant'] text-5xl md:text-6xl font-light text-[#4A3F3F] mb-4">
            Shop All
          </h1>
          <p className="font-['Inter'] text-[#8B7373] text-lg font-light">
            Discover our complete collection of clean beauty essentials
          </p>
        </motion.div>

        {/* Product Grid - 2x2 layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {shopProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              {/* Product Image */}
              <div className="relative aspect-square rounded-[25px] overflow-hidden bg-gradient-to-br from-[#FFF5F7] to-[#FFE4E6] mb-6 shadow-md group-hover:shadow-xl transition-all duration-500">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Quick Add Button */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  onClick={() => addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image
                  })}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-[#D4A5A5] px-8 py-3 rounded-full font-['Inter'] text-sm tracking-wider shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  Quick Add
                </motion.button>
              </div>

              {/* Product Info */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-['Cormorant'] text-2xl text-[#4A3F3F] font-light">
                    {product.name}
                  </h3>
                  <span className="font-['Cormorant'] text-xl text-[#8B7373]">${product.price}</span>
                </div>
                
                {/* Description */}
                <p className="font-['Inter'] text-[#8B7373] text-sm leading-relaxed">
                  {product.description}
                </p>
                
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(product.rating)].map((_, i) => (
                      <span key={i} className="text-[#D4A5A5] text-sm">★</span>
                    ))}
                  </div>
                  <span className="font-['Inter'] text-[#8B7373] text-sm">
                    ({product.rating}.0)
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        </div>
      </main>
      
      {/* Bottom Margin */}
      <div className="h-20"></div>
    </div>
  );
}
