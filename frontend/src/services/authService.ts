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
    const res = await api.post<ApiResponse<AuthResponseData>>('/auth/login', params);
    return res.data.data;
  },

  register: async (params: RegisterParams): Promise<AuthResponseData> => {
    const res = await api.post<ApiResponse<AuthResponseData>>('/auth/register', params);
    return res.data.data;
  },

  getMe: async (): Promise<User> => {
    const res = await api.get<ApiResponse<User>>('/auth/me');
    return res.data.data;
  },
};
