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
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all hover:border-slate-300 flex flex-col group">
      {/* Image header with status overlay */}
      <div className="relative h-44 bg-slate-100 overflow-hidden">
        {incident.primaryPhotoUrl ? (
          <img
            src={incident.primaryPhotoUrl}
            alt={incident.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
            <span className="text-xs font-medium">No Photograph Attached</span>
          </div>
        )}

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <StatusBadge status={incident.status} size="sm" />
        </div>

        <div className="absolute top-3 right-3 z-10">
          <PriorityBadge priority={incident.priority} />
        </div>

        {incident.aiConfidence && (
          <div className="absolute bottom-2 right-2 bg-navy-950/80 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 border border-white/20">
            <Sparkles className="w-3 h-3 text-amber-400" />
            AI Classified ({(incident.aiConfidence * 100).toFixed(0)}%)
          </div>
        )}
      </div>

      {/* Body content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>{incident.incidentNumber}</span>
            <div className="flex items-center gap-1 text-slate-500 font-sans">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formattedDate}</span>
            </div>
          </div>

          <Link to={`/incidents/${incident.id}`}>
            <h3 className="text-base font-bold text-navy-900 line-clamp-2 group-hover:text-brand-600 transition-colors leading-snug">
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

            <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
              <ThumbsUp className="w-3.5 h-3.5 text-brand-600" />
              <span>{incident.supportCount} citizens</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5 truncate max-w-[200px]">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">
                {incident.landmark ? incident.landmark : incident.address || 'Reported Location'}
              </span>
            </div>

            <Link
              to={`/incidents/${incident.id}`}
              className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-800 shrink-0 group-hover:translate-x-0.5 transition-transform"
            >
              Details
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
