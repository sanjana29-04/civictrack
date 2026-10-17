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

import { PAN_INDIA_INCIDENTS, PAN_INDIA_MARKERS } from '../data/indiaIncidents';

export const incidentService = {
  explore: async (params: ExploreParams): Promise<PageResponse<Incident>> => {
    try {
      const res = await api.get<ApiResponse<PageResponse<Incident>>>('/incidents/explore', { params });
      const serverData = res.data.data;
      if (serverData && serverData.content && serverData.content.length >= 20) {
        return serverData;
      }
      const existingIds = new Set((serverData?.content || []).map((i) => i.id));
      let combined = [...(serverData?.content || [])];
      for (const item of PAN_INDIA_INCIDENTS) {
        if (!existingIds.has(item.id)) {
          combined.push(item);
        }
      }

      if (params.category && (params.category as string) !== 'ALL') {
        combined = combined.filter((i) => i.category === params.category);
      }
      if (params.status && (params.status as string) !== 'ALL') {
        combined = combined.filter((i) => i.status === params.status);
      }
      if (params.priority) {
        combined = combined.filter((i) => i.priority === params.priority);
      }
      if (params.search && params.search.trim()) {
        const q = params.search.toLowerCase();
        combined = combined.filter(
          (i) =>
            i.title.toLowerCase().includes(q) ||
            i.description.toLowerCase().includes(q) ||
            (i.address && i.address.toLowerCase().includes(q)) ||
            (i.landmark && i.landmark.toLowerCase().includes(q))
        );
      }

      const page = params.page || 0;
      const size = params.size || 20;
      const start = page * size;
      const paginated = combined.slice(start, start + size);

      return {
        content: paginated,
        pageNumber: page,
        pageSize: size,
        totalElements: combined.length,
        totalPages: Math.max(1, Math.ceil(combined.length / size)),
        last: start + size >= combined.length,
      };
    } catch {
      let filtered = [...PAN_INDIA_INCIDENTS];
      if (params.category && (params.category as string) !== 'ALL') {
        filtered = filtered.filter((i) => i.category === params.category);
      }
      if (params.status && (params.status as string) !== 'ALL') {
        filtered = filtered.filter((i) => i.status === params.status);
      }
      if (params.search && params.search.trim()) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (i) =>
            i.title.toLowerCase().includes(q) ||
            i.description.toLowerCase().includes(q) ||
            (i.address && i.address.toLowerCase().includes(q)) ||
            (i.landmark && i.landmark.toLowerCase().includes(q))
        );
      }
      return {
        content: filtered,
        pageNumber: 0,
        pageSize: filtered.length,
        totalElements: filtered.length,
        totalPages: 1,
        last: true,
      };
    }
  },

  getMapMarkers: async (): Promise<IncidentMapMarker[]> => {
    try {
      const res = await api.get<ApiResponse<IncidentMapMarker[]>>('/incidents/map');
      const serverMarkers = res.data.data || [];
      const markerMap = new Map<string, IncidentMapMarker>();
      PAN_INDIA_MARKERS.forEach((m) => markerMap.set(m.id, m));
      serverMarkers.forEach((m) => markerMap.set(m.id, m));
      return Array.from(markerMap.values());
    } catch {
      return PAN_INDIA_MARKERS;
    }
  },

  getById: async (id: string): Promise<Incident> => {
    const local = PAN_INDIA_INCIDENTS.find((i) => i.id === id);
    if (local) return local;
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
