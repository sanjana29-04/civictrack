import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { incidentService } from '../../services/incidentService';
import { Incident } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { CategoryBadge } from '../../components/common/CategoryBadge';
import { StatusTransitionModal } from '../../components/incidents/StatusTransitionModal';
import { FileText, CheckCircle2, XCircle, Sparkles, AlertTriangle, Loader2 } from 'lucide-react';

export const ReviewQueuePage: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await incidentService.explore({
        status: 'SUBMITTED',
        page: 0,
        size: 20,
        sortBy: 'createdAt',
        direction: 'asc', // FIFO order for review
      });
      setIncidents(res.content);
    } catch (err) {
      console.error('Failed to load review queue', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleOpenStatusModal = (incident: Incident) => {
    setSelectedIncident(incident);
    setStatusModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
          <FileText className="w-4 h-4" />
          Civic Moderation
        </div>
        <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">
          Moderator Review Queue
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review new citizen submissions, inspect AI triage recommendations, and verify problem severity.
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        </div>
      ) : incidents.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 max-w-md mx-auto">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold text-navy-900">Queue is Clear!</h3>
          <p className="text-xs text-slate-500">
            All newly submitted civic reports have been reviewed and triaged by moderators.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{incidents.length} submissions awaiting moderator review</span>
          </div>

          <div className="space-y-4">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-slate-300 transition-colors flex flex-col md:flex-row items-start justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono font-bold text-slate-700">{inc.incidentNumber}</span>
                    <StatusBadge status={inc.status} size="sm" />
                    <CategoryBadge category={inc.category} />
                    <PriorityBadge priority={inc.priority} />
                    <span className="text-slate-400">
                      Reported by {inc.reporterName} • {new Date(inc.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <Link to={`/incidents/${inc.id}`}>
                    <h3 className="text-base font-bold text-navy-900 hover:text-brand-600 transition-colors">
                      {inc.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {inc.description}
                  </p>

                  {/* AI Recommendation Highlight */}
                  {inc.aiSuggestedPriority && (
                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>
                          AI Recommended Priority: <strong>{inc.aiSuggestedPriority}</strong> ({inc.aiPriorityReason})
                        </span>
                      </div>
                      <span className="text-[10px] text-amber-800 font-bold shrink-0">
                        Confidence: {(inc.aiConfidence || 0.85) * 100}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto">
                  <Link
                    to={`/incidents/${inc.id}`}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 text-center"
                  >
                    Inspect Details
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleOpenStatusModal(inc)}
                    className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs text-center"
                  >
                    Triage & Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedIncident && (
        <StatusTransitionModal
          isOpen={statusModalOpen}
          onClose={() => {
            setStatusModalOpen(false);
            setSelectedIncident(null);
          }}
          incident={selectedIncident}
          onSuccess={fetchQueue}
        />
      )}
    </div>
  );
};
