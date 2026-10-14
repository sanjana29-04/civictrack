import api from './api';
import {
  ApiResponse,
  Incident,
  IncidentCategory,
  IncidentMapMarker,
  IncidentPriority,
  IncidentStatus,
  PageResponse,
  TimelineEvent,
  Comment
} from '../types';

export interface ExploreParams {
  category?: IncidentCategory;
  status?: IncidentStatus;
  priority?: IncidentPriority;
  search?: string;
  team?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'asc' | 'desc';
}

export interface CreateIncidentPayload {
  title: string;
  description: string;
  category: IncidentCategory;
  latitude: number;
  longitude: number;
  address?: string;
  landmark?: string;
  isApproximateLocation?: boolean;
  primaryPhotoUrl?: string;
}

export interface UpdateStatusPayload {
  status: IncidentStatus;
  priority?: IncidentPriority;
  category?: IncidentCategory;
  reason: string;
  officialReferenceNumber?: string;
}

export interface AssignPayload {
  assignedTeam: string;
  assignedStaffId?: string;
  notes?: string;
}

export const incidentService = {
  explore: async (params: ExploreParams): Promise<PageResponse<Incident>> => {
    const res = await api.get<ApiResponse<PageResponse<Incident>>>('/incidents/explore', { params });
    return res.data.data;
  },

  getMapMarkers: async (): Promise<IncidentMapMarker[]> => {
    const res = await api.get<ApiResponse<IncidentMapMarker[]>>('/incidents/map');
    return res.data.data;
  },

  getById: async (id: string): Promise<Incident> => {
    const res = await api.get<ApiResponse<Incident>>(`/incidents/${id}`);
    return res.data.data;
  },

  create: async (payload: CreateIncidentPayload): Promise<Incident> => {
    const res = await api.post<ApiResponse<Incident>>('/incidents', payload);
    return res.data.data;
  },

  getMyReports: async (page = 0, size = 10): Promise<PageResponse<Incident>> => {
    const res = await api.get<ApiResponse<PageResponse<Incident>>>('/incidents/my-reports', {
      params: { page, size },
    });
    return res.data.data;
  },

  getTimeline: async (incidentId: string): Promise<TimelineEvent[]> => {
    const res = await api.get<ApiResponse<TimelineEvent[]>>(`/incidents/${incidentId}/timeline`);
    return res.data.data;
  },

  updateStatus: async (incidentId: string, payload: UpdateStatusPayload): Promise<Incident> => {
    const res = await api.patch<ApiResponse<Incident>>(`/incidents/${incidentId}/status`, payload);
    return res.data.data;
  },

  assign: async (incidentId: string, payload: AssignPayload): Promise<Incident> => {
    const res = await api.post<ApiResponse<Incident>>(`/incidents/${incidentId}/assign`, payload);
    return res.data.data;
  },

  getComments: async (incidentId: string): Promise<Comment[]> => {
    const res = await api.get<ApiResponse<Comment[]>>(`/incidents/${incidentId}/comments`);
    return res.data.data;
  },

  addComment: async (incidentId: string, commentText: string, isInternal = false): Promise<Comment> => {
    const res = await api.post<ApiResponse<Comment>>(`/incidents/${incidentId}/comments`, {
      commentText,
      isInternal,
    });
    return res.data.data;
  },

  uploadPhoto: async (file: File): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post<ApiResponse<{ url: string; filename: string }>>('/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  toggleSupport: async (incidentId: string): Promise<{ supported: boolean }> => {
    const res = await api.post<ApiResponse<{ supported: boolean }>>(`/incidents/${incidentId}/support`);
    return res.data.data;
  },

  checkSupportStatus: async (incidentId: string): Promise<boolean> => {
    try {
      const res = await api.get<ApiResponse<{ supported: boolean }>>(`/incidents/${incidentId}/support/status`);
      return res.data.data.supported;
    } catch {
      return false;
    }
  },
};
