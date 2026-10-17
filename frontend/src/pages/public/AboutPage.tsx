import React from 'react';
import { ShieldAlert, Code2, Database, Cpu, Lock, Globe2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
          <span>🇮🇳</span>
          <span>SnapFix • Fixing Our India Together</span>
        </div>
        <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight font-display">
          About SnapFix
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          SnapFix is an intelligent civic accountability platform engineered to fix our India together by bridging the gap between citizen observations and accountable municipal resolution. Designed as a production-grade portfolio project by a Computer Science & Engineering graduate to showcase robust full-stack architecture, clean code principles, and intelligent civic software engineering.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-600 flex items-center justify-center">
            <Code2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-navy-900">Backend Engineering</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Built on Java 17 and Spring Boot 3.2.x, utilizing Spring Security stateless JWT authentication, Spring Data JPA with Hibernate, Bean Validation, centralized exception handling, and Flyway database migrations.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Globe2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-navy-900">Geospatial Intelligence</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Geographic distance calculation using the Haversine formula with bounding box pre-filtering, accompanied by interactive OpenStreetMap Leaflet maps for zero-cost, open data geospatial analysis.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-navy-900">Explainable AI & NLP</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Pluggable AI provider architecture with deterministic NLP fallback. Strictly prevents unverified actions, validates JSON responses against typed schemas, and displays explainable risk factors.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-navy-900">Security & Privacy</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Role-based authorization (Citizen, Moderator, Operations Staff), safe file storage with traversal protection, separate internal operational notes, and privacy-preserving public maps.
          </p>
        </div>
      </div>
    </div>
  );
};
