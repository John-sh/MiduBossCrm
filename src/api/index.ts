import type { Summary, SummaryDetail, Reminder, Settings, DashboardStats, ReminderStatistics, GetSummariesParams, GetRemindersParams, PageResponse, GroupConfig } from '@/types';
import { mockSummaries, mockSummaryDetails, mockReminders, mockSettings, mockDashboardStats, mockReminderStatistics, mockGroups } from '@/data/mockData';

export const api = {
  dashboard: {
    getStats: async (): Promise<DashboardStats> => {
      await delay(300);
      return mockDashboardStats;
    },
  },

  summaries: {
    list: async (params?: GetSummariesParams): Promise<PageResponse<Summary>> => {
      await delay(300);
      let data = [...mockSummaries];

      if (params?.dateStart) {
        data = data.filter(s => s.date >= params.dateStart);
      }
      if (params?.dateEnd) {
        data = data.filter(s => s.date <= params.dateEnd);
      }
      if (params?.groupId) {
        data = data.filter(s => s.groupId === params.groupId);
      }
      if (params?.tags && params.tags.length > 0) {
        data = data.filter(s => params.tags!.some(tag => s.tags.includes(tag)));
      }

      const page = params?.page || 1;
      const pageSize = params?.pageSize || 10;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;

      return {
        data: data.slice(start, end),
        total: data.length,
        page,
        pageSize,
      };
    },

    get: async (id: string): Promise<SummaryDetail | null> => {
      await delay(300);
      return mockSummaryDetails[id] || null;
    },
  },

  reminders: {
    list: async (params?: GetRemindersParams): Promise<PageResponse<Reminder>> => {
      await delay(300);
      let data = [...mockReminders];

      if (params?.dateStart) {
        data = data.filter(r => r.triggeredAt >= params.dateStart);
      }
      if (params?.dateEnd) {
        data = data.filter(r => r.triggeredAt <= params.dateEnd);
      }
      if (params?.groupId) {
        data = data.filter(r => r.groupId === params.groupId);
      }
      if (params?.status) {
        data = data.filter(r => r.status === params.status);
      }

      const page = params?.page || 1;
      const pageSize = params?.pageSize || 10;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;

      return {
        data: data.slice(start, end),
        total: data.length,
        page,
        pageSize,
      };
    },

    getStatistics: async (): Promise<ReminderStatistics> => {
      await delay(300);
      return mockReminderStatistics;
    },

    process: async (id: string): Promise<{ success: boolean; message: string }> => {
      await delay(300);
      return { success: true, message: '已处理' };
    },
  },

  settings: {
    get: async (): Promise<Settings> => {
      await delay(300);
      return mockSettings;
    },

    update: async (settings: Partial<Settings>): Promise<{ success: boolean; message: string }> => {
      await delay(300);
      return { success: true, message: '配置更新成功' };
    },

    addGroup: async (group: Omit<GroupConfig, 'enabled'>): Promise<{ success: boolean; message: string }> => {
      await delay(300);
      return { success: true, message: '群添加成功' };
    },

    deleteGroup: async (groupId: string): Promise<{ success: boolean; message: string }> => {
      await delay(300);
      return { success: true, message: '群删除成功' };
    },

    toggleGroup: async (groupId: string, enabled: boolean): Promise<{ success: boolean; message: string }> => {
      await delay(300);
      return { success: true, message: enabled ? '群已启用' : '群已禁用' };
    },
  },

  groups: {
    list: async (): Promise<GroupConfig[]> => {
      await delay(300);
      return mockGroups;
    },
  },
};

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}