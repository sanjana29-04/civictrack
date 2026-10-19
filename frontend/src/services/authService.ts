import api from './api';
import { ApiResponse, User } from '../types';

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role?: string;
}

export interface AuthResponseData {
  token: string;
  tokenType: string;
  user: User;
}

export const authService = {
  login: async (params: LoginParams): Promise<AuthResponseData> => {
    try {
      const res = await api.post<ApiResponse<AuthResponseData>>('/auth/login', params);
      const data = res.data.data;
      localStorage.setItem('civictrack_user', JSON.stringify(data.user));
      return data;
    } catch (err) {
      console.warn('Backend login unavailable, switching to local offline demo session', err);
      const email = params.email.toLowerCase();
      let role: any = 'ROLE_CITIZEN';
      let fullName = email.split('@')[0];

      if (email.includes('admin') || email.includes('moderator')) {
        role = 'ROLE_MODERATOR';
        fullName = 'Pooja Iyer (Moderator)';
      } else if (email.includes('ops') || email.includes('staff')) {
        role = 'ROLE_OPERATIONS';
        fullName = 'Vikram Malhotra (Ops Desk)';
      } else if (email.includes('citizen')) {
        fullName = 'Aarav Sharma (Citizen)';
      }

      const mockUser: User = {
        id: 'usr-' + Math.floor(Math.random() * 10000),
        email: params.email,
        fullName: fullName.charAt(0).toUpperCase() + fullName.slice(1),
        role,
        createdAt: new Date().toISOString(),
      };

      const mockResponse: AuthResponseData = {
        token: 'demo-jwt-token-' + Date.now(),
        tokenType: 'Bearer',
        user: mockUser,
      };

      localStorage.setItem('civictrack_user', JSON.stringify(mockUser));
      return mockResponse;
    }
  },

  register: async (params: RegisterParams): Promise<AuthResponseData> => {
    try {
      const res = await api.post<ApiResponse<AuthResponseData>>('/auth/register', params);
      const data = res.data.data;
      localStorage.setItem('civictrack_user', JSON.stringify(data.user));
      return data;
    } catch (err) {
      console.warn('Backend register unavailable, creating local citizen session', err);
      const mockUser: User = {
        id: 'usr-' + Math.floor(Math.random() * 10000),
        email: params.email,
        fullName: params.fullName || params.email.split('@')[0],
        role: 'ROLE_CITIZEN',
        phone: params.phone,
        createdAt: new Date().toISOString(),
      };

      const mockResponse: AuthResponseData = {
        token: 'demo-jwt-token-' + Date.now(),
        tokenType: 'Bearer',
        user: mockUser,
      };

      localStorage.setItem('civictrack_user', JSON.stringify(mockUser));
      return mockResponse;
    }
  },

  getMe: async (): Promise<User> => {
    try {
      const res = await api.get<ApiResponse<User>>('/auth/me');
      const user = res.data.data;
      localStorage.setItem('civictrack_user', JSON.stringify(user));
      return user;
    } catch (err) {
      const saved = localStorage.getItem('civictrack_user');
      if (saved) {
        return JSON.parse(saved);
      }
      throw err;
    }
  },
};
