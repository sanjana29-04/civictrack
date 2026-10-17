import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, Lock, Mail, Loader2, Sparkles, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login({ email: email.trim(), password });
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      {/* Background ambient neon orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-brand-500/15 via-emerald-400/15 to-teal-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-7 bg-white/95 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] border border-slate-200/80 shadow-2xl shadow-brand-500/10 relative z-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
            <span>🇮🇳</span>
            <span>SnapFix • Fixing Our India Together</span>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-teal-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-500/25">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight font-display">
            Welcome Back
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Log in to report civic problems, verify ongoing repairs, and keep your city accountable.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 text-red-700 text-xs rounded-2xl border border-red-200/80 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full text-sm pl-11 pr-4 py-3 rounded-2xl bg-slate-50/70 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all placeholder:text-slate-400"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-sm pl-11 pr-4 py-3 rounded-2xl bg-slate-50/70 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all placeholder:text-slate-400"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-teal-500 hover:from-brand-500 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
            <span>Sign In to SnapFix</span>
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-brand-600 hover:underline">
            Register as Citizen
          </Link>
        </div>
      </div>
    </div>
  );
};
