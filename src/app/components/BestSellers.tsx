import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Link } from 'react-router-dom';

const bestSellers = [
  {
    id: 1,
    name: 'Nude Glow Lip Balm',
    price: '$26',
    image: 'https://images.unsplash.com/photo-1583209814468-fce526b91543?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwYmVhdXR5JTIwcHJvZHVjdCUyMGJsdXNofGVufDF8fHx8MTc3MDM4MjQ5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 5
  },
  {
    id: 2,
    name: 'Rose Quartz Tint',
    price: '$30',
    image: 'https://images.unsplash.com/photo-1764777858430-a285d6d9cf50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwaW5rJTIwbGlwJTIwZ2xvc3MlMjBjb3NtZXRpY3N8ZW58MXx8fHwxNzcwMzgyNDk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 5
  },
  {
    id: 3,
    name: 'Blush Velvet Cream',
    price: '$34',
    image: 'https://images.unsplash.com/photo-1767379462101-b93554f3025c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjb3NtZXRpYyUyMHBhY2thZ2luZyUyMHJvc2V8ZW58MXx8fHwxNzcwMzgyNDk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 5
  }
];

export function BestSellers() {
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
            Best Sellers
          </h2>
          <p className="font-['Inter'] text-[#8B7373] text-lg font-light">
            Our most-loved formulas
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {bestSellers.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="group"
            >
              <div className="relative aspect-square rounded-[25px] overflow-hidden bg-gradient-to-br from-[#FFF5F7] to-[#FFE4E6] mb-5 shadow-md group-hover:shadow-xl transition-all duration-500">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-[#D4A5A5] px-8 py-3 rounded-full font-['Inter'] text-sm tracking-wider shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  Quick Add
                </motion.button>
              </div>

              <div className="text-center">
                <h3 className="font-['Cormorant'] text-2xl text-[#4A3F3F] mb-2 font-light">
                  {product.name}
                </h3>
                <div className="flex items-center justify-center gap-1 mb-3">
                  {[...Array(product.rating)].map((_, i) => (
                    <span key={i} className="text-[#D4A5A5]">★</span>
                  ))}
                </div>
                <span className="font-['Cormorant'] text-xl text-[#8B7373]">{product.price}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link to="/shop">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#E5B4B4] hover:bg-[#D4A5A5] text-white px-12 py-4 rounded-full font-['Inter'] tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              View All Products
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
