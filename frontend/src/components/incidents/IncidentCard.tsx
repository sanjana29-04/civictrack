import React from 'react';
import { Link } from 'react-router-dom';
import { Incident } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { CategoryBadge } from '../common/CategoryBadge';
import { MapPin, ThumbsUp, Calendar, ChevronRight, Sparkles } from 'lucide-react';

interface Props {
  incident: Incident;
}

export const IncidentCard: React.FC<Props> = ({ incident }) => {
  const formattedDate = new Date(incident.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  // Extract or format city/region
  const anyInc = incident as any;
  const locationLabel = anyInc.city ? `${anyInc.city}` : incident.landmark || incident.address || 'India';

  return (
    <div className="bg-white rounded-[2rem] border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-violet-500/10 hover:border-violet-300/80 hover:-translate-y-1.5 transition-all duration-300 flex flex-col group relative">
      {/* Image header with status overlay */}
      <div className="relative h-48 bg-slate-900 overflow-hidden">
        {incident.primaryPhotoUrl ? (
          <img
            src={incident.primaryPhotoUrl}
            alt={incident.title}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 opacity-95 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-navy-950 text-slate-400">
            <span className="text-xs font-semibold">📸 No Photo Attached</span>
          </div>
        )}

        {/* Gradient scrim for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <StatusBadge status={incident.status} size="sm" />
        </div>

        <div className="absolute top-3 right-3 z-10">
          <PriorityBadge priority={incident.priority} />
        </div>

        {/* City Location Tag */}
        <div className="absolute bottom-2.5 left-3 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-bold border border-white/20 shadow-sm">
            <span>📍</span>
            <span>{locationLabel}</span>
          </span>
        </div>

        {incident.aiConfidence && (
          <div className="absolute bottom-2.5 right-3 z-10 bg-emerald-950/80 backdrop-blur-md text-emerald-300 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 border border-emerald-400/30">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            AI Verified ({(incident.aiConfidence * 100).toFixed(0)}%)
          </div>
        )}
      </div>

      {/* Body content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="font-bold text-slate-500">{incident.incidentNumber}</span>
            <div className="flex items-center gap-1 text-slate-500 font-sans font-medium text-[11px]">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formattedDate}</span>
            </div>
          </div>

          <Link to={`/incidents/${incident.id}`}>
            <h3 className="text-base font-bold text-navy-900 line-clamp-2 group-hover:text-violet-600 transition-colors leading-snug font-display">
              {incident.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {incident.description}
          </p>
        </div>

        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CategoryBadge category={incident.category} />

            <div className="flex items-center gap-1 text-xs text-slate-700 font-bold bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200/80">
              <span className="text-rose-500">🔥</span>
              <span>{incident.supportCount} hype</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <div className="flex items-center gap-1.5 truncate max-w-[190px]">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate font-medium text-slate-600">
                {incident.address || incident.landmark || 'India'}
              </span>
            </div>

            <Link
              to={`/incidents/${incident.id}`}
              className="inline-flex items-center gap-1 font-extrabold text-xs text-violet-600 hover:text-violet-800 bg-violet-50 hover:bg-violet-100 px-3 py-1 rounded-xl transition-all group-hover:translate-x-0.5"
            >
              View Fix
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
