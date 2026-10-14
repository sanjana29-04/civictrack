import React from 'react';
import { Link } from 'react-router-dom';
import { DuplicateCandidate } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { CategoryBadge } from '../common/CategoryBadge';
import { CopyCheck, MapPin, ThumbsUp, ArrowRight, ExternalLink } from 'lucide-react';

interface Props {
  candidates: DuplicateCandidate[];
  onSupportExisting?: (incidentId: string) => void;
  onContinueAsNew?: () => void;
}

export const DuplicateSuggestionPanel: React.FC<Props> = ({
  candidates,
  onSupportExisting,
  onContinueAsNew,
}) => {
  if (!candidates || candidates.length === 0) return null;

  return (
    <div className="bg-amber-50/80 border-2 border-amber-300 rounded-2xl p-5 space-y-4 animate-in fade-in">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
          <CopyCheck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-amber-900">
            Possible Existing Report Detected Nearby ({candidates.length})
          </h4>
          <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
            We discovered active reports within walking distance matching your description.
            To speed up resolution, consider supporting the existing incident instead of creating a duplicate report.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {candidates.map((cand) => (
          <div
            key={cand.id}
            className="bg-white rounded-xl p-4 border border-amber-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-mono font-bold text-slate-700">{cand.candidateIncidentNumber}</span>
                <StatusBadge status={cand.candidateStatus} size="sm" />
                <CategoryBadge category={cand.candidateCategory} />
                <span className="text-amber-800 font-semibold bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                  ~{cand.distanceMeters.toFixed(0)}m away (Match: {(cand.overallConfidenceScore * 100).toFixed(0)}%)
                </span>
              </div>

              <h5 className="text-xs font-bold text-navy-900 leading-snug">
                {cand.candidateTitle}
              </h5>

              <p className="text-xs text-slate-600 line-clamp-2">
                {cand.candidateDescription}
              </p>

              <p className="text-[11px] text-amber-800/90 italic">
                Reason: {cand.matchReason}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                to={`/incidents/${cand.candidateIncidentId}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1"
              >
                <span>View</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              {onSupportExisting && (
                <button
                  type="button"
                  onClick={() => onSupportExisting(cand.candidateIncidentId)}
                  className="px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  Support Instead
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {onContinueAsNew && (
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onContinueAsNew}
            className="text-xs font-semibold text-slate-600 hover:text-navy-900 flex items-center gap-1 underline underline-offset-4"
          >
            <span>This is a distinct problem, continue creating new report</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
