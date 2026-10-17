import React from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Users,
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
          <span>🇮🇳</span>
          SnapFix • Fixing Our India Together
        </div>
        <h1 className="text-4xl font-extrabold text-navy-900 tracking-tight font-display">
          How SnapFix Works
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Traditional municipal reporting frequently fails because complaints disappear into black boxes or get closed without proof. SnapFix replaces opacity with photographic evidence, duplicate-aware coordination, and citizen-verified completion — fixing our India together.
        </p>
      </div>

      {/* 4 Pillars */}
      <div className="space-y-12">
        {/* Step 1 */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start gap-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 text-brand-700 font-extrabold text-2xl flex items-center justify-center shrink-0">
            01
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-navy-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-brand-600" />
              Evidence-Based Reporting
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              When an infrastructure defect is observed (such as a pothole, open manhole, water leak, or dark streetlight), the citizen pinpoints the exact geographic location on an interactive OpenStreetMap canvas and uploads photographic evidence. This grounds every report in verifiable reality rather than vague text.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start gap-8">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 font-extrabold text-2xl flex items-center justify-center shrink-0">
            02
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-navy-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-600" />
              Intelligent Duplicate Detection & Co-Endorsement
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Rather than filing dozens of disconnected complaints for the same road cave-in, SnapFix executes a Haversine radius scan and text-similarity comparison. If matching reports exist, citizens can click "Support Instead" with a single tap. This consolidates community urgency without fragmenting municipal tickets.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start gap-8">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 font-extrabold text-2xl flex items-center justify-center shrink-0">
            03
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-navy-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Explainable Risk Prioritization & Immutable Timelines
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Our explainable risk engine evaluates safety hazard keywords, school or hospital proximity, photographic completeness, and community endorsement counts to recommend an objective priority band. Every status transition is immutably logged with the responsible official's identity, timestamps, and public notes.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start gap-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 font-extrabold text-2xl flex items-center justify-center shrink-0">
            04
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-navy-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Citizen Resolution Verification & Challenge Protocol
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Municipal staff cannot simply mark a problem "Closed". When resolution is proposed, after-repair photographs and work order numbers must be attached. The status shifts to <strong>"Resolved — Awaiting Verification"</strong>. Citizens inspect the work on the ground: if satisfied, they confirm resolution; if shoddy or incomplete, they can challenge the claim with follow-up photos, automatically reopening the issue for review.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-gradient-to-r from-navy-900 to-navy-950 rounded-3xl p-8 sm:p-12 text-white text-center space-y-4">
        <h2 className="text-2xl font-bold">Ready to make your neighborhood safer?</h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Start by submitting your first civic report or exploring nearby issues on the interactive map.
        </p>
        <div className="pt-2 flex justify-center gap-4">
          <Link
            to="/report"
            className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 font-bold text-xs shadow-md transition-all"
          >
            Report An Issue
          </Link>
          <Link
            to="/explore"
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 font-bold text-xs border border-white/20 transition-all"
          >
            Explore Issues
          </Link>
        </div>
      </div>
    </div>
  );
};
