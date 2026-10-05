import { motion } from 'motion/react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useCart } from './contexts/CartContext';
import { ApiError, api } from '../lib/api';
import { formatMoney, type Product } from '../lib/types';
import { StoreHeader } from './components/StoreHeader';

export default function Shop() {
  const { addToCart, totalItems } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;

    api
      .get<Product[]>('/api/products')
      .then((data) => {
        if (active) setProducts(data);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof ApiError ? err.message : 'We could not load the collection. Please try again.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [retryCount]);

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))].sort(),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLocaleLowerCase().includes(query) ||
        product.description.toLocaleLowerCase().includes(query);
      return matchesSearch && (!category || product.category === category);
    });
  }, [category, products, search]);

  return (
    <div className="min-h-screen bg-white">
      <StoreHeader backTo="/" backLabel="Home" />
      <main className="pt-20">
        <div className="container mx-auto px-8 md:px-16 lg:px-20 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="font-['Cormorant'] text-5xl md:text-6xl font-light text-[#4A3F3F] mb-4">
              Shop All
            </h1>
            <p className="font-['Inter'] text-[#8B7373] text-lg font-light">
              Discover our complete collection of clean beauty essentials
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search products"
              placeholder="Search products"
              className="flex-1 px-5 py-3 rounded-full border border-[#E5B4B4]/30 font-['Inter'] text-[#4A3F3F] focus:outline-none focus:border-[#E5B4B4]"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Filter by category"
              className="px-5 py-3 rounded-full border border-[#E5B4B4]/30 font-['Inter'] text-[#4A3F3F] bg-white"
            >
              <option value="">All categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div role="alert" className="text-center text-[#D4A5A5] mb-8">
              <p>{error}</p>
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setLoading(true);
                  setRetryCount((count) => count + 1);
                }}
                className="mt-3 underline underline-offset-4"
              >
                Try again
              </button>
            </div>
          )}

          {!error && loading && (
            <p className="py-20 text-center font-['Inter'] text-[#8B7373]" role="status">
              Loading the collection...
            </p>
          )}

          {!error && !loading && filteredProducts.length === 0 && (
            <div className="py-20 text-center">
              <p className="font-['Cormorant'] text-3xl text-[#4A3F3F] mb-3">No products found</p>
              <p className="font-['Inter'] text-[#8B7373] mb-6">Try a different search or category.</p>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setCategory('');
                }}
                className="text-[#D4A5A5] underline underline-offset-4"
              >
                Clear filters
              </button>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.05 }}
                className="group"
              >
                <Link to={`/shop/${product.slug}`} className="block">
                  <div className="relative aspect-square rounded-[25px] overflow-hidden bg-gradient-to-br from-[#FFF5F7] to-[#FFE4E6] mb-6 shadow-md group-hover:shadow-xl transition-all duration-500">
                    <ImageWithFallback
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {product.badge && (
                      <span className="absolute top-5 left-5 bg-white/90 px-4 py-1 rounded-full font-['Inter'] text-xs text-[#D4A5A5] uppercase tracking-wider">
                        {product.badge}
                      </span>
                    )}
                    <button
                      type="button"
                      disabled={busyId === product.id || (!product.isPreorder && product.stock < 1)}
                      onClick={async (event) => {
                        event.preventDefault();
                        setBusyId(product.id);
                        setError('');
                        try {
                          await addToCart(product);
                        } catch (err) {
                          setError(err instanceof ApiError ? err.message : 'Could not add this item to your cart.');
                        } finally {
                          setBusyId(null);
                        }
                      }}
                      className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-[#D4A5A5] px-8 py-3 rounded-full font-['Inter'] text-sm tracking-wider shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {busyId === product.id
                        ? 'Adding...'
                        : product.isPreorder || product.stock > 0
                          ? 'Quick Add'
                          : 'Sold out'}
                    </button>
                  </div>
                </Link>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-['Cormorant'] text-2xl text-[#4A3F3F] font-light">
                      {product.name}
                    </h3>
                    <span className="font-['Cormorant'] text-xl text-[#8B7373]">
                      {formatMoney(product.priceCents)}
                    </span>
                  </div>
                  <p className="font-['Inter'] text-[#8B7373] text-sm leading-relaxed">
                    {product.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(product.rating)].map((_, i) => (
                        <span key={i} className="text-[#D4A5A5] text-sm">★</span>
                      ))}
                    </div>
                    <span className="font-['Inter'] text-[#8B7373] text-sm">
                      {product.isPreorder
                        ? 'Pre-order'
                        : product.stock > 0
                          ? `${product.stock} in stock`
                          : 'Sold out'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <span className="sr-only" aria-live="polite">
            {totalItems} items in cart
          </span>
        </div>
      </main>
      <div className="h-20"></div>
    </div>
  );
}
