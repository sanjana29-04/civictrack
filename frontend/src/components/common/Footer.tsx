import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Heart, Github, ExternalLink, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-navy-900 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-navy-900">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">CivicTrack 2.0</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Report it. Track it. Verify it. The AI-assisted civic accountability platform empowering citizens through photographic evidence, duplicate-aware reporting, and transparent resolution tracking.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-brand-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Production Portfolio Edition
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Platform Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/explore" className="hover:text-white transition-colors">Explore All Incidents</Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-white transition-colors">Interactive Geographic Map</Link>
              </li>
              <li>
                <Link to="/report" className="hover:text-white transition-colors">Report Infrastructure Problem</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">How Accountability Works</Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-white transition-colors">Civic Intelligence Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Civic Accountability */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Integrity & Policies</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/guidelines" className="hover:text-white transition-colors">Evidence Verification Guidelines</Link>
              </li>
              <li>
                <Link to="/guidelines" className="hover:text-white transition-colors">Duplicate Detection Standards</Link>
              </li>
              <li>
                <Link to="/guidelines" className="hover:text-white transition-colors">Resolution Dispute Protocols</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About & System Architecture</Link>
              </li>
              <li>
                <Link to="/guidelines" className="hover:text-white transition-colors">Privacy & Data Governance</Link>
              </li>
            </ul>
          </div>

          {/* Technology & Recruiter info */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Architecture Stack</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Built with Java 17, Spring Boot 3.2, PostgreSQL, Leaflet, React 18, TypeScript, and Tailwind CSS.
            </p>
            <div className="p-3 rounded-lg bg-navy-900 border border-navy-800 text-[11px] text-slate-400 space-y-1">
              <p className="font-semibold text-slate-200">Demo Credentials:</p>
              <p>Citizen: <code className="text-brand-300">citizen@civictrack.org</code></p>
              <p>Staff: <code className="text-amber-300">staff@civictrack.org</code></p>
              <p>Pass: <code className="text-slate-300">Password123!</code></p>
            </div>
          </div>
        </div>

        {/* Disclaimer & Attribution */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p className="text-center md:text-left">
            Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="underline hover:text-slate-300">OpenStreetMap</a> contributors.
            CivicTrack does not claim official municipal authority unless integration is certified.
          </p>
          <p className="text-center md:text-right">
            Designed for engineering portfolio & civic accountability.
          </p>
        </div>
      </div>
    </footer>
  );
};
