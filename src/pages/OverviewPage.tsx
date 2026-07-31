import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MessageSquare, CheckSquare, Zap, Brain, Clock, TrendingUp, Plus, Activity } from 'lucide-react';
import { mockDashboardStats } from '../lib/mockData';
import { useChatStore } from '../store/chatStore';
import { useTaskStore } from '../store/taskStore';
import { formatTime } from '../lib/utils';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

interface Props { onNavigate: (page: string) => void; }

export function OverviewPage({ onNavigate }: Props) {
  const { conversations } = useChatStore();
  const { tasks } = useTaskStore();
  const stats = mockDashboardStats;

  const statCards = [
    { label: 'Conversations', value: stats.totalConversations, icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Active Tasks', value: stats.activeTasks, icon: CheckSquare, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { label: 'Skills Installed', value: stats.skillsLearned, icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Memory Entries', value: stats.memoryCount, icon: Brain, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  ];

  const chartData = [
    { day: 'Mon', value: 5 }, { day: 'Tue', value: 8 }, { day: 'Wed', value: 12 },
    { day: 'Thu', value: 7 }, { day: 'Fri', value: 15 }, { day: 'Sat', value: 3 }, { day: 'Sun', value: 6 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <Card className="gradient-bg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Welcome back</h1>
            <p className="text-slate-400 mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-slate-100">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
            <p className="text-sm text-slate-400">Uptime: {stats.uptime}%</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <Card key={s.label} hover>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${s.bg}`}><s.icon size={24} className={s.color} /></div>
              <div><p className="text-2xl font-bold text-slate-100">{s.value}</p><p className="text-sm text-slate-400">{s.label}</p></div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex gap-3">
        <Button onClick={() => onNavigate('chat')}><Plus size={18} className="inline mr-1" /> New Chat</Button>
        <Button variant="outline" onClick={() => onNavigate('tasks')}><Plus size={18} className="inline mr-1" /> New Task</Button>
        <Button variant="outline" onClick={() => onNavigate('skills')}>Browse Skills</Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-2 mb-4"><Activity size={18} className="text-blue-400" /><h3 className="font-semibold text-slate-200">Activity Overview</h3></div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs><linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient></defs>
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
              <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="url(#colorValue)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2"><Clock size={18} className="text-blue-400" /><h3 className="font-semibold text-slate-200">Recent Conversations</h3></div>
            <button onClick={() => onNavigate('chat')} className="text-sm text-blue-400 hover:underline">View all</button>
          </div>
          <div className="space-y-2">
            {conversations.slice(0, 5).map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer" onClick={() => onNavigate('chat')}>
                <MessageSquare size={16} className="text-slate-500" />
                <div className="flex-1 min-w-0"><p className="text-sm font-medium text-slate-200 truncate">{c.title}</p><p className="text-xs text-slate-500">{c.messages.length} messages · {formatTime(c.updatedAt)}</p></div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2"><TrendingUp size={18} className="text-blue-400" /><h3 className="font-semibold text-slate-200">Recent Tasks</h3></div>
          <button onClick={() => onNavigate('tasks')} className="text-sm text-blue-400 hover:underline">View all</button>
        </div>
        <div className="space-y-2">
          {tasks.slice(0, 4).map((t) => (
            <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5">
              <div className={`w-2 h-2 rounded-full ${t.status === 'completed' ? 'bg-green-500' : t.status === 'in_progress' ? 'bg-blue-500' : 'bg-slate-500'}`} />
              <div className="flex-1"><p className="text-sm font-medium text-slate-200">{t.title}</p><p className="text-xs text-slate-500">{t.status} · {t.progress}%</p></div>
              <div className="w-24 h-1.5 rounded-full bg-white/5"><div className="h-full rounded-full bg-blue-500" style={{ width: `${t.progress}%` }} /></div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}