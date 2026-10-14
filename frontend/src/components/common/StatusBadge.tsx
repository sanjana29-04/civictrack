import React from 'react';
import { IncidentStatus } from '../../types';
import {
  Clock,
  Search,
  CheckCircle2,
  UserCheck,
  Wrench,
  HelpCircle,
  ShieldCheck,
  RotateCcw,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface Props {
  status: IncidentStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<Props> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-medium px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2',
  }[size];

  switch (status) {
    case 'SUBMITTED':
      return (
        <span className={`inline-flex items-center rounded-full bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5" />
          Submitted
        </span>
      );
    case 'UNDER_REVIEW':
      return (
        <span className={`inline-flex items-center rounded-full bg-purple-50 text-purple-700 border border-purple-200 ${sizeClasses}`}>
          <Search className="w-3.5 h-3.5" />
          Under Review
        </span>
      );
    case 'CONFIRMED':
      return (
        <span className={`inline-flex items-center rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5" />
          Confirmed
        </span>
      );
    case 'ASSIGNED':
      return (
        <span className={`inline-flex items-center rounded-full bg-sky-50 text-sky-700 border border-sky-200 ${sizeClasses}`}>
          <UserCheck className="w-3.5 h-3.5" />
          Assigned
        </span>
      );
    case 'IN_PROGRESS':
      return (
        <span className={`inline-flex items-center rounded-full bg-amber-50 text-amber-700 border border-amber-200 ${sizeClasses}`}>
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <Wrench className="w-3.5 h-3.5" />
          In Progress
        </span>
      );
    case 'RESOLUTION_PROPOSED':
      return (
        <span className={`inline-flex items-center rounded-full bg-violet-50 text-violet-700 border border-violet-200 ${sizeClasses}`}>
          <HelpCircle className="w-3.5 h-3.5" />
          Resolution Proposed
        </span>
      );
    case 'RESOLVED_AWAITING_VERIFICATION':
      return (
        <span className={`inline-flex items-center rounded-full bg-teal-50 text-teal-800 border border-teal-300 font-semibold shadow-sm ${sizeClasses}`}>
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          Awaiting Verification
        </span>
      );
    case 'REOPENED':
      return (
        <span className={`inline-flex items-center rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${sizeClasses}`}>
          <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
          Reopened
        </span>
      );
    case 'CLOSED':
      return (
        <span className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses}`}>
          <CheckCircle className="w-3.5 h-3.5" />
          Closed & Verified
        </span>
      );
    case 'REJECTED':
      return (
        <span className={`inline-flex items-center rounded-full bg-slate-100 text-slate-600 border border-slate-300 ${sizeClasses}`}>
          <XCircle className="w-3.5 h-3.5" />
          Rejected
        </span>
      );
    default:
      return <span className={`inline-flex items-center rounded-full bg-slate-100 text-slate-800 ${sizeClasses}`}>{status}</span>;
  }
};
