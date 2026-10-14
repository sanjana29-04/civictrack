import React, { useState } from 'react';
import { Incident, IncidentPriority, IncidentStatus, IncidentCategory } from '../../types';
import { incidentService } from '../../services/incidentService';
import { ShieldCheck, X, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  incident: Incident;
  onSuccess: () => void;
}

export const StatusTransitionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  incident,
  onSuccess,
}) => {
  const [status, setStatus] = useState<IncidentStatus>(incident.status);
  const [priority, setPriority] = useState<IncidentPriority>(incident.priority);
  const [category, setCategory] = useState<IncidentCategory>(incident.category);
  const [reason, setReason] = useState('');
  const [officialReferenceNumber, setOfficialReferenceNumber] = useState(incident.officialReferenceNumber || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const validStatuses: IncidentStatus[] = [
    'SUBMITTED',
    'UNDER_REVIEW',
    'CONFIRMED',
    'ASSIGNED',
    'IN_PROGRESS',
    'RESOLUTION_PROPOSED',
    'RESOLVED_AWAITING_VERIFICATION',
    'REOPENED',
    'CLOSED',
    'REJECTED',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('A reason or justification is strictly required for the public audit trail.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await incidentService.updateStatus(incident.id, {
        status,
        priority,
        category,
        reason: reason.trim(),
        officialReferenceNumber: officialReferenceNumber.trim() || undefined,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-600" />
            <h3 className="text-base font-bold text-navy-900">
              Manage Incident Lifecycle ({incident.incidentNumber})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Status Selector */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Target Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as IncidentStatus)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                {validStatuses.map((st) => (
                  <option key={st} value={st}>
                    {st.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Selector */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as IncidentPriority)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          {/* Official Reference Number */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              Official Reference / Municipal Ticket ID (Optional)
            </label>
            <input
              type="text"
              value={officialReferenceNumber}
              onChange={(e) => setOfficialReferenceNumber(e.target.value)}
              placeholder="e.g. BBMP-RD-2026-9041"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
            />
          </div>

          {/* Reason / Notes */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              Audit Note / Justification (Mandatory)
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain the reason for this status change. This will be preserved in the public timeline audit trail."
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>

          <div className="pt-3 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-sm flex items-center gap-1.5"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Save Transition
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
