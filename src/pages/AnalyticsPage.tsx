import { BarChart3, TrendingUp, Clock, Zap } from 'lucide-react';
import { mockAnalyticsData } from '../lib/mockData';
import { Card } from '../components/ui/Card';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const PIE_COLORS = ['#3b82f6', '#a855f7', '#06b6d4', '#64748b'];

export function AnalyticsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Analytics</h1>
        <p className="text-slate-400 mt-1">Usage insights and performance metrics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Conversations', value: '47', icon: BarChart3, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Tasks Completed', value: '23', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Avg Response Time', value: '950ms', icon: Clock, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { label: 'Skills Used', value: '8', icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map((s) => (
          <Card key={s.label}>
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${s.bg}`}><s.icon size={20} className={s.color} /></div>
              <div><p className="text-xl font-bold text-slate-100">{s.value}</p><p className="text-xs text-slate-400">{s.label}</p></div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-slate-200 mb-4">Conversations Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={mockAnalyticsData.conversationsOverTime}>
              <defs><linearGradient id="conv" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
              <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="url(#conv)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-semibold text-slate-200 mb-4">Tasks Completed</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mockAnalyticsData.tasksCompletedOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
              <Bar dataKey="count" fill="#a855f7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-semibold text-slate-200 mb-4">Model Usage Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={mockAnalyticsData.modelUsage} dataKey="percentage" nameKey="model" cx="50%" cy="50%" outerRadius={80} label={(e: any) => `${e.model}: ${e.percentage}%`}>
                {mockAnalyticsData.modelUsage.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-semibold text-slate-200 mb-4">Response Time (ms)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={mockAnalyticsData.responseTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
              <Line type="monotone" dataKey="time" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <h3 className="font-semibold text-slate-200 mb-4">Skill Usage</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={mockAnalyticsData.skillUsage} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis type="number" stroke="#64748b" fontSize={12} />
            <YAxis type="category" dataKey="skill" stroke="#64748b" fontSize={12} width={100} />
            <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
            <Bar dataKey="usage" fill="#3b82f6" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}