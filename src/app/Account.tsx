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
  const paymentMethod = params.get('paymentMethod');

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
          <div className="mb-6 bg-[#FFF5F7] rounded-2xl p-4">
            <p className="text-[#4A3F3F]">Order placed. Thank you — we saved it to your account.</p>
            {paymentMethod === 'GCASH' && (
              <p className="mt-2 text-sm text-[#6B7280]">
                Your GCash payment is being processed. You'll receive a confirmation shortly.
              </p>
            )}
            {paymentMethod === 'COD' && (
              <p className="mt-2 text-sm text-[#6B7280]">
                Please prepare the exact amount for our delivery personnel.
                Your order will be confirmed upon delivery.
              </p>
            )}
          </div>
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
            {orders.map((order) => {
              // Determine status text and color based on order status
              let statusText = 'Processing';
              let statusColor = '#6B7280'; // gray

              if (order.status === 'PAID' || order.status === 'GCASH_COMPLETED') {
                statusText = 'Paid';
                statusColor = '#10B981'; // green
              } else if (order.status === 'COD_PENDING') {
                statusText = 'COD - Pending Confirmation';
                statusColor = '#F59E0B'; // amber
              } else if (order.status === 'COD_CONFIRMED' || order.status === 'COD_DELIVERED') {
                statusText = 'COD - Confirmed';
                statusColor = '#10B981'; // green
              } else if (order.status === 'GCASH_PENDING') {
                statusText = 'GCash - Pending';
                statusColor = '#F59E0B'; // amber
              } else if (order.status === 'GCASH_FAILED' || order.status === 'GCASH_CANCELLED' || order.status === 'COD_CANCELLED') {
                statusText = 'Cancelled';
                statusColor = '#EF4444'; // red
              } else if (order.status === 'REFUNDED' || order.status === 'PARTIALLY_REFUNDED') {
                statusText = 'Refunded';
                statusColor = '#8B5CF6'; // violet
              }

              return (
                <div key={order.id} className="border border-[#FFE4E6] rounded-2xl p-5">
                  <div className="flex justify-between mb-3">
                    <span className="text-sm text-[#8B7373]">{new Date(order.createdAt).toLocaleString()}</span>
                    <span className="font-['Cormorant'] text-xl">{formatMoney(order.totalCents)}</span>
                  </div>

                  {/* Status badge */}
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: statusColor }} />
                    <span className="text-xs font-medium text-[{statusColor}]">{statusText}</span>
                  </div>

                  {/* Payment method */}
                  {order.paymentMethod && (
                    <div className="mb-2 text-sm text-[#6B7280]">
                      <span className="font-medium">Payment Method:</span>
                      {order.paymentMethod === 'GCASH' ? 'GCash' : 'Cash on Delivery'}
                    </div>
                  )}

                  {order.items.map((item) => (
                    <p key={item.id} className="text-sm text-[#4A3F3F]">
                      {item.name} × {item.quantity}
                    </p>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
