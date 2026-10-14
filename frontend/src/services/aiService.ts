import api from './api';
import { AiAnalysisResult, ApiResponse, IncidentCategory } from '../types';

export const aiService = {
  analyze: async (
    title: string,
    description: string,
    userSelectedCategory?: IncidentCategory,
    photoUrl?: string
  ): Promise<AiAnalysisResult> => {
    const res = await api.post<ApiResponse<AiAnalysisResult>>('/ai/analyze', {
      title,
      description,
      userSelectedCategory,
      photoUrl,
    });
    return res.data.data;
  },
};
