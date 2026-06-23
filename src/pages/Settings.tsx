import { useEffect, useState } from 'react';
import { Clock, AlertCircle, Users, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { api } from '@/api';
import type { Settings } from '@/types';
import Header from '@/components/Header';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGroup, setNewGroup] = useState({ groupId: '', groupName: '', staffIds: '' });

  useEffect(() => {
    api.settings.get().then(data => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  const handleUpdate = async (key: keyof Settings, value: string | number) => {
    setSaving(true);
    await api.settings.update({ [key]: value });
    setSettings(prev => prev ? { ...prev, [key]: value } : null);
    setSaving(false);
  };

  const handleToggleGroup = async (groupId: string, enabled: boolean) => {
    await api.settings.toggleGroup(groupId, enabled);
    setSettings(prev => prev ? {
      ...prev,
      monitoredGroups: prev.monitoredGroups.map(g =>
        g.groupId === groupId ? { ...g, enabled } : g
      ),
    } : null);
  };

  const handleDeleteGroup = async (groupId: string) => {
    await api.settings.deleteGroup(groupId);
    setSettings(prev => prev ? {
      ...prev,
      monitoredGroups: prev.monitoredGroups.filter(g => g.groupId !== groupId),
    } : null);
  };

  const handleAddGroup = async () => {
    if (!newGroup.groupId || !newGroup.groupName) return;
    const staffIds = newGroup.staffIds.split(',').map(s => s.trim()).filter(Boolean);
    await api.settings.addGroup({ groupId: newGroup.groupId, groupName: newGroup.groupName, staffIds });
    setSettings(prev => prev ? {
      ...prev,
      monitoredGroups: [...prev.monitoredGroups, {
        groupId: newGroup.groupId,
        groupName: newGroup.groupName,
        enabled: true,
        staffIds,
      }],
    } : null);
    setNewGroup({ groupId: '', groupName: '', staffIds: '' });
    setShowAddModal(false);
  };

  if (loading) {
    return (
      <div className="ml-64">
        <Header title="系统配置" subtitle="管理定时任务和提醒规则" />
        <div className="p-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-64">
      <Header title="系统配置" subtitle="管理定时任务和提醒规则" />
      
      <main className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-500" />
                定时任务配置
              </h3>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">摘要生成时间</label>
                <div className="flex items-center gap-3">
                  <input
                    type="time"
                    value={settings!.summaryTime}
                    onChange={(e) => handleUpdate('summaryTime', e.target.value)}
                    disabled={saving}
                    className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                  <span className="text-sm text-gray-500">每天自动生成前一天的聊天记录摘要</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                提醒规则配置
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">无回复提醒时长</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={settings!.reminderTimeout}
                    onChange={(e) => handleUpdate('reminderTimeout', parseInt(e.target.value) || 0)}
                    disabled={saving}
                    min="1"
                    max="60"
                    className="w-24 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                  <span className="text-sm text-gray-500">分钟（客户发送消息后超过此时长无回复将触发提醒）</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">提醒冷却时间</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={settings!.reminderCooldown}
                    onChange={(e) => handleUpdate('reminderCooldown', parseInt(e.target.value) || 0)}
                    disabled={saving}
                    min="1"
                    max="60"
                    className="w-24 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                  <span className="text-sm text-gray-500">分钟（同一群两次提醒之间的最小间隔）</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-green-500" />
                监控群管理
              </h3>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                添加群
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">群ID</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">群名称</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">关联客服</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">状态</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {settings!.monitoredGroups.map(group => (
                    <tr key={group.groupId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-600 font-mono">{group.groupId}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium text-gray-900">{group.groupName}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-600">{group.staffIds.join(', ') || '未设置'}</span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleGroup(group.groupId, !group.enabled)}
                          className="flex items-center"
                        >
                          {group.enabled ? (
                            <>
                              <ToggleRight className="w-5 h-5 text-green-500" />
                              <span className="text-xs text-green-600 ml-1">启用</span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="w-5 h-5 text-gray-400" />
                              <span className="text-xs text-gray-500 ml-1">禁用</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleDeleteGroup(group.groupId)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          删除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">添加监控群</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">群ID</label>
                  <input
                    type="text"
                    value={newGroup.groupId}
                    onChange={(e) => setNewGroup(prev => ({ ...prev, groupId: e.target.value }))}
                    placeholder="请输入群ID"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">群名称</label>
                  <input
                    type="text"
                    value={newGroup.groupName}
                    onChange={(e) => setNewGroup(prev => ({ ...prev, groupName: e.target.value }))}
                    placeholder="请输入群名称"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">关联客服（逗号分隔）</label>
                  <input
                    type="text"
                    value={newGroup.staffIds}
                    onChange={(e) => setNewGroup(prev => ({ ...prev, staffIds: e.target.value }))}
                    placeholder="例如：客服A, 客服B"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setNewGroup({ groupId: '', groupName: '', staffIds: '' });
                    setShowAddModal(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleAddGroup}
                  disabled={!newGroup.groupId || !newGroup.groupName}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                    newGroup.groupId && newGroup.groupName
                      ? 'bg-primary-600 hover:bg-primary-700'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  添加
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}