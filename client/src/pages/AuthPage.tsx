import React, { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { Mail, Lock, User as UserIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

interface AuthPageProps {
  setPage: (page: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ setPage }) => {
  const { setUser } = useCartStore();
  const [isLogin, setIsLogin] = useState(true);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        const res = await axios.post('/api/v1/auth/login', { email, password });
        if (res.data?.data?.user) {
          setUser(res.data.data.user);
          setSuccess('Access granted. Welcome back.');
          setTimeout(() => {
            setPage('shop');
          }, 1000);
        }
      } else {
        const res = await axios.post('/api/v1/auth/register', { name, email, password });
        if (res.data?.data?.user) {
          setUser(res.data.data.user);
          setSuccess('Profile initialized. Please verify your email.');
          setTimeout(() => {
            setPage('shop');
          }, 1500);
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      const errors = err.response?.data?.errors;
      if (errors) {
        // Zod format error dictionary
        const key = Object.keys(errors)[0];
        setError(`${key}: ${errors[key]}`);
      } else {
        setError(err.response?.data?.message || 'Authentication failed. Please verify credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-6 flex items-center justify-center bg-black relative overflow-hidden font-sans">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-magenta/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-white/10 z-10">
        <div className="text-center mb-8">
          <h2 className="font-display font-bold text-2xl text-white tracking-wide">
            {isLogin ? 'OPERATOR SIGN IN' : 'INITIALIZE PROFILE'}
          </h2>
          <p className="text-xs text-white/40 mt-1 leading-relaxed">
            {isLogin ? 'Access secure catalog checkouts and track build orders' : 'Establish pilot credentials to design custom 3D printed assets'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-neon-rose/5 border border-neon-rose/20 rounded-lg flex items-start gap-2 text-xs text-neon-rose mb-5">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-neon-cyan/5 border border-neon-cyan/20 rounded-lg flex items-start gap-2 text-xs text-neon-cyan mb-5">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
          {!isLogin && (
            <div className="flex flex-col gap-1">
              <label className="text-white/60">Profile Nickname</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Lucas Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan"
                />
                <UserIcon className="absolute left-3.5 top-3.5 text-white/30" size={14} />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-white/60">Operator Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="operator@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan"
              />
              <Mail className="absolute left-3.5 top-3.5 text-white/30" size={14} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-white/60">Security Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan"
              />
              <Lock className="absolute left-3.5 top-3.5 text-white/30" size={14} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full liquid-glass-cyan py-3 rounded-lg text-xs font-semibold tracking-wide mt-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Processing Operations...' : isLogin ? 'SIGN IN' : 'REGISTER'}
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-white/40">
          {isLogin ? (
            <span>
              New Operator?{' '}
              <button 
                onClick={() => { setIsLogin(false); setError(''); }} 
                className="text-neon-cyan hover:underline font-semibold"
              >
                Register Credentials
              </button>
            </span>
          ) : (
            <span>
              Registered Pilot?{' '}
              <button 
                onClick={() => { setIsLogin(true); setError(''); }} 
                className="text-neon-cyan hover:underline font-semibold"
              >
                Sign In Instead
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
export default AuthPage;
