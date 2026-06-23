import { useEffect, useState } from 'react';
import { ArrowLeft, Star, User, Bot, MessageCircle } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/api';
import type { SummaryDetail } from '@/types';
import Header from '@/components/Header';

const tagColors: Record<string, string> = {
  '投诉': 'bg-red-100 text-red-600',
  '咨询': 'bg-blue-100 text-blue-600',
  '求助': 'bg-yellow-100 text-yellow-600',
  '已解决': 'bg-green-100 text-green-600',
  '未解决': 'bg-orange-100 text-orange-600',
};

export default function SummaryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<SummaryDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.summaries.get(id).then(data => {
        setSummary(data);
        setLoading(false);
      });
    }
  }, [id]);

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="ml-64">
        <Header title="会话摘要详情" />
        <div className="p-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="ml-64">
        <Header title="会话摘要详情" />
        <div className="p-6">
          <div className="text-center py-12">
            <p className="text-gray-500">摘要记录不存在</p>
            <button
              onClick={() => navigate('/summaries')}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              返回列表
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-64">
      <Header title="会话摘要详情" />
      
      <main className="p-6">
        <button
          onClick={() => navigate('/summaries')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">返回列表</span>
        </button>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{summary.groupName}</h2>
                <p className="text-sm text-gray-500 mt-1">摘要日期：{summary.date}</p>
              </div>
              <div className="flex items-center gap-2">
                {renderStars(summary.serviceRating)}
                <span className="text-sm font-medium text-gray-700">{summary.serviceRating}分</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-4">
              {summary.tags.map(tag => (
                <span
                  key={tag}
                  className={`px-3 py-1 text-xs rounded-lg ${tagColors[tag] || 'bg-gray-100 text-gray-600'}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                    客户咨询问题
                  </h3>
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                      {summary.customerQuestions}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    处理过程
                  </h3>
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {summary.handlingProcess}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    服务评价
                  </h3>
                  <div className="bg-purple-50 rounded-xl p-4">
                    <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                      {summary.serviceEvaluation}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    原始记录概览
                  </h3>
                  <div className="space-y-3">
                    {summary.relatedMessages.map(msg => (
                      <div
                        key={msg.id}
                        className={`flex gap-3 p-3 rounded-lg ${
                          msg.senderType === 'customer' ? 'bg-gray-50' : 'bg-primary-50'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            msg.senderType === 'customer' ? 'bg-gray-200' : 'bg-primary-100'
                          }`}
                        >
                          {msg.senderType === 'customer' ? (
                            <User className="w-4 h-4 text-gray-600" />
                          ) : (
                            <Bot className="w-4 h-4 text-primary-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">{msg.senderName}</span>
                            <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
                            <span
                              className={`px-1.5 py-0.5 text-xs rounded ${
                                msg.senderType === 'customer'
                                  ? 'bg-gray-200 text-gray-600'
                                  : 'bg-primary-100 text-primary-600'
                              }`}
                            >
                              {msg.senderType === 'customer' ? '客户' : '员工'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-gray-500" />
                <span className="text-xs text-gray-600">关联消息：{summary.relatedMessages.length} 条</span>
              </div>
              {summary.unresolvedCount > 0 && (
                <div className="flex items-center gap-2 text-orange-600">
                  <span className="text-xs font-medium">{summary.unresolvedCount} 个问题未解决</span>
                </div>
              )}
            </div>
            <div className="text-xs text-gray-400">
              创建时间：{new Date(summary.createdAt).toLocaleString('zh-CN')}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}