import { FormEvent, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Lock, Mail } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { ApiError } from '../lib/api';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get('next') || '/account';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(email, password);
      navigate(next.startsWith('/') ? next : '/account');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not sign in');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#FFE4E6]/30">
        <div className="container mx-auto px-8 md:px-16 lg:px-20 max-w-7xl">
          <div className="flex items-center h-20">
            <Link to="/" className="flex items-center gap-3 text-[#4A3F3F] hover:text-[#D4A5A5] mr-6">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-['Inter'] text-sm tracking-wide">Back to Home</span>
            </Link>
            <Link to="/" className="font-['Cormorant'] text-3xl font-light text-[#4A3F3F]">
              deedaa
            </Link>
          </div>
        </div>
      </header>
      <main className="pt-20">
        <div className="container mx-auto px-8 max-w-md">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-['Cormorant'] text-5xl font-light text-[#4A3F3F] mb-4">Welcome Back</h1>
            <p className="font-['Inter'] text-[#8B7373]">Sign in to access your account</p>
          </motion.div>
          <div className="bg-gradient-to-br from-[#FFF5F7] to-[#FFE4E6] rounded-[25px] p-8 shadow-lg">
            <form className="space-y-6" onSubmit={onSubmit}>
              <div>
                <label className="block font-['Inter'] text-[#4A3F3F] text-sm mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B7373]" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-full border border-[#E5B4B4]/30 bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block font-['Inter'] text-[#4A3F3F] text-sm mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B7373]" />
                  <input
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-full border border-[#E5B4B4]/30 bg-white"
                  />
                </div>
              </div>
              {error && <p className="font-['Inter'] text-sm text-red-600">{error}</p>}
              <motion.button
                whileHover={{ scale: 1.02 }}
                disabled={busy}
                type="submit"
                className="w-full bg-[#E5B4B4] text-white py-4 rounded-full font-['Inter'] text-sm tracking-wider"
              >
                {busy ? 'Signing in...' : 'Sign In'}
              </motion.button>
              <p className="text-center font-['Inter'] text-[#8B7373] text-sm">
                Don't have an account?{' '}
                <Link to={`/signup?next=${encodeURIComponent(next)}`} className="text-[#D4A5A5]">
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
