import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from './contexts/CartContext';

export default function Cart() {
  const { state, updateQuantity, removeFromCart } = useCart();

  const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-white">
      {/* Cart Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#FFE4E6]/30">
        <div className="container mx-auto px-8 md:px-16 lg:px-20 max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-20 w-full">
            {/* Left Section - Back Button */}
            <div className="flex items-center">
              <Link 
                to="/shop"
                className="flex items-center gap-3 text-[#4A3F3F] hover:text-[#D4A5A5] transition-colors mr-6"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-['Inter'] text-sm tracking-wide">Back to Shop</span>
              </Link>
              
              {/* Logo */}
              <Link 
                to="/"
                className="font-['Cormorant'] text-3xl font-light text-[#4A3F3F]"
              >
                deedaa
              </Link>
            </div>

            {/* Cart Icon */}
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#4A3F3F]" />
              <span className="font-['Inter'] text-sm text-[#4A3F3F]">
                Cart ({state.items.length})
              </span>
            </div>
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
              Shopping Cart
            </h1>
            <p className="font-['Inter'] text-[#8B7373] text-lg font-light">
              Review your selected items
            </p>
          </motion.div>

          {state.items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center py-32"
            >
              <ShoppingBag className="w-16 h-16 text-[#E5B4B4] mx-auto mb-6" />
              <h2 className="font-['Cormorant'] text-3xl font-light text-[#4A3F3F] mb-4">
                Your cart is empty
              </h2>
              <p className="font-['Inter'] text-[#8B7373] mb-8">
                Looks like you haven't added any items yet
              </p>
              <Link 
                to="/shop"
                className="inline-block bg-[#E5B4B4] text-white px-8 py-3 rounded-full font-['Inter'] text-sm tracking-wider hover:bg-[#D4A5A5] transition-colors"
              >
                Continue Shopping
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-6"
                >
                  {state.items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex gap-6 p-6 bg-white rounded-[25px] border border-[#FFE4E6]/30 shadow-sm"
                    >
                      {/* Product Image */}
                      <div className="w-24 h-24 rounded-[15px] overflow-hidden bg-gradient-to-br from-[#FFF5F7] to-[#FFE4E6] flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-['Cormorant'] text-xl text-[#4A3F3F] font-light mb-2">
                          {item.name}
                        </h3>
                        <p className="font-['Inter'] text-[#8B7373] text-sm mb-4">
                          ${item.price}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-8 rounded-full border border-[#E5B4B4] flex items-center justify-center text-[#E5B4B4] hover:bg-[#E5B4B4] hover:text-white transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </motion.button>
                            <span className="font-['Inter'] text-[#4A3F3F] w-8 text-center">
                              {item.quantity}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-8 rounded-full border border-[#E5B4B4] flex items-center justify-center text-[#E5B4B4] hover:bg-[#E5B4B4] hover:text-white transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </motion.button>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#E5B4B4] hover:text-[#D4A5A5] transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="font-['Cormorant'] text-xl text-[#4A3F3F] font-light">
                          ${item.price * item.quantity}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="bg-gradient-to-br from-[#FFF5F7] to-[#FFE4E6] rounded-[25px] p-8 shadow-lg sticky top-24"
                >
                  <h3 className="font-['Cormorant'] text-2xl text-[#4A3F3F] font-light mb-6">
                    Order Summary
                  </h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="font-['Inter'] text-[#8B7373]">Subtotal</span>
                      <span className="font-['Inter'] text-[#4A3F3F]">${subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-['Inter'] text-[#8B7373]">Shipping</span>
                      <span className="font-['Inter'] text-[#4A3F3F]">
                        {shipping === 0 ? 'Free' : `$${shipping}`}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <p className="font-['Inter'] text-[#8B7373] text-xs">
                        Add ${(50 - subtotal)} more for free shipping
                      </p>
                    )}
                    <div className="border-t border-[#E5B4B4]/30 pt-4">
                      <div className="flex justify-between">
                        <span className="font-['Cormorant'] text-xl text-[#4A3F3F] font-light">Total</span>
                        <span className="font-['Cormorant'] text-xl text-[#4A3F3F] font-light">${total}</span>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-[#E5B4B4] text-white py-4 rounded-full font-['Inter'] text-sm tracking-wider hover:bg-[#D4A5A5] transition-colors mb-4"
                  >
                    Proceed to Checkout
                  </motion.button>

                  <Link 
                    to="/shop"
                    className="block text-center font-['Inter'] text-[#8B7373] text-sm hover:text-[#D4A5A5] transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Margin */}
      <div className="h-20"></div>
    </div>
  );
}
