import { Link } from "react-router";
import { productsApi, formatPrice } from "../lib/api";
import { useLoaderData } from "react-router";

export async function loader() {
  const featured = await productsApi.list({ featured: true, limit: 4 });
  const bestsellers = await productsApi.list({ bestseller: true, limit: 8 });
  return { featured, bestsellers };
}

export default function Home() {
  const { featured, bestsellers } = useLoaderData() as { featured: any[]; bestsellers: any[] };

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
              <Link
                to="/auth/login"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Admin Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Beauty That <span className="text-pink-600 dark:text-pink-400">Blooms</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
                Discover premium skincare and cosmetics crafted with nature's finest ingredients.
                Radiant skin starts here.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link
                  to="/shop"
                  className="px-8 py-3 text-lg font-medium text-white bg-pink-600 rounded-full hover:bg-pink-700 transition-colors"
                >
                  Shop Now
                </Link>
                <Link
                  to="/auth/login"
                  className="px-8 py-3 text-lg font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
                >
                  Admin Panel
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        {featured.length > 0 && (
          <section className="py-16 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Products</h2>
                <Link to="/shop" className="text-pink-600 hover:text-pink-700 dark:text-pink-400 font-medium">
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featured.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Bestsellers */}
        {bestsellers.length > 0 && (
          <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Bestsellers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {bestsellers.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-16 bg-pink-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Glow?</h2>
            <p className="text-pink-100 mb-8 max-w-xl mx-auto">
              Join thousands of happy customers who've discovered their perfect beauty routine with DeeaWeb.
            </p>
            <Link
              to="/shop"
              className="inline-block px-8 py-3 text-lg font-medium text-pink-600 bg-white rounded-full hover:bg-pink-50 transition-colors"
            >
              Shop Collection
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">DeeaWeb</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Premium beauty products crafted with care. Your skin deserves the best.
              </p>
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

function ProductCard({ product }: { product: any }) {
  return (
    <Link to={`/product/${product.slug}`} className="group block bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square relative overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {(product.featured || product.bestseller || product.badge) && (
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.featured && (
              <span className="px-2 py-1 text-xs font-medium bg-purple-600 text-white rounded">Featured</span>
            )}
            {product.bestseller && (
              <span className="px-2 py-1 text-xs font-medium bg-orange-500 text-white rounded">Bestseller</span>
            )}
            {product.badge && (
              <span className="px-2 py-1 text-xs font-medium bg-gray-800 text-white rounded">{product.badge}</span>
            )}
            {product.isPreorder && (
              <span className="px-2 py-1 text-xs font-medium bg-yellow-500 text-white rounded">Pre-order</span>
            )}
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
          {product.category}
        </p>
        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors mb-2">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900 dark:text-white">{formatPrice(product.priceCents)}</span>
          {product.stock === 0 && (
            <span className="text-xs text-red-500">Out of Stock</span>
          )}
        </div>
      </div>
    </Link>
  );
}