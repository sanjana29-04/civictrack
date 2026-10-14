import api from './api';
import { ApiResponse, DuplicateCandidate, IncidentCategory, PageResponse } from '../types';

export const duplicateService = {
  checkRealtime: async (
    latitude: number,
    longitude: number,
    category?: IncidentCategory,
    title = '',
    description = ''
  ): Promise<DuplicateCandidate[]> => {
    const res = await api.get<ApiResponse<DuplicateCandidate[]>>('/duplicates/check-realtime', {
      params: { latitude, longitude, category, title, description },
    });
    return res.data.data;
  },

  getPendingCandidates: async (page = 0, size = 10): Promise<PageResponse<DuplicateCandidate>> => {
    const res = await api.get<ApiResponse<PageResponse<DuplicateCandidate>>>('/duplicates/candidates', {
      params: { page, size },
    });
    return res.data.data;
  },

  getCandidatesForIncident: async (incidentId: string): Promise<DuplicateCandidate[]> => {
    const res = await api.get<ApiResponse<DuplicateCandidate[]>>(`/duplicates/incident/${incidentId}`);
    return res.data.data;
  },

  merge: async (survivingIncidentId: string, duplicateIncidentId: string, reason: string): Promise<string> => {
    const res = await api.post<ApiResponse<string>>('/duplicates/merge', {
      survivingIncidentId,
      duplicateIncidentId,
      reason,
    });
    return res.data.message;
  },

  dismiss: async (candidateId: string): Promise<string> => {
    const res = await api.post<ApiResponse<string>>(`/duplicates/dismiss/${candidateId}`);
    return res.data.message;
  },
};
