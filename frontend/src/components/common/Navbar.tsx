import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-navy-900 tracking-tight flex items-center gap-1.5 font-display">
                  CivicTrack
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                    🇮🇳 Clean India
                  </span>
                </span>
                <span className="block text-[10px] text-slate-500 font-semibold tracking-wide">
                  Better India • Citizen Action
                </span>
              </div>
            </Link>

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
              to="/report"
              className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-brand-600 via-brand-500 to-teal-500 hover:from-brand-500 hover:to-teal-400 text-white shadow-md shadow-brand-500/25 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 group"
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

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-navy-900 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Explore Issues
          </Link>
          <Link
            to="/map"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Interactive Live Map
          </Link>
          <Link
            to="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            How It Works
          </Link>
          <Link
            to="/analytics"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Civic Analytics
          </Link>
          <Link
            to="/report"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-center px-4 py-2.5 rounded-xl font-semibold bg-brand-600 text-white"
          >
            + Report An Issue
          </Link>

          {user ? (
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase px-3">Signed In as {user.fullName}</p>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
              >
                Citizen Dashboard
              </Link>
              <Link
                to="/my-reports"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
              >
                My Reports
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-200 flex gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-sm font-semibold rounded-lg border border-slate-300 text-slate-700"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-sm font-semibold rounded-lg bg-brand-600 text-white"
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
