import { useState } from "react";
import { useLoaderData, useNavigation, Link, Form, redirect, useActionData } from "react-router";
import { cartApi, ordersApi, formatPrice, CheckoutDto } from "../lib/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
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

  const paymentMethod = formData.get("paymentMethod") as 'COD' | 'GCASH';
  if (paymentMethod !== "COD" && paymentMethod !== "GCASH") {
    return { error: "Please select a payment method" };
  }

  const dto: CheckoutDto = {
    shippingName: (formData.get("shippingName") as string) || "",
    shippingAddress: (formData.get("shippingAddress") as string) || "",
    shippingCity: (formData.get("shippingCity") as string) || "",
    shippingPostalCode: (formData.get("shippingPostalCode") as string) || "",
    shippingCountry: (formData.get("shippingCountry") as string) || "",
    paymentMethod,
  };

  try {
    const order = await ordersApi.checkout(dto);
    return redirect(`/orders/${order.id}`);
  } catch (err: any) {
    return { error: err.message || "Checkout failed. Please try again." };
  }
}

export default function Checkout() {
  const { cart } = useLoaderData() as { cart: any[] };
  const { user, loading: authLoading } = useAuth();
  const actionData = useActionData() as { error?: string } | undefined;
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'GCASH'>("COD");
  const navigation = useNavigation();
  const submitting = navigation.state === "submitting";

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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sign in to checkout</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">You need to be logged in to complete your order.</p>
            <Link
              to="/auth/login"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full mx-4 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Add some products before checking out.</p>
            <Link
              to="/shop"
              className="inline-flex items-center px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotalCents = cart.reduce((sum: number, item: any) => sum + item.priceCents * item.quantity, 0);
  const shippingCents = subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_CENTS;
  const totalCents = subtotalCents + shippingCents;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white">DeeaWeb</Link>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Secure Checkout</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Checkout</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Complete your order details</p>
        </div>

        {actionData?.error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
            {actionData.error}
          </div>
        )}

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Checkout Form */}
          <Form method="post" className="lg:col-span-2 space-y-8">
            {/* Shipping Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-600 text-white text-sm font-bold">1</span>
                Shipping Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="shippingName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name *
                  </Label>
                  <Input
                    id="shippingName"
                    name="shippingName"
                    required
                    placeholder="Jane Doe"
                    defaultValue={user.name}
                    maxLength={80}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Street Address *
                  </Label>
                  <Textarea
                    id="shippingAddress"
                    name="shippingAddress"
                    required
                    placeholder="123 Beauty Lane, Apt 4B"
                    maxLength={200}
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="shippingCity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    City *
                  </Label>
                  <Input
                    id="shippingCity"
                    name="shippingCity"
                    required
                    placeholder="New York"
                    maxLength={80}
                  />
                </div>

                <div>
                  <Label htmlFor="shippingPostalCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Postal Code *
                  </Label>
                  <Input
                    id="shippingPostalCode"
                    name="shippingPostalCode"
                    required
                    placeholder="10001"
                    maxLength={20}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="shippingCountry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Country *
                  </Label>
                  <Input
                    id="shippingCountry"
                    name="shippingCountry"
                    required
                    placeholder="United States"
                    maxLength={80}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-600 text-white text-sm font-bold">2</span>
                Payment Method
              </h2>

              <div className="space-y-3">
                <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === "COD"
                    ? "border-pink-600 bg-pink-50 dark:bg-pink-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="w-5 h-5 text-pink-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="font-medium text-gray-900 dark:text-white">Cash on Delivery</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pay when your order is delivered</p>
                  </div>
                </label>

                <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === "GCASH"
                    ? "border-pink-600 bg-pink-50 dark:bg-pink-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="GCASH"
                    checked={paymentMethod === "GCASH"}
                    onChange={() => setPaymentMethod("GCASH")}
                    className="w-5 h-5 text-pink-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" />
                      </svg>
                      <span className="font-medium text-gray-900 dark:text-white">GCash</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pay via GCash e-wallet (reference ID sent by email)</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/cart"
                className="flex-1 text-center py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-gray-700 dark:text-gray-300"
              >
                ← Back to Cart
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Placing Order..." : `Place Order — ${formatPrice(totalCents)}`}
              </button>
            </div>
          </Form>

          {/* Order Summary */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.map((item: any) => (
                  <div key={item.productId} className="flex items-center gap-3">
                    <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatPrice(item.priceCents * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="border-gray-200 dark:border-gray-700 mb-4" />

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

              <Separator className="border-gray-200 dark:border-gray-700 mb-4" />

              <div className="flex justify-between text-lg font-bold">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-pink-600 dark:text-pink-400">{formatPrice(totalCents)}</span>
              </div>

              <div className="mt-6 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-xs text-green-800 dark:text-green-200 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Secure checkout. Your data is protected.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}