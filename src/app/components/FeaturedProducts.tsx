import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useCart } from '../contexts/CartContext';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { formatMoney, type Product } from '../../lib/types';

export function FeaturedProducts() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.get<Product[]>('/api/products?featured=true').then(setProducts).catch(() => setProducts([]));
  }, []);

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-['Cormorant'] text-5xl md:text-6xl font-light text-[#4A3F3F] mb-4">
            Featured Collection
          </h2>
          <p className="font-['Inter'] text-[#8B7373] text-lg max-w-2xl mx-auto font-light">
            Discover our signature formulas crafted for effortless beauty
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group"
            >
              <Link to={`/shop/${product.slug}`}>
                <div className="relative aspect-square rounded-[30px] overflow-hidden bg-gradient-to-br from-[#FFF5F7] to-[#FFE4E6] mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-500">
                  <ImageWithFallback
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {product.badge && (
                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-5 py-2 rounded-full">
                      <span className="font-['Inter'] text-[#D4A5A5] text-xs tracking-wider uppercase">{product.badge}</span>
                    </div>
                  )}
                </div>
              </Link>

              <div className="text-center md:text-left">
                <h3 className="font-['Cormorant'] text-3xl text-[#4A3F3F] mb-3 font-light">
                  {product.name}
                </h3>
                <p className="font-['Inter'] text-[#8B7373] mb-4 font-light leading-relaxed">
                  {product.description}
                </p>
                <div className="flex items-center justify-center md:justify-start gap-6">
                  <span className="font-['Cormorant'] text-2xl text-[#D4A5A5]">{formatMoney(product.priceCents)}</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addToCart(product)}
                    className="bg-transparent border-2 border-[#E5B4B4] text-[#D4A5A5] hover:bg-[#E5B4B4] hover:text-white px-8 py-2 rounded-full font-['Inter'] text-sm tracking-wider transition-all duration-300"
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
