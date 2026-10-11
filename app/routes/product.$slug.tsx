import { useState } from "react";
import { useLoaderData, useNavigate, Link, Form } from "react-router";
import { productsApi, cartApi, formatPrice } from "../lib/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { QuantitySelector } from "../components/ui/quantity-selector";
import { Separator } from "../components/ui/separator";
import { StarRating } from "../components/ui/star-rating";
import { Badge } from "../components/ui/badge";
import { useAuth } from "../lib/auth-context";

export async function loader({ params }: { params: { slug: string } }) {
  const product = await productsApi.getBySlug(params.slug!);
  return { product };
}

export default function ProductDetail() {
  const { product } = useLoaderData() as { product: any };
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/auth/login");
      return;
    }
    setAdding(true);
    try {
      await cartApi.addItem({ productId: product.id, quantity });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err: any) {
      alert(err.message || "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/auth/login");
      return;
    }
    setAdding(true);
    try {
      await cartApi.addItem({ productId: product.id, quantity });
      navigate("/checkout");
    } catch (err: any) {
      alert(err.message || "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

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
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <li><Link to="/" className="hover:text-pink-600 dark:hover:text-pink-400">Home</Link></li>
            <li className="flex items-center"><span>/</span></li>
            <li><Link to="/shop" className="hover:text-pink-600 dark:hover:text-pink-400">Shop</Link></li>
            <li className="flex items-center"><span>/</span></li>
            <li className="text-gray-900 dark:text-white font-medium" aria-current="page">{product.name}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.stock === 0 && (
              <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-center">
                Out of Stock
              </div>
            )}
            {product.isPreorder && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg text-yellow-700 dark:text-yellow-300 text-center">
                Pre-order item — ships when available
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                {product.category}
              </p>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">{product.name}</h1>

              <div className="flex items-center gap-4 mb-4">
                <StarRating rating={product.rating || 5} maxRating={5} size="md" showValue />
              </div>

              <div className="flex items-center gap-3 flex-wrap mb-4">
                {product.featured && <Badge variant="info">Featured</Badge>}
                {product.bestseller && <Badge variant="warning">Bestseller</Badge>}
                {product.badge && <Badge variant="secondary">{product.badge}</Badge>}
                {product.isPreorder && <Badge variant="warning">Pre-order</Badge>}
              </div>

              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatPrice(product.priceCents)}
              </div>
            </div>

            <Separator className="border-gray-200 dark:border-gray-700" />

            <div className="prose max-w-none text-gray-700 dark:text-gray-300">
              <p className="whitespace-pre-wrap">{product.description}</p>
            </div>

            <Separator className="border-gray-200 dark:border-gray-700" />

            {/* Add to Cart Form */}
            <Form onSubmit={handleAddToCart} className="space-y-4">
              <div>
                <Label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quantity
                </Label>
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  max={product.stock}
                  disabled={product.stock === 0 && !product.isPreorder}
                  className="w-32"
                />
                {!product.isPreorder && product.stock > 0 && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {product.stock} in stock
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  className="flex-1 py-3 text-lg"
                  disabled={adding || (product.stock === 0 && !product.isPreorder)}
                >
                  {adding ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Adding...
                    </span>
                  ) : added ? (
                    <span className="flex items-center justify-center gap-2 text-green-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Added to Cart!
                    </span>
                  ) : (
                    "Add to Cart"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1 py-3 text-lg"
                  onClick={handleBuyNow}
                  disabled={adding || (product.stock === 0 && !product.isPreorder)}
                >
                  Buy Now
                </Button>
              </div>
            </Form>

            {/* Product Details */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Product Details</h3>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">Category</dt>
                  <dd className="font-medium text-gray-900 dark:text-white capitalize">{product.category}</dd>
                </div>
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">Stock</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">
                    {product.isPreorder ? "Pre-order" : product.stock === 0 ? "Out of Stock" : `${product.stock} available`}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">Rating</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">{product.rating || 5}/5</dd>
                </div>
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">SKU</dt>
                  <dd className="font-medium text-gray-900 dark:text-white font-mono">{product.slug}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
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
    </div>
  );
}