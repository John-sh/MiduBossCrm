import { useEffect, useState } from 'react';
import { MessageCircle, Clock, CheckCircle, AlertCircle, Bell, FileText, TrendingUp, TrendingDown } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler } from 'chart.js';
import { api } from '@/api';
import type { DashboardStats } from '@/types';
import Header from '@/components/Header';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

const statCards = [
  { key: 'todayConsultations', label: '今日咨询', icon: MessageCircle, color: 'bg-blue-50 text-blue-600', iconBg: 'bg-blue-100' },
  { key: 'avgResponseTime', label: '平均响应时长', icon: Clock, color: 'bg-purple-50 text-purple-600', iconBg: 'bg-purple-100', suffix: '分钟' },
  { key: 'resolutionRate', label: '问题闭环率', icon: CheckCircle, color: 'bg-green-50 text-green-600', iconBg: 'bg-green-100', suffix: '%' },
  { key: 'unresolvedCount', label: '未解决问题', icon: AlertCircle, color: 'bg-orange-50 text-orange-600', iconBg: 'bg-orange-100' },
];

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.dashboard.getStats().then(data => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  const chartData = {
    labels: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
    datasets: [
      {
        label: '响应时长(分钟)',
        data: [6, 8, 5, 12, 7, 9, 6, 8, 7],
        borderColor: '#1e40af',
        backgroundColor: 'rgba(30, 64, 175, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#1e40af',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1e40af',
        padding: 12,
        titleFont: { size: 12 },
        bodyFont: { size: 14 },
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
        max: 15,
      },
    },
  };

  if (loading) {
    return (
      <div className="ml-64">
        <Header title="仪表盘" subtitle="服务概览" />
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map(card => (
              <div key={card.key} className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-64">
      <Header title="仪表盘" subtitle="服务概览" />
      
      <main className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map(card => {
            const value = stats![card.key as keyof DashboardStats] as number;
            const change = card.key === 'avgResponseTime' ? -5 : card.key === 'resolutionRate' ? 3 : Math.floor(Math.random() * 10) - 5;
            const isPositive = change >= 0;
            
            return (
              <div key={card.key} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{card.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {value}{card.suffix || ''}
                    </p>
                    <div className={`flex items-center gap-1 mt-2 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span>{Math.abs(change)}%</span>
                      <span className="text-gray-400">较昨日</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center`}>
                    <card.icon className={`w-6 h-6 ${card.color.split(' ')[1]}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">响应时效趋势</h3>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-xs bg-primary-50 text-primary-600 rounded-lg font-medium">今日</button>
                <button className="px-3 py-1 text-xs text-gray-500 hover:bg-gray-50 rounded-lg font-medium">本周</button>
                <button className="px-3 py-1 text-xs text-gray-500 hover:bg-gray-50 rounded-lg font-medium">本月</button>
              </div>
            </div>
            <div className="h-64">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">快捷操作</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-4 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors group">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                  <FileText className="w-5 h-5 text-primary-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">查看今日摘要</p>
                  <p className="text-xs text-gray-500">{stats!.summaryCount} 条记录</p>
                </div>
              </button>
              
              <button className="w-full flex items-center gap-3 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors group">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <Bell className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">待处理提醒</p>
                  <p className="text-xs text-gray-500">{stats!.todayReminders} 条待处理</p>
                </div>
              </button>
              
              <button className="w-full flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">问题处理统计</p>
                  <p className="text-xs text-gray-500">闭环率 {stats!.resolutionRate}%</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}