import { useLoaderData, Link } from "react-router";
import { ordersApi, formatPrice } from "../lib/api";
import { Separator } from "../components/ui/separator";
import { useAuth } from "../lib/auth-context";

export async function loader({ params }: { params: { id: string } }) {
  const order = await ordersApi.get(params.id!);
  return { order };
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200" },
  PAID: { label: "Paid", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  COD_PENDING: { label: "Cash on Delivery — Pending", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" },
  COD_CONFIRMED: { label: "COD Confirmed", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  COD_DELIVERED: { label: "Delivered", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  COD_CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
  GCASH_PENDING: { label: "GCash Payment — Pending", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" },
  GCASH_COMPLETED: { label: "GCash Payment — Completed", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  GCASH_FAILED: { label: "GCash Payment — Failed", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
  GCASH_CANCELLED: { label: "GCash Payment — Cancelled", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
  REFUNDED: { label: "Refunded", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
  PARTIALLY_REFUNDED: { label: "Partially Refunded", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
};

export default function OrderConfirmation() {
  const { order } = useLoaderData() as { order: any };
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  const status = STATUS_LABELS[order.status] ?? STATUS_LABELS.PENDING;
  const isPaid = ["GCASH_COMPLETED", "PAID"].includes(order.status);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white">DeeaWeb</Link>
            <Link to="/shop" className="text-sm font-medium text-pink-600 hover:text-pink-700 dark:text-pink-400">Continue Shopping</Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success banner */}
        <div className="text-center mb-8">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${isPaid ? "bg-green-100 dark:bg-green-900/30" : "bg-pink-100 dark:bg-pink-900/30"}`}>
            <svg className={`w-10 h-10 ${isPaid ? "text-green-600 dark:text-green-400" : "text-pink-600 dark:text-pink-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Thank you for your order!</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {order.paymentMethod === "GCASH"
              ? "We've received your order. Complete your GCash payment to confirm it."
              : "We've received your order and will process it shortly."}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Order header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Order Number</p>
                <p className="text-lg font-mono font-semibold text-gray-900 dark:text-white">#{order.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <span className={`inline-flex self-start px-3 py-1 text-sm font-semibold rounded-full ${status.color}`}>
                {status.label}
              </span>
            </div>
            {isPaid && (
              <p className="mt-3 text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Payment received
              </p>
            )}
          </div>

          {/* Items */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatPrice(item.unitPriceCents * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator className="border-gray-200 dark:border-gray-700" />

          {/* Totals */}
          <div className="p-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatPrice(order.subtotalCents)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Shipping</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {order.shippingCents === 0 ? <span className="text-green-600 dark:text-green-400">Free</span> : formatPrice(order.shippingCents)}
              </span>
            </div>
            <Separator className="border-gray-200 dark:border-gray-700 my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span className="text-gray-900 dark:text-white">Total</span>
              <span className="text-pink-600 dark:text-pink-400">{formatPrice(order.totalCents)}</span>
            </div>
          </div>

          <Separator className="border-gray-200 dark:border-gray-700" />

          {/* Shipping details */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Shipping To</h2>
            <address className="not-italic text-gray-700 dark:text-gray-300 leading-relaxed">
              <p className="font-medium text-gray-900 dark:text-white">{order.shippingName}</p>
              <p>{order.shippingAddress}</p>
              <p>{order.shippingCity}, {order.shippingPostalCode}</p>
              <p>{order.shippingCountry}</p>
            </address>
          </div>

          {/* Payment info */}
          <div className="p-6 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Payment Method</h2>
            <p className="text-gray-700 dark:text-gray-300">
              {order.paymentMethod === "GCASH" ? "GCash" : "Cash on Delivery"}
            </p>
            {order.gcashReferenceId && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Reference: <span className="font-mono">{order.gcashReferenceId}</span>
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/shop"
            className="text-center px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
          >
            Continue Shopping
          </Link>
          <Link
            to="/"
            className="text-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-gray-700 dark:text-gray-300"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}