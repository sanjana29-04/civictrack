import React, { useState, useEffect } from 'react';
import { incidentService } from '../../services/incidentService';
import { resolutionService } from '../../services/resolutionService';
import { Incident } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CategoryBadge } from '../../components/common/CategoryBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  AlertTriangle,
  Upload,
  CheckCircle2,
  X,
  Loader2,
  ExternalLink,
  Wrench,
  FileText,
} from 'lucide-react';

export const ResolutionVerificationPage: React.FC = () => {
  const [inProgressIncidents, setInProgressIncidents] = useState<Incident[]>([]);
  const [disputedIncidents, setDisputedIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  // Proposal form state
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [afterPhotoUrl, setAfterPhotoUrl] = useState('');
  const [workOrderReference, setWorkOrderReference] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [inProgRes, disputeRes] = await Promise.all([
        incidentService.explore({ status: 'IN_PROGRESS', page: 0, size: 20 }),
        incidentService.explore({ status: 'REOPENED', page: 0, size: 20 }),
      ]);
      setInProgressIncidents(inProgRes.content);
      setDisputedIncidents(disputeRes.content);
    } catch (err) {
      console.error('Failed to load resolution queue', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await incidentService.uploadPhoto(file);
      setAfterPhotoUrl(res.url);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleProposeResolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncident || !resolutionSummary.trim() || !afterPhotoUrl) return;

    setSubmitting(true);
    try {
      await resolutionService.propose({
        incidentId: selectedIncident.id,
        resolutionSummary: resolutionSummary.trim(),
        internalNotes: internalNotes.trim() || undefined,
        afterPhotoUrl,
        workOrderReference: workOrderReference.trim() || undefined,
      });

      setMessage(`Resolution evidence proposed for ${selectedIncident.incidentNumber}! Awaiting citizen confirmation.`);
      setSelectedIncident(null);
      setResolutionSummary('');
      setInternalNotes('');
      setAfterPhotoUrl('');
      setWorkOrderReference('');
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to propose resolution');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4" />
          Evidence-Based Completion
        </div>
        <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">
          Resolution Proposals & Community Verification
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Submit after-repair photographic evidence to allow citizens to confirm or challenge civic resolutions.
        </p>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-2xl border border-emerald-200 flex items-center justify-between">
          <span className="font-semibold">{message}</span>
          <button onClick={() => setMessage(null)} className="text-emerald-600 font-bold">Dismiss</button>
        </div>
      )}

      {/* Section 1: Disputed Resolutions Requiring Remediation */}
      {disputedIncidents.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-rose-700">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-base font-bold text-navy-900">
              Community Challenged / Reopened Incidents ({disputedIncidents.length})
            </h2>
          </div>

          <div className="space-y-3">
            {disputedIncidents.map((inc) => (
              <div
                key={inc.id}
                className="bg-white rounded-2xl p-5 border-2 border-rose-200 shadow-xs flex flex-col md:flex-row items-start justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono font-bold text-slate-700">{inc.incidentNumber}</span>
                    <StatusBadge status={inc.status} size="sm" />
                    <PriorityBadge priority={inc.priority} />
                    <CategoryBadge category={inc.category} />
                  </div>
                  <h3 className="text-sm font-bold text-navy-900">{inc.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2">{inc.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/incidents/${inc.id}`}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl"
                  >
                    Inspect Dispute Evidence
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 2: Active In-Progress Incidents Ready for Resolution Proposal */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-navy-900 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-amber-600" />
          Active Work In Progress Ready for Resolution Proposal ({inProgressIncidents.length})
        </h2>

        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
          </div>
        ) : inProgressIncidents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-400">
            No incidents currently in progress awaiting resolution evidence.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inProgressIncidents.map((inc) => (
              <div
                key={inc.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-slate-700">{inc.incidentNumber}</span>
                    <PriorityBadge priority={inc.priority} />
                  </div>
                  <h3 className="text-sm font-bold text-navy-900 line-clamp-2">{inc.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{inc.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <CategoryBadge category={inc.category} />
                  <button
                    type="button"
                    onClick={() => setSelectedIncident(inc)}
                    className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    Propose Resolution
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resolution Proposal Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-navy-900">
                  Submit Resolution Evidence
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {selectedIncident.incidentNumber} — {selectedIncident.title}
                </p>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProposeResolution} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  After-Repair Proof Photograph <span className="text-red-500">*</span>
                </label>
                {afterPhotoUrl ? (
                  <div className="relative h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    <img src={afterPhotoUrl} alt="Repair completed" className="w-full h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => setAfterPhotoUrl('')}
                      className="absolute top-2 right-2 p-1 rounded-full bg-navy-950/80 text-white hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-xl cursor-pointer bg-slate-50 transition-colors">
                    <div className="flex flex-col items-center justify-center text-xs text-slate-500">
                      {uploading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
                      ) : (
                        <>
                          <Upload className="w-6 h-6 mb-1 text-slate-400" />
                          <span className="font-semibold text-slate-700">Upload on-site completion photo</span>
                        </>
                      )}
                    </div>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Resolution Summary for Citizens <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={resolutionSummary}
                  onChange={(e) => setResolutionSummary(e.target.value)}
                  placeholder="E.g., Excavated silt and debris from culvert, completed road asphalt patching, and verified water drainage."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Work Order / Job Reference ID (Optional)
                </label>
                <input
                  type="text"
                  value={workOrderReference}
                  onChange={(e) => setWorkOrderReference(e.target.value)}
                  placeholder="e.g. WO-PWD-2026-904"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Internal Administrative Notes (Optional - Hidden from citizens)
                </label>
                <textarea
                  rows={2}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Contractor signoff, vendor details, or asphalt batch number..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedIncident(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !resolutionSummary.trim() || !afterPhotoUrl}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Submit Evidence for Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
