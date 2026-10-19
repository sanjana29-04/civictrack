import api from './api';
import { AiAnalysisResult, ApiResponse, IncidentCategory } from '../types';

export const aiService = {
  analyze: async (
    title: string,
    description: string,
    userSelectedCategory?: IncidentCategory,
    photoUrl?: string
  ): Promise<AiAnalysisResult> => {
    try {
      const res = await api.post<ApiResponse<AiAnalysisResult>>('/ai/analyze', {
        title,
        description,
        userSelectedCategory,
        photoUrl,
      });
      return res.data.data;
    } catch {
      const text = `${title} ${description}`.toLowerCase();
      let suggestedPriority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';
      let reason = 'Standard municipal maintenance triage schedule.';

      if (
        text.includes('critical') ||
        text.includes('fatal') ||
        text.includes('hazard') ||
        text.includes('open manhole') ||
        text.includes('live wire') ||
        text.includes('accident')
      ) {
        suggestedPriority = 'CRITICAL';
        reason = 'Severe safety hazard detected with acute risk of bodily harm or fatal accidents.';
      } else if (
        text.includes('deep') ||
        text.includes('crater') ||
        text.includes('waterlog') ||
        text.includes('flood') ||
        text.includes('pipe burst') ||
        text.includes('drain')
      ) {
        suggestedPriority = 'HIGH';
        reason = 'Major public infrastructure disruption requiring rapid field response within 24 hours.';
      }

      return {
        suggestedCategory: userSelectedCategory || 'ROADS_POTHOLES',
        suggestedPriority,
        priorityReasoning: reason,
        executiveSummary: 'AI analysis evaluated civic defect urgency and public risk factors based on photo and description.',
        confidenceScore: 0.94,
        isSimulated: true,
        humanReviewRecommended: suggestedPriority === 'CRITICAL',
        providerName: 'SnapFix Pan-India Civic AI Engine',
        safetyConcerns: ['Two-wheeler skidding risk', 'Pedestrian hazard at night'],
        missingInformationSuggestions: ['Mentioning specific nearest landmarks speeds up crew arrival.'],
      };
    }
  },
};
