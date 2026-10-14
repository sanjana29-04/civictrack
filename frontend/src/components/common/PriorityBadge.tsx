import React from 'react';
import { IncidentPriority } from '../../types';
import { AlertTriangle, AlertCircle, Info, ShieldAlert } from 'lucide-react';

interface Props {
  priority: IncidentPriority;
  showIcon?: boolean;
}

export const PriorityBadge: React.FC<Props> = ({ priority, showIcon = true }) => {
  switch (priority) {
    case 'CRITICAL':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300 animate-pulse">
          {showIcon && <ShieldAlert className="w-3.5 h-3.5 text-red-600" />}
          Critical
        </span>
      );
    case 'HIGH':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
          {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />}
          High
        </span>
      );
    case 'MEDIUM':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
          {showIcon && <AlertCircle className="w-3.5 h-3.5 text-amber-600" />}
          Medium
        </span>
      );
    case 'LOW':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
          {showIcon && <Info className="w-3.5 h-3.5 text-slate-500" />}
          Low
        </span>
      );
    default:
      return <span className="text-xs">{priority}</span>;
  }
};
