import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { incidentService } from '../../services/incidentService';
import { analyticsService } from '../../services/analyticsService';
import { Incident, IncidentMapMarker, CivicAnalytics } from '../../types';
import { IncidentCard } from '../../components/incidents/IncidentCard';
import { IncidentMap } from '../../components/map/IncidentMap';
import {
  ShieldAlert,
  Search,
  PlusCircle,
  MapPin,
  CheckCircle2,
  CopyCheck,
  Sparkles,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  Users,
  Flame,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [recentIncidents, setRecentIncidents] = useState<Incident[]>([]);
  const [mapMarkers, setMapMarkers] = useState<IncidentMapMarker[]>([]);
  const [analytics, setAnalytics] = useState<CivicAnalytics | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recentRes, mapRes, statsRes] = await Promise.all([
          incidentService.explore({ page: 0, size: 4, sortBy: 'createdAt', direction: 'desc' }),
          incidentService.getMapMarkers(),
          analyticsService.getPublicAnalytics(),
        ]);
        setRecentIncidents(recentRes.content);
        setMapMarkers(mapRes);
        setAnalytics(statsRes);
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-slate-950 text-white pt-16 pb-28 px-4 sm:px-6 lg:px-8">
        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-emerald-500/20 via-brand-500/20 to-teal-400/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-7 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-bold backdrop-blur-md shadow-sm">
            <span className="text-sm">🇮🇳</span>
            <span>Clean India, Better India Movement</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] font-display">
            Clean India, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Better India.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-medium">
            Snap it. Track it. Get it fixed. Zero excuses, total transparency. The Gen-Z civic platform turning your smartphone photos into real street repairs and cleaner neighborhoods.
          </p>

          {/* Quick Feature Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1 text-xs font-semibold text-slate-300">
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
              📸 10-Second Photo Reports
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
              ⚡ AI Hazard Detection
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
              🛡️ Citizen-Verified Repairs
            </span>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto pt-3">
            <div className="relative flex items-center shadow-2xl rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-2 focus-within:border-emerald-400/80 focus-within:ring-2 focus-within:ring-emerald-400/30 transition-all">
              <Search className="w-5 h-5 text-emerald-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search potholes, overflow bins, waterlogging, or street name..."
                className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs transition-all shadow-md shadow-emerald-500/20 shrink-0"
              >
                Find Issues
              </button>
            </div>
          </form>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/report"
              className="px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-brand-600 hover:from-emerald-400 hover:to-brand-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/25 flex items-center gap-2.5 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-5 h-5" />
              Snap & Report Problem
            </Link>

            <Link
              to="/map"
              className="px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 backdrop-blur-md flex items-center gap-2.5 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <MapPin className="w-5 h-5 text-teal-300" />
              Explore Live Map
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          {analytics && (
            <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-white/10">
              <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center">
                <span className="block text-3xl font-extrabold text-white font-display">{analytics.totalIncidents}</span>
                <span className="text-xs text-slate-300 font-medium">Tracked Complaints</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center">
                <span className="block text-3xl font-extrabold text-amber-400 font-display">{analytics.inProgressIncidents}</span>
                <span className="text-xs text-slate-300 font-medium">Active Crews On-Site</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center">
                <span className="block text-3xl font-extrabold text-teal-300 font-display">{analytics.awaitingVerificationCount}</span>
                <span className="text-xs text-slate-300 font-medium">Awaiting Citizen Check</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center">
                <span className="block text-3xl font-extrabold text-emerald-400 font-display">{analytics.resolutionConfirmationRatePercent}%</span>
                <span className="text-xs text-slate-300 font-medium">Fixes Confirmed</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4-Step Accountability Engine Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-xs font-bold">
            <span>⚡ Zero Ghosting</span>
            <span>•</span>
            <span>100% Real Action</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-navy-900 tracking-tight font-display">
            How CivicTrack Gets Real Work Done
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Snap the problem, AI routes it to field workers, and you verify the finished repair. No bureaucracy, no fake closures.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-600 font-extrabold flex items-center justify-center text-base border border-blue-100 group-hover:scale-110 transition-transform">
              📸
            </div>
            <div className="space-y-1.5">
              <span className="text-[11px] font-extrabold text-brand-600 uppercase tracking-wider">Step 01</span>
              <h3 className="text-base font-bold text-navy-900 font-display">Snap & Geotag</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload clear photo proof and pinpoint exact GPS coordinates in seconds. No lengthy forms or office visits.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 font-extrabold flex items-center justify-center text-base border border-amber-100 group-hover:scale-110 transition-transform">
              ⚡
            </div>
            <div className="space-y-1.5">
              <span className="text-[11px] font-extrabold text-amber-600 uppercase tracking-wider">Step 02</span>
              <h3 className="text-base font-bold text-navy-900 font-display">AI Duplicate Shield</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Smart spatial-textual matching flags nearby complaints within 500m so community upvotes unite into one priority ticket.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 font-extrabold flex items-center justify-center text-base border border-purple-100 group-hover:scale-110 transition-transform">
              🕒
            </div>
            <div className="space-y-1.5">
              <span className="text-[11px] font-extrabold text-purple-600 uppercase tracking-wider">Step 03</span>
              <h3 className="text-base font-bold text-navy-900 font-display">Public Audit Trail</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Transparent live timeline logs when the crew was dispatched and hot-mix asphalt was applied. Everything is public.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 font-extrabold flex items-center justify-center text-base border border-emerald-100 group-hover:scale-110 transition-transform">
              ✅
            </div>
            <div className="space-y-1.5">
              <span className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-wider">Step 04</span>
              <h3 className="text-base font-bold text-navy-900 font-display">Citizen Verifies Fix</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Staff must provide after-repair photo proof. You confirm the fix or challenge it with a fresh photo to instantly reopen!
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Map Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>Geographic Intelligence</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-navy-900 mt-1">
                Live Community Incident Map
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect open, in-progress, and verified civic infrastructure issues across neighborhoods.
              </p>
            </div>

            <Link
              to="/map"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-4 py-2.5 rounded-xl border border-brand-200 transition-colors self-start sm:self-auto"
            >
              <span>Explore Fullscreen Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <IncidentMap markers={mapMarkers} height="440px" />
        </div>
      </section>

      {/* Recent Public Incidents */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-navy-900">
              Recent Community Reports
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live civic incident updates, triage statuses, and verified evidence.
            </p>
          </div>

          <Link
            to="/explore"
            className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1"
          >
            <span>View All Issues</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentIncidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      </section>
    </div>
  );
};
