export type Role = 'ROLE_CITIZEN' | 'ROLE_MODERATOR' | 'ROLE_OPERATIONS';

export type IncidentCategory =
  | 'ROADS_POTHOLES'
  | 'GARBAGE_SANITATION'
  | 'STREETLIGHTS'
  | 'DRAINAGE_WATERLOGGING'
  | 'WATER_SUPPLY_LEAKAGE'
  | 'FOOTPATHS_ACCESSIBILITY'
  | 'PUBLIC_PROPERTY_DAMAGE'
  | 'OTHER';

export type IncidentStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'CONFIRMED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLUTION_PROPOSED'
  | 'RESOLVED_AWAITING_VERIFICATION'
  | 'REOPENED'
  | 'CLOSED'
  | 'REJECTED';

export type IncidentPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: Role;
  createdAt: string;
}

export interface Incident {
  id: string;
  incidentNumber: string;
  title: string;
  description: string;
  category: IncidentCategory;
  categoryDisplayName: string;
  status: IncidentStatus;
  statusDisplayName: string;
  priority: IncidentPriority;
  priorityReason?: string;
  aiSuggestedCategory?: IncidentCategory;
  aiSuggestedPriority?: IncidentPriority;
  aiPriorityReason?: string;
  aiConfidence?: number;
  aiSimulated?: boolean;
  latitude: number;
  longitude: number;
  address?: string;
  landmark?: string;
  isApproximateLocation: boolean;
  primaryPhotoUrl?: string;
  reporterId: string;
  reporterName: string;
  assignedTeam?: string;
  assignedStaffName?: string;
  supportCount: number;
  duplicateCount: number;
  mergedIntoId?: string;
  mergedIntoNumber?: string;
  officialReferenceNumber?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
}

export interface IncidentMapMarker {
  id: string;
  incidentNumber: string;
  title: string;
  category: IncidentCategory;
  status: IncidentStatus;
  priority: IncidentPriority;
  latitude: number;
  longitude: number;
  isApproximateLocation: boolean;
  primaryPhotoUrl?: string;
  supportCount: number;
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  eventType: string;
  actorName: string;
  actorRole: string;
  details: string;
  evidenceUrl?: string;
  isPublic: boolean;
  createdAt: string;
}

export interface DuplicateCandidate {
  id: string;
  candidateIncidentId: string;
  candidateIncidentNumber: string;
  candidateTitle: string;
  candidateDescription: string;
  candidateCategory: IncidentCategory;
  candidateStatus: IncidentStatus;
  candidateLatitude: number;
  candidateLongitude: number;
  candidatePhotoUrl?: string;
  candidateSupportCount: number;
  candidateCreatedAt: string;
  distanceMeters: number;
  textSimilarityScore: number;
  categoryMatch: boolean;
  overallConfidenceScore: number;
  matchReason: string;
  status: 'PENDING_REVIEW' | 'CONFIRMED_DUPLICATE' | 'DISMISSED';
}

export interface ResolutionReviewItem {
  id: string;
  reviewerName: string;
  reviewType: 'CONFIRMATION' | 'DISPUTE';
  comment: string;
  evidenceUrl?: string;
  createdAt: string;
}

export interface ResolutionEvidence {
  id: string;
  incidentId: string;
  proposedByName: string;
  resolutionSummary: string;
  beforePhotoUrl?: string;
  afterPhotoUrl: string;
  workOrderReference?: string;
  confirmationCount: number;
  disputeCount: number;
  proposedAt: string;
  verifiedAt?: string;
  reviews: ResolutionReviewItem[];
}

export interface Comment {
  id: string;
  authorName: string;
  authorRole: string;
  commentText: string;
  isInternal: boolean;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  incidentId?: string;
  notificationType: string;
  isRead: boolean;
  createdAt: string;
}

export interface CategoryMetric {
  category: string;
  displayName: string;
  count: number;
  percentage: number;
}

export interface StatusMetric {
  status: string;
  displayName: string;
  count: number;
}

export interface PriorityMetric {
  priority: string;
  count: number;
}

export interface HotspotArea {
  areaName: string;
  latitude: number;
  longitude: number;
  incidentCount: number;
  primaryCategory: string;
}

export interface CivicAnalytics {
  totalIncidents: number;
  openIncidents: number;
  inProgressIncidents: number;
  awaitingVerificationCount: number;
  resolvedAndClosedCount: number;
  reopenedCount: number;
  duplicateMergedCount: number;
  resolutionConfirmationRatePercent: number;
  averageResolutionDays: number;
  categoryDistribution: CategoryMetric[];
  statusDistribution: StatusMetric[];
  priorityDistribution: PriorityMetric[];
  recurringHotspots: HotspotArea[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface AiAnalysisResult {
  suggestedCategory: IncidentCategory;
  executiveSummary: string;
  safetyConcerns: string[];
  suggestedPriority: IncidentPriority;
  priorityReasoning: string;
  missingInformationSuggestions: string[];
  humanReviewRecommended: boolean;
  confidenceScore: number;
  isSimulated: boolean;
  providerName: string;
}
