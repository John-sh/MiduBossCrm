import { useEffect, useState } from 'react';
import { Bell, CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { api } from '@/api';
import type { Reminder, ReminderStatistics, GetRemindersParams } from '@/types';
import Header from '@/components/Header';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [statistics, setStatistics] = useState<ReminderStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchReminders = async () => {
    setLoading(true);
    const params: GetRemindersParams = {
      status: statusFilter === '' ? undefined : (statusFilter as 'pending' | 'processed'),
    };
    const [reminderList, stats] = await Promise.all([
      api.reminders.list(params),
      api.reminders.getStatistics(),
    ]);
    setReminders(reminderList.data);
    setStatistics(stats);
    setLoading(false);
  };

  useEffect(() => {
    fetchReminders();
  }, [statusFilter]);

  const handleProcess = async (id: string) => {
    setProcessingId(id);
    await api.reminders.process(id);
    setProcessingId(null);
    fetchReminders();
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    return date.toLocaleDateString('zh-CN');
  };

  const chartData = statistics ? {
    labels: statistics.trendData.map(d => d.date),
    datasets: [
      {
        label: '提醒次数',
        data: statistics.trendData.map(d => d.count),
        backgroundColor: '#1e40af',
        borderRadius: 6,
        barThickness: 32,
      },
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1e40af',
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#9ca3af', font: { size: 11 } },
      },
      y: {
        grid: { color: '#f3f4f6' },
        ticks: { color: '#9ca3af', font: { size: 11 } },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="ml-64">
      <Header title="提醒管理" subtitle="15分钟无回复自动提醒记录" />
      
      <main className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm animate-pulse"></div>
            ))
          ) : (
            [
              { label: '总提醒次数', value: statistics!.totalCount, icon: Bell, color: 'bg-blue-50 text-blue-600', iconBg: 'bg-blue-100' },
              { label: '待处理', value: statistics!.pendingCount, icon: AlertCircle, color: 'bg-orange-50 text-orange-600', iconBg: 'bg-orange-100' },
              { label: '平均响应时长', value: `${statistics!.avgResponseTime}分钟`, icon: Clock, color: 'bg-purple-50 text-purple-600', iconBg: 'bg-purple-100' },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.iconBg} rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color.split(' ')[1]}`} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">提醒记录</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStatusFilter('')}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                    statusFilter === '' ? 'bg-primary-50 text-primary-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  全部
                </button>
                <button
                  onClick={() => setStatusFilter('pending')}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                    statusFilter === 'pending' ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  待处理
                </button>
                <button
                  onClick={() => setStatusFilter('processed')}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                    statusFilter === 'processed' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  已处理
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">时间</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">群名称</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">被@人员</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">状态</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array(4).fill(0).map((_, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        <td colSpan={5} className="py-4 px-4">
                          <div className="h-4 bg-gray-100 rounded w-32 animate-pulse"></div>
                        </td>
                      </tr>
                    ))
                  ) : reminders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        暂无提醒记录
                      </td>
                    </tr>
                  ) : (
                    reminders.map(reminder => (
                      <tr key={reminder.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">{formatTime(reminder.triggeredAt)}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm font-medium text-gray-900">{reminder.groupName}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-700">{reminder.notifiedStaff}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                              reminder.status === 'pending'
                                ? 'bg-orange-100 text-orange-600'
                                : 'bg-green-100 text-green-600'
                            }`}
                          >
                            {reminder.status === 'pending' ? (
                              <>
                                <AlertCircle className="w-3 h-3" />
                                待处理
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-3 h-3" />
                                已处理
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          {reminder.status === 'pending' && (
                            <button
                              onClick={() => handleProcess(reminder.id)}
                              disabled={processingId === reminder.id}
                              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                                processingId === reminder.id
                                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                  : 'bg-green-100 text-green-600 hover:bg-green-200'
                              }`}
                            >
                              {processingId === reminder.id ? '处理中...' : '标记已处理'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary-500" />
              提醒趋势
            </h3>
            <div className="h-48">
              {chartData ? (
                <Bar data={chartData} options={chartOptions} />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="w-32 h-32 bg-gray-100 rounded animate-pulse"></div>
                </div>
              )}
            </div>
            
            <div className="mt-6 p-4 bg-orange-50 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-800">提醒规则说明</p>
                  <p className="text-xs text-orange-700 mt-1">
                    客户发送消息后15分钟内无回复，系统将自动触发提醒。同一群两次提醒之间至少间隔10分钟冷却期。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}