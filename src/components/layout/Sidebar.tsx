import { LayoutDashboard, MessageSquare, CheckSquare, Zap, Brain, BookOpen, BarChart3, Settings, ChevronLeft, Sparkles } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { cn } from '../../lib/utils';

const iconMap: Record<string, typeof LayoutDashboard> = {
  LayoutDashboard, MessageSquare, CheckSquare, Zap, Brain, BookOpen, BarChart3, Settings,
};

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const { settings, toggleSidebar } = useSettingsStore();
  const collapsed = settings.sidebarCollapsed;

  const navItems = [
    { section: 'Main', items: [
      { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
      { id: 'chat', label: 'Chat', icon: 'MessageSquare', badge: 3 },
      { id: 'tasks', label: 'Tasks', icon: 'CheckSquare', badge: 2 },
    ]},
    { section: 'Capabilities', items: [
      { id: 'skills', label: 'Skills', icon: 'Zap' },
      { id: 'memory', label: 'Memory', icon: 'Brain' },
      { id: 'knowledge', label: 'Knowledge', icon: 'BookOpen' },
    ]},
    { section: 'System', items: [
      { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
      { id: 'settings', label: 'Settings', icon: 'Settings' },
    ]},
  ];

  return (
    <aside className={cn('h-screen flex flex-col border-r border-white/10 bg-slate-950/50 backdrop-blur-xl transition-all duration-300', collapsed ? 'w-16' : 'w-64')}>
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shrink-0">
          <Sparkles size={18} className="text-white" />
        </div>
        {!collapsed && <span className="font-bold text-lg gradient-text">JARVIS</span>}
      </div>
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 px-2 space-y-6">
        {navItems.map((section) => (
          <div key={section.section}>
            {!collapsed && <p className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">{section.section}</p>}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = iconMap[item.icon];
                const isActive = activePage === item.id;
                return (
                  <button key={item.id} onClick={() => onNavigate(item.id)} className={cn('sidebar-item w-full', isActive && 'sidebar-item-active')} title={collapsed ? item.label : undefined}>
                    <Icon size={20} className="shrink-0" />
                    {!collapsed && <span className="flex-1 text-left text-sm">{item.label}</span>}
                    {!collapsed && item.badge && <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500/20 text-blue-400">{item.badge}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <button onClick={toggleSidebar} className="flex items-center justify-center h-12 border-t border-white/10 text-slate-500 hover:text-slate-300 transition-colors">
        <ChevronLeft size={20} className={cn('transition-transform', collapsed && 'rotate-180')} />
      </button>
    </aside>
  );
}