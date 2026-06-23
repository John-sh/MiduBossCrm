export interface Summary {
  id: string;
  groupId: string;
  groupName: string;
  date: string;
  content: string;
  tags: string[];
  serviceRating: number;
  unresolvedCount: number;
  createdAt: string;
}

export interface SummaryDetail extends Summary {
  customerQuestions: string;
  handlingProcess: string;
  serviceEvaluation: string;
  relatedMessages: MessagePreview[];
}

export interface MessagePreview {
  id: string;
  senderName: string;
  senderType: 'customer' | 'staff';
  content: string;
  timestamp: string;
}

export interface Reminder {
  id: string;
  groupId: string;
  groupName: string;
  triggeredAt: string;
  notifiedStaff: string;
  customerMessageId: string;
  status: 'pending' | 'processed';
  processedAt?: string;
}

export interface GroupConfig {
  groupId: string;
  groupName: string;
  enabled: boolean;
  staffIds: string[];
}

export interface Settings {
  summaryTime: string;
  reminderTimeout: number;
  reminderCooldown: number;
  monitoredGroups: GroupConfig[];
}

export interface DashboardStats {
  todayConsultations: number;
  avgResponseTime: number;
  resolutionRate: number;
  unresolvedCount: number;
  todayReminders: number;
  summaryCount: number;
}

export interface ReminderStatistics {
  totalCount: number;
  pendingCount: number;
  avgResponseTime: number;
  trendData: { date: string; count: number }[];
}

export interface GetSummariesParams {
  dateStart?: string;
  dateEnd?: string;
  groupId?: string;
  tags?: string[];
  page?: number;
  pageSize?: number;
}

export interface GetRemindersParams {
  dateStart?: string;
  dateEnd?: string;
  groupId?: string;
  status?: 'pending' | 'processed';
  page?: number;
  pageSize?: number;
}

export interface PageResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}