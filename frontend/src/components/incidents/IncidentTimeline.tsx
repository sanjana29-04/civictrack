import React from 'react';
import { TimelineEvent } from '../../types';
import {
  FileText,
  UserCheck,
  Wrench,
  HelpCircle,
  ShieldCheck,
  RotateCcw,
  Layers,
  XCircle,
  CheckCircle,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface Props {
  events: TimelineEvent[];
}

export const IncidentTimeline: React.FC<Props> = ({ events }) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'REPORT_SUBMITTED':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'REVIEW_COMPLETED':
        return <UserCheck className="w-4 h-4 text-purple-600" />;
      case 'ASSIGNED':
        return <UserCheck className="w-4 h-4 text-sky-600" />;
      case 'WORK_STARTED':
        return <Wrench className="w-4 h-4 text-amber-600" />;
      case 'PUBLIC_UPDATE':
        return <Clock className="w-4 h-4 text-slate-600" />;
      case 'RESOLUTION_PROPOSED':
        return <HelpCircle className="w-4 h-4 text-violet-600" />;
      case 'RESOLUTION_VERIFIED':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'RESOLUTION_DISPUTED':
        return <RotateCcw className="w-4 h-4 text-rose-600" />;
      case 'MERGED':
        return <Layers className="w-4 h-4 text-indigo-600" />;
      case 'REJECTED':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  const getActorBadge = (role: string) => {
    switch (role) {
      case 'ROLE_OPERATIONS':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">Operations Staff</span>;
      case 'ROLE_MODERATOR':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold">Civic Moderator</span>;
      case 'CITIZEN':
      case 'ROLE_CITIZEN':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">Community Member</span>;
      default:
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">System Audit</span>;
    }
  };

  if (!events || events.length === 0) {
    return (
      <div className="py-8 text-center text-slate-400 text-sm">
        No public timeline events recorded yet.
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
      {events.map((event, index) => {
        const formattedDate = new Date(event.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        return (
          <div key={event.id || index} className="relative group">
            {/* Timeline icon node */}
            <div className="absolute -left-6 top-1.5 w-6 h-6 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center shadow-xs group-hover:border-brand-500 transition-colors">
              {getEventIcon(event.eventType)}
            </div>

            {/* Event content box */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-slate-300 transition-colors space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-navy-900 capitalize">
                    {event.eventType.replace(/_/g, ' ')}
                  </span>
                  {getActorBadge(event.actorRole)}
                </div>
                <span className="text-[11px] text-slate-400">{formattedDate}</span>
              </div>

              <div className="text-xs text-slate-500 font-medium">
                Recorded by: <span className="text-slate-800 font-semibold">{event.actorName}</span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                {event.details}
              </p>

              {event.evidenceUrl && (
                <div className="mt-2 pt-2 border-t border-slate-200">
                  <a
                    href={event.evidenceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-800"
                  >
                    <span>View Attached Evidence Photograph</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
