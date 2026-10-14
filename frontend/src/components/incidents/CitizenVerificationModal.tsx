import React, { useState } from 'react';
import { resolutionService } from '../../services/resolutionService';
import { incidentService } from '../../services/incidentService';
import { CheckCircle2, AlertTriangle, Upload, X, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  resolutionEvidenceId: string;
  defaultType?: 'CONFIRMATION' | 'DISPUTE';
  onSuccess: () => void;
}

export const CitizenVerificationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  resolutionEvidenceId,
  defaultType = 'CONFIRMATION',
  onSuccess,
}) => {
  const [reviewType, setReviewType] = useState<'CONFIRMATION' | 'DISPUTE'>(defaultType);
  const [comment, setComment] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const res = await incidentService.uploadPhoto(file);
      setEvidenceUrl(res.url);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload photo evidence');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please provide comments or details for your review.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await resolutionService.submitReview({
        resolutionEvidenceId,
        reviewType,
        comment: comment.trim(),
        evidenceUrl: evidenceUrl || undefined,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            {reviewType === 'CONFIRMATION' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            )}
            <h3 className="text-base font-bold text-navy-900">
              {reviewType === 'CONFIRMATION' ? 'Confirm Issue Resolution' : 'Challenge Resolution'}
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
          {/* Review Type Selection */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setReviewType('CONFIRMATION')}
              className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                reviewType === 'CONFIRMATION'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs ring-2 ring-emerald-500/20'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Confirm Fixed</span>
            </button>

            <button
              type="button"
              onClick={() => setReviewType('DISPUTE')}
              className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                reviewType === 'DISPUTE'
                  ? 'bg-rose-50 border-rose-500 text-rose-800 shadow-xs ring-2 ring-rose-500/20'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <span>Challenge / Not Fixed</span>
            </button>
          </div>

          {/* Explanation Comment */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              {reviewType === 'CONFIRMATION' ? 'Confirmation Feedback' : 'Reason for Challenge & What Remains Unfixed'}
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                reviewType === 'CONFIRMATION'
                  ? 'E.g., Visited the site this morning and verified the pothole is fully filled and smoothed.'
                  : 'E.g., The leak was patched with temporary tape but is still leaking on the sidewalk.'
              }
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>

          {/* Photo upload for dispute */}
          {reviewType === 'DISPUTE' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Attach New Photo Proof (Recommended for dispute verification)
              </label>

              {evidenceUrl ? (
                <div className="relative h-28 rounded-xl overflow-hidden border border-slate-200">
                  <img src={evidenceUrl} alt="Dispute evidence" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setEvidenceUrl('')}
                    className="absolute top-2 right-2 p-1 rounded-full bg-navy-950/80 text-white hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-slate-300 hover:border-brand-400 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex flex-col items-center justify-center text-xs text-slate-500">
                    {uploading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
                    ) : (
                      <>
                        <Upload className="w-5 h-5 mb-1 text-slate-400" />
                        <span>Upload photo showing ongoing problem</span>
                      </>
                    )}
                  </div>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              )}
            </div>
          )}

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
              disabled={submitting || uploading}
              className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-sm flex items-center gap-1.5 ${
                reviewType === 'CONFIRMATION'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {reviewType === 'CONFIRMATION' ? 'Submit Confirmation' : 'Submit Challenge'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
