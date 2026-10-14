import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, EyeOff, Camera } from 'lucide-react';

export const GuidelinesPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">
          Community & Evidence Guidelines
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Standards for photographic evidence, duplicate avoidance, and constructive dispute resolution.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
            <Camera className="w-5 h-5 text-brand-600" />
            1. Evidence Photography Standards
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Attach clear, well-lit photos showing the infrastructure problem in its broader physical context (e.g., surrounding roadway, sidewalk, or street signage) so field teams can locate and size the required repair work accurately.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-amber-600" />
            2. Privacy & Personal Information Protection
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Do not photograph vehicle registration license plates, private individual faces, or sensitive domestic property. Reports containing identifiable private details will be redacted or flagged by moderators.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            3. Respectful Resolution Disputes
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            When challenging a claimed resolution, provide constructive visual evidence demonstrating what remains incomplete. The challenge protocol creates a formal review task rather than levying accusations against operational personnel.
          </p>
        </div>
      </div>
    </div>
  );
};
