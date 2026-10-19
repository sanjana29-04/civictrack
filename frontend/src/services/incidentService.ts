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
    try {
      const res = await api.post<ApiResponse<Incident>>('/incidents', payload);
      return res.data.data;
    } catch {
      const newInc: Incident = {
        id: 'inc-user-' + Date.now(),
        incidentNumber: 'CIV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
        title: payload.title,
        description: payload.description,
        category: payload.category,
        categoryDisplayName: payload.category.replace(/_/g, ' '),
        status: 'SUBMITTED',
        statusDisplayName: 'Submitted',
        priority: 'MEDIUM',
        latitude: payload.latitude,
        longitude: payload.longitude,
        address: payload.address,
        landmark: payload.landmark,
        isApproximateLocation: payload.isApproximateLocation ?? false,
        primaryPhotoUrl: payload.primaryPhotoUrl || '/incidents/pothole_real.jpg',
        reporterId: 'user-current-session',
        reporterName: 'You (Citizen Reporter)',
        supportCount: 1,
        duplicateCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      PAN_INDIA_INCIDENTS.unshift(newInc as any);
      return newInc;
    }
  },

  getMyReports: async (page = 0, size = 10): Promise<PageResponse<Incident>> => {
    try {
      const res = await api.get<ApiResponse<PageResponse<Incident>>>('/incidents/my-reports', {
        params: { page, size },
      });
      return res.data.data;
    } catch {
      const userReports = PAN_INDIA_INCIDENTS.slice(0, 3);
      return {
        content: userReports,
        pageNumber: 0,
        pageSize: size,
        totalElements: userReports.length,
        totalPages: 1,
        last: true,
      };
    }
  },

  getTimeline: async (incidentId: string): Promise<TimelineEvent[]> => {
    try {
      const res = await api.get<ApiResponse<TimelineEvent[]>>(`/incidents/${incidentId}/timeline`);
      return res.data.data;
    } catch {
      return [
        {
          id: 'evt-1',
          eventType: 'REPORT_SUBMITTED',
          actorName: 'Citizen Reporter',
          actorRole: 'ROLE_CITIZEN',
          details: 'Civic issue report created with mobile GPS coordinates and photograph.',
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          isPublic: true,
        },
        {
          id: 'evt-2',
          eventType: 'REVIEW_COMPLETED',
          actorName: 'Pooja Iyer',
          actorRole: 'ROLE_MODERATOR',
          details: 'AI priority triage verified by civic moderation team. Forwarded to zone maintenance dispatch.',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          isPublic: true,
        },
      ];
    }
  },

  updateStatus: async (incidentId: string, payload: UpdateStatusPayload): Promise<Incident> => {
    try {
      const res = await api.patch<ApiResponse<Incident>>(`/incidents/${incidentId}/status`, payload);
      return res.data.data;
    } catch {
      const inc = PAN_INDIA_INCIDENTS.find((i) => i.id === incidentId);
      if (inc) {
        inc.status = payload.status;
        if (payload.priority) inc.priority = payload.priority;
        return inc;
      }
      throw new Error('Incident not found');
    }
  },

  assign: async (incidentId: string, payload: AssignPayload): Promise<Incident> => {
    try {
      const res = await api.post<ApiResponse<Incident>>(`/incidents/${incidentId}/assign`, payload);
      return res.data.data;
    } catch {
      const inc = PAN_INDIA_INCIDENTS.find((i) => i.id === incidentId);
      if (inc) {
        inc.assignedTeam = payload.assignedTeam;
        inc.status = 'IN_PROGRESS';
        return inc;
      }
      throw new Error('Incident not found');
    }
  },

  getComments: async (incidentId: string): Promise<Comment[]> => {
    try {
      const res = await api.get<ApiResponse<Comment[]>>(`/incidents/${incidentId}/comments`);
      return res.data.data;
    } catch {
      return [
        {
          id: 'c-1',
          authorName: 'Aarav Sharma',
          authorRole: 'CITIZEN',
          commentText: 'Spotted this on my morning commute. Road crater has deepened significantly after yesterday’s rain.',
          isInternal: false,
          createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
      ];
    }
  },

  addComment: async (incidentId: string, commentText: string, isInternal = false): Promise<Comment> => {
    try {
      const res = await api.post<ApiResponse<Comment>>(`/incidents/${incidentId}/comments`, {
        commentText,
        isInternal,
      });
      return res.data.data;
    } catch {
      return {
        id: 'c-' + Date.now(),
        authorName: 'You (Citizen)',
        authorRole: 'CITIZEN',
        commentText,
        isInternal,
        createdAt: new Date().toISOString(),
      };
    }
  },

  uploadPhoto: async (file: File): Promise<{ url: string; filename: string }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post<ApiResponse<{ url: string; filename: string }>>('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.data;
    } catch {
      return {
        url: URL.createObjectURL(file),
        filename: file.name,
      };
    }
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
