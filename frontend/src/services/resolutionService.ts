import api from './api';
import { ApiResponse, ResolutionEvidence } from '../types';

export interface ProposeResolutionPayload {
  incidentId: string;
  resolutionSummary: string;
  internalNotes?: string;
  beforePhotoUrl?: string;
  afterPhotoUrl: string;
  workOrderReference?: string;
}

export interface CitizenReviewPayload {
  resolutionEvidenceId: string;
  reviewType: 'CONFIRMATION' | 'DISPUTE';
  comment: string;
  evidenceUrl?: string;
}

export const resolutionService = {
  propose: async (payload: ProposeResolutionPayload): Promise<string> => {
    const res = await api.post<ApiResponse<string>>('/resolution/propose', payload);
    return res.data.message;
  },

  submitReview: async (payload: CitizenReviewPayload): Promise<string> => {
    const res = await api.post<ApiResponse<string>>('/resolution/review', payload);
    return res.data.message;
  },

  getEvidence: async (incidentId: string): Promise<ResolutionEvidence | null> => {
    const res = await api.get<ApiResponse<ResolutionEvidence>>(`/resolution/incident/${incidentId}`);
    return res.data.data;
  },
};
