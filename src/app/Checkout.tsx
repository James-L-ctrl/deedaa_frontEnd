import { FormEvent, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { StoreHeader } from './components/StoreHeader';
import { useAuth } from './contexts/AuthContext';
import { useCart } from './contexts/CartContext';
import { api, ApiError } from '../lib/api';
import { formatMoney } from '../lib/types';

export default function Checkout() {
  const { user, loading } = useAuth();
  const { items, loading: cartLoading, refresh } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    shippingName: user?.name ?? '',
    shippingAddress: '',
    shippingCity: '',
    shippingPostalCode: '',
    shippingCountry: 'Philippines',
    paymentMethod: 'GCASH', // Default to GCash
  });
  const [paymentMethods] = useState([
    { id: 'GCASH', label: 'GCash', icon: '💳' },
    { id: 'COD', label: 'Cash on Delivery', icon: '💵' },
  ]);

  useEffect(() => {
    if (user) {
      setForm((current) => ({
        ...current,
        shippingName: current.shippingName || user.name,
      }));
    }
  }, [user]);

  if (!loading && !user) {
    return <Navigate to="/login?next=/checkout" replace />;
  }

  if (!cartLoading && items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <StoreHeader backTo="/shop" backLabel="Back to Shop" />
        <main className="pt-32 text-center">
          <h1 className="font-['Cormorant'] text-4xl text-[#4A3F3F] mb-4">Your cart is empty</h1>
          <p className="font-['Inter'] text-[#8B7373] mb-6">Add something lovely before checking out.</p>
          <Link to="/shop" className="text-[#D4A5A5] underline underline-offset-4">
            Browse the collection
          </Link>
        </main>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
  const shipping = subtotal >= 5000 ? 0 : 500;

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const order = await api.post<{ id: string }>('/api/orders', {
        ...form,
        paymentMethod: form.paymentMethod,
      });
      await refresh();

      // For COD, show confirmation page; for GCash, redirect to payment processing
      if (form.paymentMethod === 'COD') {
        navigate(`/account?placed=${order.id}&paymentMethod=COD`);
      } else {
        // In a real app, you'd redirect to GCash payment gateway here
        // For now, we'll simulate and then mark as completed
        navigate(`/account?placed=${order.id}&paymentMethod=GCASH`);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Checkout failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <StoreHeader backTo="/cart" backLabel="Back to Cart" />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-8 max-w-5xl grid lg:grid-cols-2 gap-12">
          <form onSubmit={onSubmit} className="space-y-6">
            <h1 className="font-['Cormorant'] text-4xl font-light text-[#4A3F3F] mb-6">Checkout</h1>

            {/* Shipping Information */}
            <div className="space-y-4">
              {(['shippingName', 'shippingAddress', 'shippingCity', 'shippingPostalCode', 'shippingCountry'] as const).map(
                (field) => (
                  <div key={field} className="space-y-2">
                    <label className="block text-sm font-medium text-[#4A3F3F] mb-1">
                      {field.replace('shipping', '').replace(/([A-Z])/g, ' $1')}
                    </label>
                    <input
                      required
                      placeholder={field.replace('shipping', '').replace(/([A-Z])/g, ' $1')}
                      value={form[field]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      className="w-full px-5 py-3 rounded-full border border-[#E5B4B4]/30 focus:border-[#D4A5A5] focus:ring-2 focus:ring-[#D4A5A5]/20"
                    />
                  </div>
                ),
              )}
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-[#4A3F3F] mb-1">
                Payment Method
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                {paymentMethods.map((method) => (
                  <label key={method.id} className="flex items-center space-x-3 p-4 border rounded-full border-[#E5B4B4]/30 hover:border-[#D4A5A5]/20 transition-all cursor-pointer"
                    onClick={() => setForm({ ...form, paymentMethod: method.id })}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{method.icon}</span>
                        <span className="font-medium text-[#4A3F3F]">{method.label}</span>
                      </div>
                      {form.paymentMethod === method.id && (
                        <span className="ml-auto h-4 w-4 bg-[#E5B4B4] rounded-full"></span>
                      )}
                    </div>
                    <input
                      type="radio"
                      value={method.id}
                      checked={form.paymentMethod === method.id}
                      onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                      className="hidden"
                    />
                  </label>
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <motion.button
              disabled={busy || cartLoading || items.length === 0}
              className="w-full bg-[#E5B4B4] text-white py-4 rounded-full hover:bg-[#D4A5A5] transition-colors"
            >
              {busy ? 'Processing...' : `Pay ${formatMoney(subtotal + shipping)}`}
            </motion.button>

            <p className="text-xs text-[#8B7373] mt-2">
              Select your preferred payment method. GCash payments are processed instantly,
              while Cash on Delivery orders are confirmed upon delivery.
            </p>
          </form>

          <div className="bg-[#FFF5F7] rounded-[25px] p-8 h-fit">
            <h2 className="font-['Cormorant'] text-2xl mb-4">Your items</h2>
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between py-2 text-sm">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{formatMoney(item.priceCents * item.quantity)}</span>
              </div>
            ))}
            <div className="mt-4 border-t border-[#E5B4B4]/30 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatMoney(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : formatMoney(shipping)}</span>
              </div>
              <div className="flex justify-between font-medium text-[#4A3F3F]">
                <span>Total</span>
                <span>{formatMoney(subtotal + shipping)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
