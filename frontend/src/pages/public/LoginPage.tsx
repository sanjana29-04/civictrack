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

  const handleFillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-md shadow-brand-500/20">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-navy-900 tracking-tight">
            Sign In to CivicTrack
          </h2>
          <p className="text-xs text-slate-500">
            Track reports, verify civic repairs, and participate in accountability.
          </p>
        </div>

        {/* Quick Recruiter Demo Selector */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-50 to-indigo-50 border border-brand-200 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-900">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Recruiter Demo Quick-Fill</span>
          </div>
          <p className="text-[11px] text-slate-600">
            Click any persona below to auto-fill pre-seeded credentials:
          </p>

          <div className="grid grid-cols-1 gap-1.5">
            <button
              type="button"
              onClick={() => handleFillDemo('citizen@civictrack.org')}
              className="text-left px-2.5 py-1.5 rounded-lg bg-white hover:bg-brand-100/50 border border-brand-200 text-xs text-slate-700 flex items-center justify-between transition-colors"
            >
              <span className="font-semibold text-navy-900">Priya Sharma</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                Citizen
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemo('moderator@civictrack.org')}
              className="text-left px-2.5 py-1.5 rounded-lg bg-white hover:bg-purple-100/50 border border-purple-200 text-xs text-slate-700 flex items-center justify-between transition-colors"
            >
              <span className="font-semibold text-navy-900">Rajesh Patel</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">
                Moderator
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemo('staff@civictrack.org')}
              className="text-left px-2.5 py-1.5 rounded-lg bg-white hover:bg-amber-100/50 border border-amber-200 text-xs text-slate-700 flex items-center justify-between transition-colors"
            >
              <span className="font-semibold text-navy-900">Anil Verma</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                Operations Staff (PWD)
              </span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@civictrack.org"
                className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
            <span>Sign In</span>
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
