import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, MapPin, Plus, User, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const MobileBottomBar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const pathname = location.pathname;

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-8px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 safe-area-pb">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            isActive('/') ? 'text-brand-600 font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className={`w-5 h-5 ${isActive('/') ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px]">Home</span>
        </Link>

        {/* Explore */}
        <Link
          to="/explore"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            isActive('/explore') ? 'text-brand-600 font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Compass className={`w-5 h-5 ${isActive('/explore') ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px]">Explore</span>
        </Link>

        {/* Central Snap CTA Button */}
        <Link
          to={user ? '/report' : '/login'}
          state={!user ? { from: { pathname: '/report' } } : undefined}
          className="relative -top-3.5 flex flex-col items-center group outline-none select-none focus:outline-none"
          aria-label="Report civic issue"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:brightness-105 group-active:scale-95 transition-transform border-2 border-white">
            <Plus className="w-6 h-6 stroke-[3]" />
          </div>
          <span className="text-[10px] font-extrabold text-emerald-700 tracking-tight mt-0.5">
            Snap Issue
          </span>
        </Link>

        {/* Map */}
        <Link
          to="/map"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            isActive('/map') ? 'text-brand-600 font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin className={`w-5 h-5 ${isActive('/map') ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px]">Map</span>
        </Link>

        {/* Profile / Account */}
        <Link
          to={user ? '/dashboard' : '/login'}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            isActive('/dashboard') || isActive('/login') || isActive('/register')
              ? 'text-brand-600 font-extrabold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className={`w-5 h-5 ${isActive('/dashboard') || isActive('/login') ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px]">{user ? 'Account' : 'Sign In'}</span>
        </Link>
      </div>
    </nav>
  );
};
