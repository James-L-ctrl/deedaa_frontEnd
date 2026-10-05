import { useEffect, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { StoreHeader } from './components/StoreHeader';
import { useAuth } from './contexts/AuthContext';
import { api } from '../lib/api';
import { formatMoney, type Order } from '../lib/types';

export default function Account() {
  const { user, loading, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');
  const [params] = useSearchParams();
  const placed = params.get('placed');

  useEffect(() => {
    if (!user) return;

    let active = true;
    setOrdersLoading(true);
    setOrdersError('');
    api
      .get<Order[]>('/api/orders')
      .then((data) => {
        if (active) setOrders(data);
      })
      .catch((err: unknown) => {
        if (active) {
          setOrdersError(err instanceof Error ? err.message : 'Could not load your orders.');
        }
      })
      .finally(() => {
        if (active) setOrdersLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user]);

  if (!loading && !user) {
    return <Navigate to="/login?next=/account" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <StoreHeader backTo="/" backLabel="Home" />
        <main className="pt-32 text-center font-['Inter'] text-[#8B7373]" role="status">
          Loading your account...
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <StoreHeader backTo="/" backLabel="Home" />
      <main className="pt-28 pb-20 container mx-auto px-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-['Cormorant'] text-4xl font-light text-[#4A3F3F]">Hello, {user?.name}</h1>
            <p className="font-['Inter'] text-[#8B7373]">{user?.email}</p>
          </div>
          <button onClick={() => logout()} className="text-sm text-[#D4A5A5]">
            Sign out
          </button>
        </div>
        {placed && (
          <p className="mb-6 bg-[#FFF5F7] rounded-2xl p-4 text-[#4A3F3F]">
            Order placed. Thank you — we saved it to your account.
          </p>
        )}
        <h2 className="font-['Cormorant'] text-3xl mb-4">Orders</h2>
        {ordersLoading ? (
          <p className="text-[#8B7373]" role="status">Loading your orders...</p>
        ) : ordersError ? (
          <p role="alert" className="text-red-600">{ordersError}</p>
        ) : orders.length === 0 ? (
          <p className="text-[#8B7373]">
            No orders yet. <Link to="/shop" className="text-[#D4A5A5]">Shop the collection</Link>
          </p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border border-[#FFE4E6] rounded-2xl p-5">
                <div className="flex justify-between mb-3">
                  <span className="text-sm text-[#8B7373]">{new Date(order.createdAt).toLocaleString()}</span>
                  <span className="font-['Cormorant'] text-xl">{formatMoney(order.totalCents)}</span>
                </div>
                {order.items.map((item) => (
                  <p key={item.id} className="text-sm text-[#4A3F3F]">
                    {item.name} × {item.quantity}
                  </p>
                ))}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
