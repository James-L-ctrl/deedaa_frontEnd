import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from './contexts/CartContext';
import { useAuth } from './contexts/AuthContext';
import { formatMoney } from '../lib/types';
import { StoreHeader } from './components/StoreHeader';
import { useState } from 'react';

export default function Cart() {
  const { items, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const subtotal = items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
  const shipping = subtotal >= 5000 ? 0 : 500;
  const total = subtotal + shipping;

  const updateItem = async (action: () => Promise<void>) => {
    setError('');
    try {
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update your cart. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <StoreHeader backTo="/shop" backLabel="Back to Shop" />
      <main className="pt-20">
        <div className="container mx-auto px-8 md:px-16 lg:px-20 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="font-['Cormorant'] text-5xl md:text-6xl font-light text-[#4A3F3F] mb-4">
              Shopping Cart
            </h1>
            <p className="font-['Inter'] text-[#8B7373] text-lg font-light">Review your selected items</p>
          </motion.div>

          {items.length === 0 ? (
            <div className="text-center py-32">
              <ShoppingBag className="w-16 h-16 text-[#E5B4B4] mx-auto mb-6" />
              <h2 className="font-['Cormorant'] text-3xl font-light text-[#4A3F3F] mb-4">Your cart is empty</h2>
              <Link
                to="/shop"
                className="inline-block bg-[#E5B4B4] text-white px-8 py-3 rounded-full font-['Inter'] text-sm tracking-wider hover:bg-[#D4A5A5]"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-6">
                {error && (
                  <p role="alert" className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
                    {error}
                  </p>
                )}
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-6 p-6 bg-white rounded-[25px] border border-[#FFE4E6]/30 shadow-sm"
                  >
                    <Link to={`/shop/${item.slug}`} className="w-24 h-24 rounded-[15px] overflow-hidden flex-shrink-0">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </Link>
                    <div className="flex-1">
                      <h3 className="font-['Cormorant'] text-xl text-[#4A3F3F] font-light mb-2">{item.name}</h3>
                      <p className="font-['Inter'] text-[#8B7373] text-sm mb-4">{formatMoney(item.priceCents)}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            aria-label={`Decrease quantity of ${item.name}`}
                            onClick={() => void updateItem(() => updateQuantity(item.productId, item.quantity - 1))}
                            className="w-8 h-8 rounded-full border border-[#E5B4B4] flex items-center justify-center text-[#E5B4B4]"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-['Inter'] w-8 text-center">{item.quantity}</span>
                          <button
                            type="button"
                            aria-label={`Increase quantity of ${item.name}`}
                            disabled={item.quantity >= (item.isPreorder ? 20 : Math.min(item.stock, 20))}
                            onClick={() => void updateItem(() => updateQuantity(item.productId, item.quantity + 1))}
                            className="w-8 h-8 rounded-full border border-[#E5B4B4] flex items-center justify-center text-[#E5B4B4] disabled:opacity-40"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          type="button"
                          aria-label={`Remove ${item.name} from cart`}
                          onClick={() => void updateItem(() => removeFromCart(item.productId))}
                          className="text-[#E5B4B4]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="font-['Cormorant'] text-xl text-[#4A3F3F] font-light">
                      {formatMoney(item.priceCents * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-br from-[#FFF5F7] to-[#FFE4E6] rounded-[25px] p-8 shadow-lg h-fit sticky top-24">
                <h3 className="font-['Cormorant'] text-2xl text-[#4A3F3F] font-light mb-6">Order Summary</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="font-['Inter'] text-[#8B7373]">Subtotal</span>
                    <span className="font-['Inter'] text-[#4A3F3F]">{formatMoney(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-['Inter'] text-[#8B7373]">Shipping</span>
                    <span className="font-['Inter'] text-[#4A3F3F]">{shipping === 0 ? 'Free' : formatMoney(shipping)}</span>
                  </div>
                </div>
                <div className="flex justify-between mb-6">
                  <span className="font-['Cormorant'] text-xl">Total</span>
                  <span className="font-['Cormorant'] text-xl">{formatMoney(total)}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate(user ? '/checkout' : '/login?next=/checkout')}
                  className="w-full bg-[#E5B4B4] text-white py-4 rounded-full font-['Inter'] text-sm tracking-wider hover:bg-[#D4A5A5] mb-4"
                >
                  Proceed to Checkout
                </motion.button>
                {!user && (
                  <p className="text-center font-['Inter'] text-xs text-[#8B7373]">
                    Sign in is required to complete your order.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <div className="h-20"></div>
    </div>
  );
}
