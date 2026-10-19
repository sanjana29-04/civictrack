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
    try {
      const res = await api.get<ApiResponse<DuplicateCandidate[]>>('/duplicates/check-realtime', {
        params: { latitude, longitude, category, title, description },
      });
      return res.data.data;
    } catch {
      return [];
    }
  },

  getPendingCandidates: async (page = 0, size = 10): Promise<PageResponse<DuplicateCandidate>> => {
    try {
      const res = await api.get<ApiResponse<PageResponse<DuplicateCandidate>>>('/duplicates/candidates', {
        params: { page, size },
      });
      return res.data.data;
    } catch {
      return {
        content: [],
        pageNumber: 0,
        pageSize: size,
        totalElements: 0,
        totalPages: 0,
        last: true,
      };
    }
  },

  getCandidatesForIncident: async (incidentId: string): Promise<DuplicateCandidate[]> => {
    try {
      const res = await api.get<ApiResponse<DuplicateCandidate[]>>(`/duplicates/incident/${incidentId}`);
      return res.data.data;
    } catch {
      return [];
    }
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
