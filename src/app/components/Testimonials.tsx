import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const testimonials = [
  {
    id: 1,
    name: 'Sophie M.',
    quote: 'The lip butter balm is absolutely divine. It feels luxurious and keeps my lips soft all day long.',
    image: 'https://images.unsplash.com/photo-1748839724476-e44e1357aa36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBlZGl0b3JpYWwlMjBwb3J0cmFpdCUyMHdvbWFufGVufDF8fHx8MTc3MDM4MjQ5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 5
  },
  {
    id: 2,
    name: 'Emma L.',
    quote: "I've never found a lip product that feels this good and looks this natural. deedaa has become my everyday essential.",
    image: 'https://images.unsplash.com/photo-1635693048930-8a68d217e21a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwd29tYW4lMjBuYXR1cmFsJTIwbWFrZXVwfGVufDF8fHx8MTc3MDM4MjQ5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 5
  },
  {
    id: 3,
    name: 'Olivia K.',
    quote: 'The perfect balance of beauty and care. These products are truly special.',
    image: 'https://images.unsplash.com/photo-1748839724476-e44e1357aa36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBlZGl0b3JpYWwlMjBwb3J0cmFpdCUyMHdvbWFufGVufDF8fHx8MTc3MDM4MjQ5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 5
  }
];

export function Testimonials() {
  return (
    <section className="py-28 bg-gradient-to-br from-[#FFF5F7] via-[#FFE4E6]/30 to-white">
      <div className="container mx-auto px-6 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-['Cormorant'] text-5xl md:text-6xl font-light text-[#4A3F3F] mb-4">
            What They're Saying
          </h2>
          <p className="font-['Inter'] text-[#8B7373] text-lg font-light">
            Join thousands of happy customers
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="bg-white rounded-[30px] p-8 shadow-lg hover:shadow-xl transition-all duration-500"
            >
              <div className="flex items-center gap-1 mb-5">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-[#D4A5A5] text-xl">★</span>
                ))}
              </div>
              
              <p className="font-['Inter'] text-[#4A3F3F] leading-relaxed mb-8 font-light text-lg">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <ImageWithFallback
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-['Cormorant'] text-lg text-[#4A3F3F]">{testimonial.name}</p>
                  <p className="font-['Inter'] text-sm text-[#8B7373]">Verified Customer</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
