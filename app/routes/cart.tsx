import { useState } from "react";
import { useLoaderData, useNavigate, Link, Form, useActionData } from "react-router";
import { cartApi, formatPrice } from "../lib/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { QuantitySelector } from "../components/ui/quantity-selector";
import { Separator } from "../components/ui/separator";
import { useAuth } from "../lib/auth-context";

const FREE_SHIPPING_THRESHOLD_CENTS = 5000;
const SHIPPING_CENTS = 500;

export async function loader() {
  const cart = await cartApi.get();
  return { cart };
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const action = formData.get("action");
  const productId = formData.get("productId") as string;

  if (action === "update" && productId) {
    const quantity = parseInt(formData.get("quantity") as string, 10);
    await cartApi.updateItem(productId, { quantity });
    return { success: true };
  }

  if (action === "remove" && productId) {
    await cartApi.removeItem(productId);
    return { success: true };
  }

  if (action === "clear") {
    await cartApi.clear();
    return { success: true };
  }

  return { success: false };
}

export default function Cart() {
  const { cart } = useLoaderData() as { cart: any[] };
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const actionData = useActionData() as { success: boolean } | undefined;
  const [updating, setUpdating] = useState<string | null>(null);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full mx-4 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sign in to view your cart</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">You need to be logged in to manage your cart and checkout.</p>
            <Link
              to="/auth/login"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a1 1 0 01-1 1H6a1 1 0 01-1-1v-1a1 1 0 011-1h14a1 1 0 011 1z" />
              </svg>
              Sign In
            </Link>
            <Link
              to="/"
              className="block mt-4 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotalCents = cart.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
  const shippingCents = subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_CENTS;
  const totalCents = subtotalCents + shippingCents;
  const freeShippingProgress = Math.min(100, (subtotalCents / FREE_SHIPPING_THRESHOLD_CENTS) * 100);

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 0) return;
    setUpdating(productId);
    const form = document.createElement("form");
    form.method = "POST";
    form.innerHTML = `
      <input type="hidden" name="action" value="update" />
      <input type="hidden" name="productId" value="${productId}" />
      <input type="hidden" name="quantity" value="${quantity}" />
    `;
    document.body.appendChild(form);
    form.submit();
  };

  const handleRemove = (productId: string) => {
    if (confirm("Remove this item from your cart?")) {
      const form = document.createElement("form");
      form.method = "POST";
      form.innerHTML = `
        <input type="hidden" name="action" value="remove" />
        <input type="hidden" name="productId" value="${productId}" />
      `;
      document.body.appendChild(form);
      form.submit();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white">DeeaWeb</Link>
            </div>
            <nav className="flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Home</Link>
              <Link to="/shop" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Shop</Link>
              <Link to="/auth/login" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">Admin Login</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Shopping Cart</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{cart.length} item{cart.length !== 1 ? "s" : ""} in your cart</p>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Your cart is empty</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Looks like you haven't added any products yet.</p>
            <Link
              to="/shop"
              className="inline-flex items-center px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <Form method="post">
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quantity</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {cart.map((item) => (
                          <tr key={item.productId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="px-4 py-4">
                              <div className="flex items-center">
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div className="ml-4">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.slug}</p>
                                  {item.isPreorder && (
                                    <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 mt-1">Pre-order</span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900 dark:text-white font-medium">
                              {formatPrice(item.priceCents)}
                            </td>
                            <td className="px-4 py-4">
                              <QuantitySelector
                                value={item.quantity}
                                onChange={(qty) => handleUpdateQuantity(item.productId, qty)}
                                min={1}
                                max={item.stock}
                                disabled={updating === item.productId || item.isPreorder}
                                className="w-24"
                              />
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900 dark:text-white font-medium">
                              {formatPrice(item.priceCents * item.quantity)}
                            </td>
                            <td className="px-4 py-4 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemove(item.productId)}
                                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                                disabled={updating === item.productId}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {cart.length > 0 && (
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("Clear entire cart?")) {
                            const form = document.createElement("form");
                            form.method = "POST";
                            form.innerHTML = `<input type="hidden" name="action" value="clear" />`;
                            document.body.appendChild(form);
                            form.submit();
                          }
                        }}
                        className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        Clear Cart
                      </button>
                      <Link
                        to="/shop"
                        className="text-sm font-medium text-pink-600 hover:text-pink-700 dark:text-pink-400"
                      >
                        Continue Shopping →
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1 mt-8 lg:mt-0">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                      <span className="font-medium text-gray-900 dark:text-white">{formatPrice(subtotalCents)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {shippingCents === 0 ? (
                          <span className="text-green-600 dark:text-green-400">Free</span>
                        ) : (
                          formatPrice(shippingCents)
                        )}
                      </span>
                    </div>
                  </div>

                  {subtotalCents < FREE_SHIPPING_THRESHOLD_CENTS && (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        Add {formatPrice(FREE_SHIPPING_THRESHOLD_CENTS - subtotalCents)} more for free shipping!
                      </p>
                      <div className="mt-2 h-2 bg-blue-100 dark:bg-blue-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 transition-all duration-300"
                          style={{ width: `${freeShippingProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <Separator className="border-gray-200 dark:border-gray-700 mb-4" />

                  <div className="flex justify-between text-lg font-bold mb-6">
                    <span className="text-gray-900 dark:text-white">Total</span>
                    <span className="text-pink-600 dark:text-pink-400">{formatPrice(totalCents)}</span>
                  </div>

                  <Link
                    to="/checkout"
                    className="block w-full text-center py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </div>
          </Form>
        )}

        {actionData?.success && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
            Cart updated
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">DeeaWeb</h3>
              <p className="text-gray-600 dark:text-gray-400">Premium beauty products crafted with care. Your skin deserves the best.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Quick Links</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><Link to="/" className="hover:text-pink-600 dark:hover:text-pink-400">Home</Link></li>
                <li><Link to="/shop" className="hover:text-pink-600 dark:hover:text-pink-400">Shop</Link></li>
                <li><Link to="/auth/login" className="hover:text-pink-600 dark:hover:text-pink-400">Admin</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Categories</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>Lips</li>
                <li>Cheeks</li>
                <li>Skincare</li>
                <li>Body</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Contact</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>hello@deedaa.com</li>
                <li>123 Beauty Lane</li>
                <li>New York, NY 10001</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400">
            <p>&copy; 2024 DeeaWeb. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}