import type { Summary, SummaryDetail, Reminder, Settings, DashboardStats, ReminderStatistics, GroupConfig } from '@/types';

const today = new Date().toISOString().split('T')[0];

export const mockGroups: GroupConfig[] = [
  { groupId: 'group1', groupName: 'VIP客户服务群', enabled: true, staffIds: ['staff1', 'staff2'] },
  { groupId: 'group2', groupName: '技术支持群A', enabled: true, staffIds: ['staff3'] },
  { groupId: 'group3', groupName: '产品咨询群', enabled: true, staffIds: ['staff4', 'staff5'] },
  { groupId: 'group4', groupName: '售后服务群', enabled: false, staffIds: ['staff6'] },
];

export const mockSummaries: Summary[] = [
  {
    id: 'sum1',
    groupId: 'group1',
    groupName: 'VIP客户服务群',
    date: today,
    content: '今日群内客户主要咨询了产品升级相关问题，包括新版本功能介绍、升级流程及注意事项。客服团队及时响应，详细解答了客户疑问。大部分问题已得到解决，但有1个客户对升级费用存在异议，需要进一步沟通。整体服务响应速度较快，问题闭环率达到85%。',
    tags: ['咨询', '已解决', '产品升级'],
    serviceRating: 4,
    unresolvedCount: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sum2',
    groupId: 'group2',
    groupName: '技术支持群A',
    date: today,
    content: '今日群内客户反馈了系统登录异常的问题，主要表现为部分用户无法正常登录后台管理系统。技术支持团队迅速介入，排查发现是服务器负载过高导致的临时故障。经过紧急处理，问题已在30分钟内解决。客户对此处理效率表示满意。',
    tags: ['求助', '已解决', '技术故障'],
    serviceRating: 5,
    unresolvedCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sum3',
    groupId: 'group3',
    groupName: '产品咨询群',
    date: today,
    content: '今日群内客户咨询较为分散，涵盖产品价格、使用教程、功能对比等多个方面。客服人员逐一进行了详细解答。其中有2个客户对产品价格提出了质疑，认为定价过高，需要销售团队跟进。整体服务态度良好，但部分问题回复不够及时。',
    tags: ['咨询', '未解决', '价格异议'],
    serviceRating: 3,
    unresolvedCount: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sum4',
    groupId: 'group1',
    groupName: 'VIP客户服务群',
    date: '2024-01-14',
    content: '今日群内主要处理了客户投诉，某客户反映收到的产品存在质量问题。客服团队第一时间道歉并提出解决方案，客户接受了退换货处理。其他客户咨询了售后服务流程和保修政策。整体服务响应及时，客户满意度较高。',
    tags: ['投诉', '已解决', '售后服务'],
    serviceRating: 4,
    unresolvedCount: 0,
    createdAt: '2024-01-14T23:05:00Z',
  },
  {
    id: 'sum5',
    groupId: 'group2',
    groupName: '技术支持群A',
    date: '2024-01-14',
    content: '今日群内技术问题较多，主要集中在数据同步和接口调用方面。技术人员耐心解答，大部分问题得到解决。有一个复杂的定制开发需求需要评估后回复客户。',
    tags: ['求助', '咨询'],
    serviceRating: 4,
    unresolvedCount: 1,
    createdAt: '2024-01-14T23:08:00Z',
  },
];

export const mockSummaryDetails: Record<string, SummaryDetail> = {
  sum1: {
    ...mockSummaries[0],
    customerQuestions: '1. 新版本有哪些新增功能？\n2. 升级流程是怎样的？\n3. 升级需要多长时间？\n4. 是否需要付费升级？',
    handlingProcess: '客服A首先介绍了新版本的主要功能亮点，包括AI智能分析、可视化报表和移动端适配。然后详细说明了升级流程：备份数据→下载安装包→执行升级→验证功能。对于升级时间，根据数据量大小预计在30分钟到1小时之间。关于费用问题，目前免费版本用户升级需要支付差价。',
    serviceEvaluation: '响应速度：较快（平均5分钟内回复）\n问题闭环率：85%\n客户满意度：良好\n存在问题：部分客户对升级费用有异议，需要销售团队跟进沟通。',
    relatedMessages: [
      { id: 'msg1', senderName: '张经理', senderType: 'customer', content: '请问新版本什么时候发布？有什么新功能？', timestamp: '2024-01-15T09:15:00Z' },
      { id: 'msg2', senderName: '客服A', senderType: 'staff', content: '您好张经理，新版本预计下周一发布，主要新增了AI智能分析功能。', timestamp: '2024-01-15T09:18:00Z' },
      { id: 'msg3', senderName: '张经理', senderType: 'customer', content: '升级需要付费吗？', timestamp: '2024-01-15T09:20:00Z' },
      { id: 'msg4', senderName: '客服A', senderType: 'staff', content: '目前免费版用户升级到专业版需要支付差价，具体费用可以联系销售同事。', timestamp: '2024-01-15T09:23:00Z' },
    ],
  },
  sum2: {
    ...mockSummaries[1],
    customerQuestions: '1. 系统无法登录，显示"服务器错误"\n2. 登录页面加载缓慢\n3. 其他同事是否有同样问题？',
    handlingProcess: '技术支持人员收到反馈后立即排查，发现是服务器负载过高导致的问题。紧急启动备用服务器分流流量，并对主服务器进行优化处理。问题在30分钟内解决，系统恢复正常运行。',
    serviceEvaluation: '响应速度：非常快（5分钟内响应）\n问题闭环率：100%\n客户满意度：很高\n技术团队处理效率值得表扬。',
    relatedMessages: [
      { id: 'msg5', senderName: '李工程师', senderType: 'customer', content: '系统登不上了，一直报错', timestamp: '2024-01-15T14:30:00Z' },
      { id: 'msg6', senderName: '技术支持', senderType: 'staff', content: '收到，我们正在排查，请稍等。', timestamp: '2024-01-15T14:32:00Z' },
      { id: 'msg7', senderName: '技术支持', senderType: 'staff', content: '已修复，是服务器负载过高导致的，请重新登录试试。', timestamp: '2024-01-15T15:00:00Z' },
    ],
  },
  sum3: {
    ...mockSummaries[2],
    customerQuestions: '1. 产品价格是多少？\n2. 是否有优惠活动？\n3. 和竞品相比有什么优势？\n4. 是否支持免费试用？',
    handlingProcess: '客服人员详细介绍了产品的定价方案和当前的优惠活动。对于竞品对比，客观说明了产品的优势和特点。关于免费试用，告知客户可以申请14天免费试用。部分客户对价格仍有疑虑。',
    serviceEvaluation: '响应速度：一般（部分问题回复延迟）\n问题闭环率：60%\n客户满意度：中等\n建议加强价格谈判培训，提升销售转化能力。',
    relatedMessages: [
      { id: 'msg8', senderName: '王总', senderType: 'customer', content: '你们产品价格有点贵啊', timestamp: '2024-01-15T10:00:00Z' },
      { id: 'msg9', senderName: '客服B', senderType: 'staff', content: '王总，我们的产品功能更全面，性价比很高的。', timestamp: '2024-01-15T10:15:00Z' },
    ],
  },
};

export const mockReminders: Reminder[] = [
  {
    id: 'rem1',
    groupId: 'group1',
    groupName: 'VIP客户服务群',
    triggeredAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    notifiedStaff: '客服A',
    customerMessageId: 'msg10',
    status: 'pending',
  },
  {
    id: 'rem2',
    groupId: 'group3',
    groupName: '产品咨询群',
    triggeredAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    notifiedStaff: '客服B',
    customerMessageId: 'msg11',
    status: 'processed',
    processedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'rem3',
    groupId: 'group2',
    groupName: '技术支持群A',
    triggeredAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    notifiedStaff: '技术支持',
    customerMessageId: 'msg12',
    status: 'processed',
    processedAt: new Date(Date.now() - 3.8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'rem4',
    groupId: 'group1',
    groupName: 'VIP客户服务群',
    triggeredAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    notifiedStaff: '客服A',
    customerMessageId: 'msg13',
    status: 'processed',
    processedAt: new Date(Date.now() - 7.9 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'rem5',
    groupId: 'group3',
    groupName: '产品咨询群',
    triggeredAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    notifiedStaff: '客服C',
    customerMessageId: 'msg14',
    status: 'processed',
    processedAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockSettings: Settings = {
  summaryTime: '23:00',
  reminderTimeout: 15,
  reminderCooldown: 10,
  monitoredGroups: mockGroups,
};

export const mockDashboardStats: DashboardStats = {
  todayConsultations: 28,
  avgResponseTime: 8.5,
  resolutionRate: 87,
  unresolvedCount: 4,
  todayReminders: 3,
  summaryCount: 12,
};

export const mockReminderStatistics: ReminderStatistics = {
  totalCount: 45,
  pendingCount: 3,
  avgResponseTime: 12.3,
  trendData: [
    { date: '01-10', count: 5 },
    { date: '01-11', count: 8 },
    { date: '01-12', count: 6 },
    { date: '01-13', count: 10 },
    { date: '01-14', count: 7 },
    { date: '01-15', count: 9 },
  ],
};

export const availableTags = ['投诉', '咨询', '求助', '已解决', '未解决', '产品升级', '技术故障', '售后服务', '价格异议'];