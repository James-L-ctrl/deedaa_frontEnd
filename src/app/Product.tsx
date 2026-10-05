import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { StoreHeader } from './components/StoreHeader';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { ApiError, api } from '../lib/api';
import { formatMoney, type Product } from '../lib/types';
import { useCart } from './contexts/CartContext';

export default function ProductPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!slug) return;

    let active = true;
    setLoading(true);
    setError('');
    setProduct(null);
    api
      .get<Product>(`/api/products/${slug}`)
      .then((data) => {
        if (active) setProduct(data);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof ApiError && err.status === 404
              ? 'Product not found'
              : 'We could not load this product. Please try again.',
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading || error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <StoreHeader backTo="/shop" backLabel="Back to Shop" />
        <main className="pt-32 text-center">
          <p className="font-['Inter'] text-[#8B7373]" role={error ? 'alert' : 'status'}>
            {error || 'Loading product...'}
          </p>
          {error && (
            <Link to="/shop" className="inline-block mt-6 text-[#D4A5A5] underline underline-offset-4">
              Return to the shop
            </Link>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <StoreHeader backTo="/shop" backLabel="Back to Shop" />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-8 md:px-16 lg:px-20 max-w-7xl grid lg:grid-cols-2 gap-12">
          <div className="aspect-square rounded-[30px] overflow-hidden bg-gradient-to-br from-[#FFF5F7] to-[#FFE4E6] shadow-lg">
            <ImageWithFallback src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div>
            {product.badge && (
              <span className="inline-block mb-4 font-['Inter'] text-xs uppercase tracking-[0.3em] text-[#D4A5A5]">
                {product.badge}
              </span>
            )}
            <h1 className="font-['Cormorant'] text-5xl font-light text-[#4A3F3F] mb-4">{product.name}</h1>
            <p className="font-['Cormorant'] text-3xl text-[#D4A5A5] mb-6">{formatMoney(product.priceCents)}</p>
            <p className="font-['Inter'] text-[#8B7373] text-lg leading-relaxed mb-8">{product.description}</p>
            <p className="font-['Inter'] text-sm text-[#8B7373] mb-8">
              {product.isPreorder
                ? 'Available for pre-order'
                : product.stock > 0
                  ? `${product.stock} in stock`
                  : 'Sold out'}
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={busy || (!product.isPreorder && product.stock < 1)}
              onClick={async () => {
                setBusy(true);
                setError('');
                setMessage('');
                try {
                  await addToCart(product);
                  setMessage('Added to cart');
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Could not add this item to your cart.');
                } finally {
                  setBusy(false);
                }
              }}
              className="bg-[#E5B4B4] text-white px-10 py-4 rounded-full font-['Inter'] text-sm tracking-wider hover:bg-[#D4A5A5] disabled:opacity-50"
            >
              {busy ? 'Adding...' : product.isPreorder ? 'Pre-order' : 'Add to Cart'}
            </motion.button>
            {message && <p role="status" className="mt-4 font-['Inter'] text-[#D4A5A5] text-sm">{message}</p>}
            {error && <p role="alert" className="mt-4 font-['Inter'] text-red-600 text-sm">{error}</p>}
            <Link to="/cart" className="block mt-6 font-['Inter'] text-sm text-[#8B7373] hover:text-[#D4A5A5]">
              View cart
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
