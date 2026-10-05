import { motion } from 'motion/react';
import { useState } from 'react';
import { api, ApiError } from '../../lib/api';

export function EmailSignup() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await api.post('/api/newsletter', { email });
      setMessage('Thank you for subscribing.');
      setEmail('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not subscribe');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="py-28 bg-gradient-to-br from-[#F4C2C2] via-[#E5B4B4] to-[#D4A5A5] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-white rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-white rounded-full blur-[120px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-6 lg:px-20 relative z-10"
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-['Cormorant'] text-5xl md:text-6xl font-light text-white mb-6">
            Join the deedaa Community
          </h2>
          <p className="font-['Inter'] text-white/90 text-lg mb-10 font-light leading-relaxed">
            Be the first to know about new launches, exclusive offers, and beauty tips. Plus, get 15% off your first order.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-6 py-4 rounded-full font-['Inter'] text-[#4A3F3F] placeholder:text-[#8B7373]/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={busy}
              className="bg-white text-[#D4A5A5] hover:bg-white/95 px-10 py-4 rounded-full font-['Inter'] tracking-wider transition-all duration-300 shadow-xl hover:shadow-2xl whitespace-nowrap"
            >
              {busy ? 'Saving...' : 'Subscribe'}
            </motion.button>
          </form>
          {message && <p className="mt-6 font-['Inter'] text-white text-sm">{message}</p>}
          {error && <p className="mt-6 font-['Inter'] text-white text-sm">{error}</p>}
          <p className="font-['Inter'] text-white/70 text-sm mt-6">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
