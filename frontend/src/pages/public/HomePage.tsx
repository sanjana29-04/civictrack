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
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-slate-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(30,90,238,0.2),transparent_50%)]" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-400/30 text-brand-300 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI-Powered Civic Accountability & Issue Resolution</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Report it. Track it. <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-teal-300">Verify it.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            A transparent community infrastructure platform that classifies civic issues, detects duplicate complaints, preserves immutable audit histories, and empowers citizens to confirm or challenge resolutions.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto pt-2">
            <div className="relative flex items-center shadow-2xl rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-2">
              <Search className="w-5 h-5 text-slate-400 ml-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search potholes, waterlogging, streetlights, or your street..."
                className="w-full bg-transparent px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors shrink-0"
              >
                Find Issues
              </button>
            </div>
          </form>

          {/* Primary Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/report"
              className="px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-600/30 flex items-center gap-2 transition-all hover:scale-105"
            >
              <PlusCircle className="w-5 h-5" />
              Report A Civic Issue
            </Link>

            <Link
              to="/map"
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 flex items-center gap-2 transition-all"
            >
              <MapPin className="w-5 h-5 text-teal-300" />
              Open Live Issue Map
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          {analytics && (
            <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-white/10">
              <div className="p-3 text-center">
                <span className="block text-2xl font-extrabold text-white">{analytics.totalIncidents}</span>
                <span className="text-xs text-slate-400">Total Tracked Issues</span>
              </div>
              <div className="p-3 text-center">
                <span className="block text-2xl font-extrabold text-amber-400">{analytics.inProgressIncidents}</span>
                <span className="text-xs text-slate-400">Active Field Work</span>
              </div>
              <div className="p-3 text-center">
                <span className="block text-2xl font-extrabold text-teal-400">{analytics.awaitingVerificationCount}</span>
                <span className="text-xs text-slate-400">Awaiting Citizen Verification</span>
              </div>
              <div className="p-3 text-center">
                <span className="block text-2xl font-extrabold text-emerald-400">{analytics.resolutionConfirmationRatePercent}%</span>
                <span className="text-xs text-slate-400">Citizen Confirmation Rate</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4-Step Accountability Engine Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            How CivicTrack Restores Accountability
          </h2>
          <p className="text-sm text-slate-600">
            A reliable, transparent lifecycle that moves beyond traditional complaint boxes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-600 font-extrabold flex items-center justify-center text-sm border border-blue-100">
              01
            </div>
            <h3 className="text-base font-bold text-navy-900">Evidence Reporting</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Citizens report problems with geotagged coordinates, landmarks, and photo proof.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 font-extrabold flex items-center justify-center text-sm border border-amber-100">
              02
            </div>
            <h3 className="text-base font-bold text-navy-900">Duplicate Detection</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real-time geographic radius and text similarity engines prevent duplicate fragmentation and allow community endorsement.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 font-extrabold flex items-center justify-center text-sm border border-purple-100">
              03
            </div>
            <h3 className="text-base font-bold text-navy-900">Transparent Triage</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Explainable safety scoring and timeline audit logs ensure every status transition is documented with a named actor and timestamp.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 font-extrabold flex items-center justify-center text-sm border border-emerald-100">
              04
            </div>
            <h3 className="text-base font-bold text-navy-900">Resolution Verification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No complaint is closed silently. Staff must provide after-repair photo proof, which citizens can confirm or dispute.
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
