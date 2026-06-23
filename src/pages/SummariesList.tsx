import { useEffect, useState } from 'react';
import { ChevronRight, Star, AlertCircle, Filter, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/api';
import type { Summary, GetSummariesParams } from '@/types';
import { availableTags, mockGroups } from '@/data/mockData';
import Header from '@/components/Header';

const tagColors: Record<string, string> = {
  '投诉': 'bg-red-100 text-red-600',
  '咨询': 'bg-blue-100 text-blue-600',
  '求助': 'bg-yellow-100 text-yellow-600',
  '已解决': 'bg-green-100 text-green-600',
  '未解决': 'bg-orange-100 text-orange-600',
};

export default function SummariesList() {
  const navigate = useNavigate();
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const fetchSummaries = async () => {
    setLoading(true);
    const params: GetSummariesParams = {
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      groupId: selectedGroup || undefined,
      dateStart: dateRange.start || undefined,
      dateEnd: dateRange.end || undefined,
    };
    const result = await api.summaries.list(params);
    setSummaries(result.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSummaries();
  }, [selectedTags, selectedGroup, dateRange]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="ml-64">
      <Header title="会话摘要" subtitle="每日智能摘要列表" />
      
      <main className="p-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">筛选条件</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">选择群</label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              >
                <option value="">全部群</option>
                {mockGroups.filter(g => g.enabled).map(group => (
                  <option key={group.groupId} value={group.groupId}>{group.groupName}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">日期范围</label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">标签筛选</label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 text-xs rounded-lg transition-all ${
                      selectedTags.includes(tag)
                        ? tagColors[tag] || 'bg-gray-200 text-gray-700'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm animate-pulse"></div>
            ))
          ) : summaries.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">暂无符合条件的摘要记录</p>
            </div>
          ) : (
            summaries.map(summary => (
              <div
                key={summary.id}
                onClick={() => navigate(`/summaries/${summary.id}`)}
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-primary-200 cursor-pointer transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {summary.groupName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{summary.date}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition-colors" />
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {summary.content}
                </p>
                
                <div className="flex items-center gap-3 mb-4">
                  {summary.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className={`px-2 py-1 text-xs rounded-lg ${tagColors[tag] || 'bg-gray-100 text-gray-600'}`}
                    >
                      {tag}
                    </span>
                  ))}
                  {summary.tags.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded-lg">
                      +{summary.tags.length - 3}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    {renderStars(summary.serviceRating)}
                    <span className="text-xs text-gray-500 ml-2">{summary.serviceRating}分</span>
                  </div>
                  
                  {summary.unresolvedCount > 0 && (
                    <div className="flex items-center gap-1 text-orange-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-xs font-medium">{summary.unresolvedCount} 未解决</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}