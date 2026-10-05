import { FormEvent, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Lock, Mail, User } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { ApiError } from '../lib/api';

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get('next') || '/account';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await register(name, email, password);
      navigate(next.startsWith('/') ? next : '/account');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not create account');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#FFE4E6]/30">
        <div className="container mx-auto px-8 max-w-7xl flex items-center h-20">
          <Link to="/login" className="flex items-center gap-3 text-[#4A3F3F] mr-6">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-['Inter'] text-sm">Back to Sign In</span>
          </Link>
          <Link to="/" className="font-['Cormorant'] text-3xl font-light text-[#4A3F3F]">
            deedaa
          </Link>
        </div>
      </header>
      <main className="pt-28">
        <div className="container mx-auto px-8 max-w-md">
          <h1 className="font-['Cormorant'] text-5xl font-light text-[#4A3F3F] text-center mb-8">Create Account</h1>
          <div className="bg-gradient-to-br from-[#FFF5F7] to-[#FFE4E6] rounded-[25px] p-8 shadow-lg">
            <form className="space-y-5" onSubmit={onSubmit}>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B7373]" />
                <input
                  required
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-full border border-[#E5B4B4]/30 bg-white"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B7373]" />
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-full border border-[#E5B4B4]/30 bg-white"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B7373]" />
                <input
                  type="password"
                  required
                  minLength={8}
                  placeholder="Password (letter + number)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-full border border-[#E5B4B4]/30 bg-white"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <motion.button
                whileHover={{ scale: 1.02 }}
                disabled={busy}
                className="w-full bg-[#E5B4B4] text-white py-4 rounded-full"
              >
                {busy ? 'Creating...' : 'Sign Up'}
              </motion.button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
