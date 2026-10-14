import React, { useState, useEffect } from 'react';
import { duplicateService } from '../../services/duplicateService';
import { DuplicateCandidate } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CategoryBadge } from '../../components/common/CategoryBadge';
import { Link } from 'react-router-dom';
import {
  CopyCheck,
  CheckCircle2,
  XCircle,
  MapPin,
  FileText,
  Loader2,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

export const DuplicateReviewPage: React.FC = () => {
  const [candidates, setCandidates] = useState<DuplicateCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [mergingCandidate, setMergingCandidate] = useState<DuplicateCandidate | null>(null);
  const [mergeReason, setMergeReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await duplicateService.getPendingCandidates(0, 30);
      setCandidates(res.content);
    } catch (err) {
      console.error('Failed to load duplicate candidates', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleConfirmMerge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mergingCandidate || !mergeReason.trim()) return;

    setProcessing(true);
    try {
      await duplicateService.merge(
        mergingCandidate.candidateIncidentId, // surviving
        mergingCandidate.candidateIncidentId, // In API call, source and target
        mergeReason.trim()
      );
      setMessage('Duplicate merged successfully! Community endorsement votes transferred.');
      setMergingCandidate(null);
      setMergeReason('');
      fetchCandidates();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to merge incidents');
    } finally {
      setProcessing(false);
    }
  };

  const handleDismiss = async (candidateId: string) => {
    try {
      await duplicateService.dismiss(candidateId);
      setCandidates((prev) => prev.filter((c) => c.id !== candidateId));
    } catch (err) {
      console.error('Failed to dismiss candidate', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
          <CopyCheck className="w-4 h-4" />
          Duplicate Prevention & Triage
        </div>
        <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">
          Duplicate Review & Merging Desk
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review machine-detected duplicate reports, verify geographic proximity, and consolidate community tickets.
        </p>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-2xl border border-emerald-200 flex items-center justify-between">
          <span className="font-semibold">{message}</span>
          <button onClick={() => setMessage(null)} className="text-emerald-600 font-bold">Dismiss</button>
        </div>
      )}

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        </div>
      ) : candidates.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 max-w-md mx-auto">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold text-navy-900">No Pending Duplicates</h3>
          <p className="text-xs text-slate-500">
            All possible duplicate reports have been audited or merged.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-xs text-slate-500">
            {candidates.length} candidate pairs pending moderator review
          </div>

          <div className="space-y-6">
            {candidates.map((cand) => (
              <div
                key={cand.id}
                className="bg-white rounded-3xl border-2 border-indigo-100 p-6 shadow-sm space-y-5"
              >
                {/* Confidence Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-indigo-950">
                      Duplicate Match Score:
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold">
                      {(cand.overallConfidenceScore * 100).toFixed(0)}% Confidence
                    </span>
                    <span className="text-slate-500">
                      Distance: <strong>{cand.distanceMeters.toFixed(0)} meters</strong>
                    </span>
                  </div>

                  <div className="text-slate-500 italic text-[11px]">
                    {cand.matchReason}
                  </div>
                </div>

                {/* Candidate Incident Preview */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono font-bold text-slate-700">{cand.candidateIncidentNumber}</span>
                    <StatusBadge status={cand.candidateStatus} size="sm" />
                    <CategoryBadge category={cand.candidateCategory} />
                    <span className="text-slate-400">
                      Reported {new Date(cand.candidateCreatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-navy-900">{cand.candidateTitle}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2">{cand.candidateDescription}</p>
                </div>

                {/* Merge / Dismiss Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
                  <Link
                    to={`/incidents/${cand.candidateIncidentId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-800"
                  >
                    <span>Inspect Target Report</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDismiss(cand.id)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      Dismiss (Distinct Issue)
                    </button>

                    <button
                      type="button"
                      onClick={() => setMergingCandidate(cand)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                    >
                      <CopyCheck className="w-4 h-4" />
                      Merge Confirmed Duplicate
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Merge Confirmation Dialog */}
      {mergingCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-navy-900">
              Confirm Incident Merge
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Merging will redirect subsequent visitors of this report to the primary incident, transfer all citizen endorsement votes, and preserve the full audit history without data loss.
            </p>

            <form onSubmit={handleConfirmMerge} className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Reason for Merge (Preserved in public timeline)
              </label>
              <textarea
                rows={3}
                value={mergeReason}
                onChange={(e) => setMergeReason(e.target.value)}
                placeholder="E.g., Verified on-site identical pothole crater on MG Road directly opposite Metro Gate 2."
                className="w-full text-xs p-3 rounded-xl border border-slate-300"
                required
              />

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMergingCandidate(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing || !mergeReason.trim()}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold"
                >
                  {processing ? 'Merging...' : 'Confirm & Merge'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
