import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { SnapFixLogo } from './SnapFixLogo';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  ShieldAlert,
  MapPin,
  PlusCircle,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  FileText,
  CopyCheck,
  Wrench,
  BarChart3,
  ChevronDown,
  Layers,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, isCitizen, isModerator, isOperations } = useAuth();
  const { unreadCount } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserDropdownOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center">
              <SnapFixLogo variant="nav" />
            </Link>

            {/* Live Pan-India Counter Pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-violet-50 to-pink-50 border border-violet-200/80 text-xs font-bold text-violet-700 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>🔥 26+ Pan-India Hotspots Active</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/explore"
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive('/explore') ? 'text-brand-700 bg-brand-50/80 font-extrabold' : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100/60'
                }`}
              >
                Explore Issues
              </Link>
              <Link
                to="/map"
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive('/map') ? 'text-brand-700 bg-brand-50/80 font-extrabold' : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100/60'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-brand-600" />
                Live Map
              </Link>
              <Link
                to="/how-it-works"
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive('/how-it-works') ? 'text-brand-700 bg-brand-50/80 font-extrabold' : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100/60'
                }`}
              >
                How It Works
              </Link>
              <Link
                to="/analytics"
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive('/analytics') ? 'text-brand-700 bg-brand-50/80 font-extrabold' : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100/60'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
                Impact Analytics
              </Link>
            </nav>
          </div>

          {/* Right Section / Actions */}
          <div className="hidden md:flex items-center gap-3">

            {/* Moderator/Operations Desk Menu */}
            {(isModerator || isOperations) && (
              <div className="flex items-center gap-1 border-r border-slate-200 pr-3">
                {isModerator && (
                  <Link
                    to="/admin/reviews"
                    className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                      isActive('/admin/reviews') ? 'bg-purple-100 text-purple-800' : 'text-purple-700 hover:bg-purple-50'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Review Queue
                  </Link>
                )}
                <Link
                  to="/admin/duplicates"
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                    isActive('/admin/duplicates') ? 'bg-indigo-100 text-indigo-800' : 'text-indigo-700 hover:bg-indigo-50'
                  }`}
                >
                  <CopyCheck className="w-3.5 h-3.5" />
                  Duplicates
                </Link>
                {isOperations && (
                  <Link
                    to="/admin/operations"
                    className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                      isActive('/admin/operations') ? 'bg-amber-100 text-amber-800' : 'text-amber-700 hover:bg-amber-50'
                    }`}
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    Ops Desk
                  </Link>
                )}
                <Link
                  to="/admin/audit"
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                    isActive('/admin/audit') ? 'bg-slate-200 text-slate-800' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Audit
                </Link>
              </div>
            )}

            {/* Report Issue CTA button */}
            <Link
              to={user ? '/report' : '/login'}
              state={!user ? { from: { pathname: '/report' } } : undefined}
              className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-brand-600 via-brand-500 to-teal-500 hover:brightness-105 active:brightness-95 text-white shadow-md shadow-brand-500/25 hover:scale-105 active:scale-95 transition-transform duration-150 flex items-center gap-2 group outline-none select-none focus:outline-none"
            >
              <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
              <span>Report Problem</span>
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                {/* Notification Bell */}
                <Link
                  to="/notifications"
                  className="relative p-2 text-slate-600 hover:text-navy-900 hover:bg-slate-100 rounded-xl transition-colors"
                  aria-label="View notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-600 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-brand-100 text-brand-800 font-bold text-xs flex items-center justify-center">
                      {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="text-xs font-medium text-slate-700 max-w-[120px] truncate">
                      {user.fullName}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold text-navy-900">{user.fullName}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        <div className="mt-1.5">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                            {user.role.replace('ROLE_', '')}
                          </span>
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          Citizen Dashboard
                        </Link>
                        <Link
                          to="/my-reports"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                        >
                          <FileText className="w-4 h-4 text-slate-400" />
                          My Reports
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          Profile & Preferences
                        </Link>
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-navy-900 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-2xl border border-brand-200/80 hover:scale-105 active:scale-95 transition-all shadow-xs"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Actions: Quick Snap + Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              to="/report"
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-violet-600 text-white shadow-sm shadow-emerald-500/20 flex items-center gap-1.5 active:scale-95 transition-transform"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Snap</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-navy-900 hover:bg-slate-100 border border-slate-200/90 active:scale-95 transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-slate-800" /> : <Menu className="w-5 h-5 text-slate-800" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200/90 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-3 duration-200">
          <div className="flex items-center justify-between px-1 py-1 text-xs font-bold text-slate-500 border-b border-slate-100">
            <span>🇮🇳 SnapFix Mobile Menu</span>
            <span className="text-emerald-600 font-extrabold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              26+ Cities Active
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              to="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-3 rounded-2xl border text-xs font-bold flex flex-col gap-1 transition-all ${
                isActive('/explore') ? 'bg-violet-50 border-violet-300 text-violet-800' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="text-base">🔍</span>
              <span>Explore Issues</span>
            </Link>

            <Link
              to="/map"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-3 rounded-2xl border text-xs font-bold flex flex-col gap-1 transition-all ${
                isActive('/map') ? 'bg-violet-50 border-violet-300 text-violet-800' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="text-base">🗺️</span>
              <span>Live India Map</span>
            </Link>

            <Link
              to="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-3 rounded-2xl border text-xs font-bold flex flex-col gap-1 transition-all ${
                isActive('/how-it-works') ? 'bg-violet-50 border-violet-300 text-violet-800' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="text-base">⚡</span>
              <span>How It Works</span>
            </Link>

            <Link
              to="/analytics"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-3 rounded-2xl border text-xs font-bold flex flex-col gap-1 transition-all ${
                isActive('/analytics') ? 'bg-violet-50 border-violet-300 text-violet-800' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="text-base">📊</span>
              <span>Civic Analytics</span>
            </Link>
          </div>

          <Link
            to="/report"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-center py-3 rounded-2xl font-extrabold text-xs bg-gradient-to-r from-emerald-500 via-teal-500 to-violet-600 text-white shadow-lg shadow-emerald-500/25 active:scale-98 transition-all"
          >
            📸 Snap & Report Problem Now
          </Link>

          {user ? (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center gap-2 px-2 py-1 bg-slate-50 rounded-xl">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-navy-900 truncate">{user.fullName}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 text-center"
                >
                  Dashboard
                </Link>
                <Link
                  to="/my-reports"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 text-center"
                >
                  My Reports
                </Link>
              </div>

              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors mt-2"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 text-xs font-bold rounded-2xl border border-slate-300 text-slate-700 bg-slate-50 active:bg-slate-100 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 text-xs font-bold rounded-2xl bg-gradient-to-r from-brand-600 to-teal-600 text-white shadow-md active:scale-98 transition-all"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
