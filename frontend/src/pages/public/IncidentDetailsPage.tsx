import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { incidentService } from '../../services/incidentService';
import { duplicateService } from '../../services/duplicateService';
import { resolutionService } from '../../services/resolutionService';
import { useAuth } from '../../context/AuthContext';
import {
  Incident,
  TimelineEvent,
  DuplicateCandidate,
  ResolutionEvidence,
  Comment,
} from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { CategoryBadge } from '../../components/common/CategoryBadge';
import { IncidentTimeline } from '../../components/incidents/IncidentTimeline';
import { ResolutionEvidenceCard } from '../../components/incidents/ResolutionEvidenceCard';
import { DuplicateSuggestionPanel } from '../../components/incidents/DuplicateSuggestionPanel';
import { CitizenVerificationModal } from '../../components/incidents/CitizenVerificationModal';
import { StatusTransitionModal } from '../../components/incidents/StatusTransitionModal';
import { IncidentMap } from '../../components/map/IncidentMap';
import {
  ThumbsUp,
  MapPin,
  Calendar,
  Sparkles,
  Share2,
  FileText,
  MessageSquare,
  ShieldAlert,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowLeft,
  Loader2,
  Info,
} from 'lucide-react';

export const IncidentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isModerator, isOperations } = useAuth();
  const navigate = useNavigate();

  const [incident, setIncident] = useState<Incident | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [duplicateCandidates, setDuplicateCandidates] = useState<DuplicateCandidate[]>([]);
  const [resolutionEvidence, setResolutionEvidence] = useState<ResolutionEvidence | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [hasSupported, setHasSupported] = useState(false);
  const [supportCount, setSupportCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [verificationType, setVerificationType] = useState<'CONFIRMATION' | 'DISPUTE'>('CONFIRMATION');
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchIncidentData = async () => {
    if (!id) return;
    try {
      const [incData, timelineData, candidatesData, evidenceData, commentsData] = await Promise.all([
        incidentService.getById(id),
        incidentService.getTimeline(id),
        duplicateService.getCandidatesForIncident(id),
        resolutionService.getEvidence(id).catch(() => null),
        incidentService.getComments(id).catch(() => []),
      ]);

      setIncident(incData);
      setSupportCount(incData.supportCount);
      setTimeline(timelineData);
      setDuplicateCandidates(candidatesData);
      setResolutionEvidence(evidenceData);
      setComments(commentsData);

      if (user) {
        const supported = await incidentService.checkSupportStatus(id);
        setHasSupported(supported);
      }
    } catch (err) {
      console.error('Failed to load incident details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidentData();
  }, [id, user]);

  const handleSupportToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!incident) return;

    try {
      const res = await incidentService.toggleSupport(incident.id);
      setHasSupported(res.supported);
      setSupportCount((prev) => (res.supported ? prev + 1 : Math.max(0, prev - 1)));
    } catch (err) {
      console.error('Failed to toggle support', err);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incident || !newComment.trim()) return;

    if (!user) {
      navigate('/login');
      return;
    }

    setSubmittingComment(true);
    try {
      const added = await incidentService.addComment(incident.id, newComment.trim(), isInternalNote);
      setComments((prev) => [...prev, added]);
      setNewComment('');
      setIsInternalNote(false);
    } catch (err) {
      console.error('Failed to post comment', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        <p className="text-xs font-medium text-slate-500">Loading incident details & timeline...</p>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-navy-900">Incident Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested civic issue record could not be located or may have been archived.
        </p>
        <Link to="/explore" className="inline-block mt-3 text-xs font-bold text-brand-600 hover:underline">
          Return to Explore
        </Link>
      </div>
    );
  }

  const isClosedOrAwaiting =
    incident.status === 'RESOLVED_AWAITING_VERIFICATION' || incident.status === 'CLOSED';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link
          to="/explore"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Incidents
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
        >
          <Share2 className="w-3.5 h-3.5 text-brand-600" />
          <span>{copiedLink ? 'Copied Link!' : 'Share Issue'}</span>
        </button>
      </div>

      {/* Merged Incident Notice if applicable */}
      {incident.mergedIntoNumber && (
        <div className="p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-indigo-700 shrink-0" />
            <div>
              <p className="text-xs font-bold text-indigo-900">
                This report was merged into surviving primary incident {incident.mergedIntoNumber}
              </p>
              <p className="text-[11px] text-indigo-700">
                Support endorsements and resolution tracking have been unified under the master report.
              </p>
            </div>
          </div>
          <Link
            to={`/incidents/${incident.mergedIntoId}`}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shrink-0"
          >
            Go to Primary Incident
          </Link>
        </div>
      )}

      {/* Main Incident Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-slate-700 text-sm">
              {incident.incidentNumber}
            </span>
            {incident.officialReferenceNumber && (
              <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-xs border border-slate-200">
                Ref: {incident.officialReferenceNumber}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>
              Reported on {new Date(incident.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight leading-snug">
            {incident.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <StatusBadge status={incident.status} size="lg" />
            <PriorityBadge priority={incident.priority} />
            <CategoryBadge category={incident.category} />
          </div>
        </div>

        {/* Action Bar (Support endorsement & Staff controls) */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSupportToggle}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs ${
                hasSupported
                  ? 'bg-brand-600 text-white shadow-brand-500/25 ring-2 ring-brand-500/20'
                  : 'bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${hasSupported ? 'fill-current' : ''}`} />
              <span>{hasSupported ? 'Supported by You' : 'Support / Endorse'}</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-md bg-white/20 text-xs">
                {supportCount}
              </span>
            </button>

            <span className="text-xs text-slate-500">
              {supportCount === 1 ? '1 community endorsement' : `${supportCount} community endorsements`}
            </span>
          </div>

          {/* Administrative Actions */}
          {(isModerator || isOperations) && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStatusModalOpen(true)}
                className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Wrench className="w-3.5 h-3.5" />
                Manage Status & Triage
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Possible Duplicates Warning Panel */}
      {duplicateCandidates.length > 0 && (
        <DuplicateSuggestionPanel
          candidates={duplicateCandidates}
          onSupportExisting={handleSupportToggle}
        />
      )}

      {/* Grid: Left Column (Photo, Description, Resolution Evidence) | Right Column (Location, AI Triage, Timeline) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2-Columns */}
        <div className="lg:col-span-2 space-y-8">
          {/* Photograph gallery */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Primary Photographic Evidence
            </h2>

            {incident.primaryPhotoUrl ? (
              <div className="rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 max-h-[460px] flex items-center justify-center">
                <img
                  src={incident.primaryPhotoUrl}
                  alt={incident.title}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="h-44 rounded-2xl bg-slate-50 border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 text-xs">
                <span>No initial photographic evidence submitted for this incident.</span>
              </div>
            )}

            <div className="pt-2 text-xs text-slate-500 flex items-center justify-between">
              <span>Submitted by: <strong>{incident.reporterName}</strong></span>
              {incident.assignedTeam && (
                <span>Assigned Unit: <strong>{incident.assignedTeam}</strong></span>
              )}
            </div>
          </div>

          {/* Detailed Description */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Problem Description & Observations
            </h2>

            <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
              {incident.description}
            </p>
          </div>

          {/* Resolution Evidence Card (If resolved or awaiting verification) */}
          {resolutionEvidence && (
            <ResolutionEvidenceCard
              evidence={resolutionEvidence}
              canReview={Boolean(user)}
              onVerify={() => {
                setVerificationType('CONFIRMATION');
                setVerificationModalOpen(true);
              }}
              onDispute={() => {
                setVerificationType('DISPUTE');
                setVerificationModalOpen(true);
              }}
            />
          )}

          {/* Public Discussion & Operational Updates */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-navy-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-brand-600" />
                Community Updates & Discussion ({comments.length})
              </h2>
            </div>

            {/* Comment list */}
            <div className="space-y-3">
              {comments.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs">
                  No comments yet. Have an update on this issue? Post below.
                </div>
              ) : (
                comments.map((comm) => (
                  <div
                    key={comm.id}
                    className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                      comm.isInternal
                        ? 'bg-amber-50/70 border-amber-300'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <strong className="text-navy-900">{comm.authorName}</strong>
                        {comm.isInternal ? (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 font-bold flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            Internal Operations Note
                          </span>
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">
                            {comm.authorRole.replace('ROLE_', '')}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(comm.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-slate-700 leading-relaxed font-normal">
                      {comm.commentText}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Post comment form */}
            <form onSubmit={handleAddComment} className="space-y-3 pt-3 border-t border-slate-100">
              <textarea
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={
                  user
                    ? 'Post a public status update, sighting observation, or community feedback...'
                    : 'Log in to join the conversation and post updates...'
                }
                disabled={!user || submittingComment}
                className="w-full text-xs p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-slate-100"
                required
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                {(isModerator || isOperations) && (
                  <label className="flex items-center gap-2 text-xs font-semibold text-amber-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInternalNote}
                      onChange={(e) => setIsInternalNote(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>Mark as Internal Staff Note (Hidden from citizens)</span>
                  </label>
                )}

                <div className="ml-auto">
                  <button
                    type="submit"
                    disabled={!user || submittingComment || !newComment.trim()}
                    className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    {submittingComment ? 'Posting...' : 'Post Update'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right 1-Column: Location, AI Analysis & Timeline */}
        <div className="space-y-8">
          {/* Location Map Preview */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-600" />
                Geographic Location
              </h2>
              {incident.isApproximateLocation && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                  Approximate
                </span>
              )}
            </div>

            <div className="h-48 rounded-xl overflow-hidden border border-slate-200">
              <IncidentMap
                markers={[
                  {
                    id: incident.id,
                    incidentNumber: incident.incidentNumber,
                    title: incident.title,
                    category: incident.category,
                    status: incident.status,
                    priority: incident.priority,
                    latitude: incident.latitude,
                    longitude: incident.longitude,
                    isApproximateLocation: incident.isApproximateLocation,
                    supportCount: incident.supportCount,
                    createdAt: incident.createdAt,
                  },
                ]}
                center={[incident.latitude, incident.longitude]}
                zoom={15}
                height="100%"
              />
            </div>

            <div className="text-xs space-y-1 text-slate-600">
              {incident.address && (
                <p>
                  <strong>Address:</strong> {incident.address}
                </p>
              )}
              {incident.landmark && (
                <p>
                  <strong>Landmark:</strong> {incident.landmark}
                </p>
              )}
              <p className="font-mono text-[11px] text-slate-400">
                GPS: {incident.latitude.toFixed(4)}, {incident.longitude.toFixed(4)}
              </p>
            </div>
          </div>

          {/* AI-Assisted Triage & Classification Card */}
          <div className="bg-gradient-to-br from-brand-50/70 via-white to-indigo-50/50 rounded-3xl p-6 border border-brand-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider">
                  AI Triage & Classification
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold">
                {incident.aiSimulated ? 'Deterministic NLP' : 'Vision Model'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-brand-100/60">
                <span className="text-slate-500">Suggested Priority:</span>
                <span className="font-bold text-navy-900">
                  {incident.aiSuggestedPriority || incident.priority}
                </span>
              </div>

              {incident.aiConfidence && (
                <div className="flex justify-between items-center py-1 border-b border-brand-100/60">
                  <span className="text-slate-500">Model Confidence:</span>
                  <span className="font-bold text-emerald-700">
                    {(incident.aiConfidence * 100).toFixed(0)}%
                  </span>
                </div>
              )}

              {incident.priorityReason && (
                <div className="pt-1">
                  <span className="text-[11px] font-bold text-slate-500 block mb-1">
                    Risk Assessment Explanation:
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed italic bg-white/70 p-3 rounded-xl border border-brand-100">
                    "{incident.priorityReason}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Public Accountability Timeline */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Accountability Timeline
            </h2>
            <IncidentTimeline events={timeline} />
          </div>
        </div>
      </div>

      {/* Citizen Verification Modal */}
      {resolutionEvidence && (
        <CitizenVerificationModal
          isOpen={verificationModalOpen}
          onClose={() => setVerificationModalOpen(false)}
          resolutionEvidenceId={resolutionEvidence.id}
          defaultType={verificationType}
          onSuccess={fetchIncidentData}
        />
      )}

      {/* Status Transition Modal for authorized staff/moderators */}
      {statusModalOpen && (
        <StatusTransitionModal
          isOpen={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          incident={incident}
          onSuccess={fetchIncidentData}
        />
      )}
    </div>
  );
};
