import { Search, Star, Download, Settings2 } from 'lucide-react';
import { useSkillStore } from '../store/skillStore';
import { useToastStore } from '../store/toastStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { cn } from '../lib/utils';

export function SkillsPage() {
  const { skills, tab, searchQuery, setTab, setSearchQuery, toggleSkill, installSkill, uninstallSkill } = useSkillStore();
  const { addToast } = useToastStore();

  const filtered = skills.filter((s) => {
    if (tab === 'installed' && !s.installed) return false;
    if (tab === 'browse' && s.installed) return false;
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Skills & Plugins</h1>
        <p className="text-slate-400 mt-1">{skills.filter(s => s.installed).length} installed · {skills.filter(s => !s.installed).length} available</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          <button onClick={() => setTab('installed')} className={cn('px-4 py-2 rounded-xl text-sm font-medium', tab === 'installed' ? 'bg-blue-600 text-white' : 'glass text-slate-400')}>Installed</button>
          <button onClick={() => setTab('browse')} className={cn('px-4 py-2 rounded-xl text-sm font-medium', tab === 'browse' ? 'bg-blue-600 text-white' : 'glasstext-slate-400')}>Browse</button>
        </div>
        <div className="relative flex-1 max-w-xs ml-auto">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Search skills..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-10" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <Card key={s.id} hover>
            <div className="flex items-start gap-3 mb-3">
              <div className="text-3xl">{s.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-200">{s.name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-500">{s.author}</span>
                  <span className="flex items-center gap-0.5 text-xs text-yellow-500"><Star size={10} fill="currentColor" /> {s.rating}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-3">{s.description}</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {s.capabilities.map((c) => <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-400">{c}</span>)}
            </div>
            {s.installed && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Level {s.level}/{s.maxLevel}</span>
                  <span>{s.experience}/{s.nextLevelAt} XP</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: `${(s.experience / s.nextLevelAt) * 100}%` }} />
                </div>
              </div>
            )}
            <div className="flex gap-2">
              {s.installed ? (
                <>
                  <Button size="sm" variant={s.enabled ? 'primary' : 'outline'} onClick={() => { toggleSkill(s.id); addToast('info', `${s.name} ${s.enabled ? 'disabled' : 'enabled'}`); }}>
                    {s.enabled ? 'Enabled' : 'Disabled'}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => { uninstallSkill(s.id); addToast('info', `${s.name} uninstalled`); }}>
                    <Download size={14} className="inline mr-1" /> Remove
                  </Button>
                </>
              ) : (
                <Button size="sm" onClick={() => { installSkill(s.id); addToast('success', `${s.name} installed`); }}>
                  <Download size={14} className="inline mr-1" /> Install
                </Button>
              )}
              <Button size="sm" variant="ghost"><Settings2 size={14} /></Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}