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
  });

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
      const order = await api.post<{ id: string }>('/api/orders', form);
      await refresh();
      navigate(`/account?placed=${order.id}`);
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
          <form onSubmit={onSubmit} className="space-y-4">
            <h1 className="font-['Cormorant'] text-4xl font-light text-[#4A3F3F] mb-6">Checkout</h1>
            {(['shippingName', 'shippingAddress', 'shippingCity', 'shippingPostalCode', 'shippingCountry'] as const).map(
              (field) => (
                <input
                  key={field}
                  required
                  placeholder={field.replace('shipping', '').replace(/([A-Z])/g, ' $1')}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="w-full px-5 py-3 rounded-full border border-[#E5B4B4]/30"
                />
              ),
            )}
            {error && <p className="text-sm text-red-600">{error}</p>}
            <motion.button
              disabled={busy || cartLoading || items.length === 0}
              className="w-full bg-[#E5B4B4] text-white py-4 rounded-full"
            >
              {busy ? 'Placing order...' : `Pay ${formatMoney(subtotal + shipping)}`}
            </motion.button>
            <p className="text-xs text-[#8B7373]">
              This demo captures a paid order without a live payment processor. Totals are calculated on the server.
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
