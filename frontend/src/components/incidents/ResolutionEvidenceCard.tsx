import React from 'react';
import { ResolutionEvidence } from '../../types';
import { CheckCircle2, AlertTriangle, ShieldCheck, UserCheck, Calendar, FileText } from 'lucide-react';

interface Props {
  evidence: ResolutionEvidence;
  onVerify?: () => void;
  onDispute?: () => void;
  canReview?: boolean;
}

export const ResolutionEvidenceCard: React.FC<Props> = ({
  evidence,
  onVerify,
  onDispute,
  canReview = true,
}) => {
  const formattedProposedDate = new Date(evidence.proposedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white rounded-2xl border-2 border-teal-200 overflow-hidden shadow-sm space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6 text-teal-200" />
          <div>
            <h3 className="text-base font-extrabold tracking-tight">
              Official Resolution Evidence
            </h3>
            <p className="text-xs text-teal-100">
              Submitted by authorized operations staff for public verification
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs bg-white/15 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/20">
          <Calendar className="w-3.5 h-3.5 text-teal-200" />
          <span>{formattedProposedDate}</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Before and After Side-by-Side Comparison */}
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Photographic Resolution Evidence
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Before Photo */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Before (Initial Report)
              </span>
              <div className="h-52 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                {evidence.beforePhotoUrl ? (
                  <img
                    src={evidence.beforePhotoUrl}
                    alt="Before repair"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                    No initial photo available
                  </div>
                )}
              </div>
            </div>

            {/* After Photo */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                After (Repair Completed Evidence)
              </span>
              <div className="h-52 rounded-xl overflow-hidden bg-slate-100 border-2 border-emerald-300">
                <img
                  src={evidence.afterPhotoUrl}
                  alt="After repair"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Details & Work Summary */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <UserCheck className="w-4 h-4 text-teal-600" />
              Proposed by: <strong className="text-navy-900">{evidence.proposedByName}</strong>
            </span>

            {evidence.workOrderReference && (
              <span className="flex items-center gap-1.5 text-slate-600 font-mono">
                <FileText className="w-4 h-4 text-slate-400" />
                Work Order: <strong>{evidence.workOrderReference}</strong>
              </span>
            )}
          </div>

          <p className="text-sm text-slate-800 leading-relaxed font-medium">
            "{evidence.resolutionSummary}"
          </p>
        </div>

        {/* Verification Metrics Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-teal-50/60 border border-teal-200">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                {evidence.confirmationCount}
              </div>
              <div className="text-xs">
                <p className="font-bold text-emerald-900">Confirmations</p>
                <p className="text-emerald-700">Verified resolved</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                {evidence.disputeCount}
              </div>
              <div className="text-xs">
                <p className="font-bold text-rose-900">Disputes</p>
                <p className="text-rose-700">Challenged by community</p>
              </div>
            </div>
          </div>

          {/* Action buttons for citizens */}
          {canReview && (
            <div className="flex items-center gap-2.5">
              {onDispute && (
                <button
                  type="button"
                  onClick={onDispute}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-300 transition-colors flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Challenge Resolution
                </button>
              )}

              {onVerify && (
                <button
                  type="button"
                  onClick={onVerify}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm Fixed
                </button>
              )}
            </div>
          )}
        </div>

        {/* Reviews list if any */}
        {evidence.reviews && evidence.reviews.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Community Review Feedback ({evidence.reviews.length})
            </h5>
            <div className="space-y-2">
              {evidence.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className={`p-3 rounded-lg text-xs border ${
                    rev.reviewType === 'CONFIRMATION'
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-rose-50/50 border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold mb-1">
                    <span className={rev.reviewType === 'CONFIRMATION' ? 'text-emerald-800' : 'text-rose-800'}>
                      {rev.reviewerName} ({rev.reviewType === 'CONFIRMATION' ? 'Confirmed' : 'Disputed'})
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-700">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
