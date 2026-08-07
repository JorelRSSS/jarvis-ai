import { useState } from 'react';
import { useMemoryStore } from '../store/memoryStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Field } from '../components/ui/Field';
import { Plus, Trash2, Brain, Search } from 'lucide-react';
import { formatTime, getMemoryTypeColor } from '../lib/utils';
import type { MemoryType } from '../types';

export function MemoryPage() {
  const {
    memories,
    searchQuery,
    filterType,
    setSearchQuery,
    setFilterType,
    addMemory,
    deleteMemory,
    updateMemory,
  } = useMemoryStore();

  const [showModal, setShowModal] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState<MemoryType>('semantic');
  const [newImportance, setNewImportance] = useState(0.5);

  const filtered = memories.filter((m) => {
    if (filterType !== 'all' && m.type !== filterType) return false;
    if (searchQuery && !m.content.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleAdd = () => {
    if (!newContent.trim()) return;
    addMemory({
      type: newType,
      content: newContent,
      importance: newImportance,
      tags: [],
    });
    setNewContent('');
    setNewType('semantic');
    setNewImportance(0.5);
    setShowModal(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain size={28} className="text-cyan-400" />
          <h2 className="text-2xl font-bold text-slate-100">Memory</h2>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={18} className="inline mr-1" /> New Memory
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['all', 'semantic', 'episodic', 'procedural'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              filterType === t ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search memories..."
          className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-slate-800 text-slate-200 border border-slate-700 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 && (
          <Card className="p-8 text-center col-span-full">
            <Brain size={48} className="mx-auto text-slate-500 mb-4" />
            <p className="text-slate-500">No memories found. Create one to get started.</p>
          </Card>
        )}
        {filtered.map((mem) => (
          <Card key={mem.id} className="p-4 hover:bg-white/5 transition-colors group">
            <div className="flex items-start justify-between mb-2">
              <Badge className={getMemoryTypeColor(mem.type)}>{mem.type}</Badge>
              <button
                onClick={() => deleteMemory(mem.id)}
                className="text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <p className="text-sm text-slate-200 mb-3">{mem.content}</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Importance:</span>
                <div className="flex-1 h-1 rounded-full bg-slate-700">
                  <div className="h-full rounded-full bg-cyan-500" style={{ width: `${mem.importance * 100}%` }} />
                </div>
                <span>{Math.round(mem.importance * 100)}%</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Accessed {mem.accessCount} times</span>
                <span>{formatTime(mem.lastAccessed)}</span>
              </div>
              {mem.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap pt-1">
                  {mem.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-400">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Memory">
        <div className="space-y-4">
          <Field label="Content">
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Memory content"
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-800 text-slate-200 border border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </Field>
          <Field label="Type">
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as MemoryType)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-800 text-slate-200 border border-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="semantic">Semantic</option>
              <option value="episodic">Episodic</option>
              <option value="procedural">Procedural</option>
            </select>
          </Field>
          <Field label={`Importance: ${Math.round(newImportance * 100)}%`}>
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={newImportance}
              onChange={(e) => setNewImportance(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </Field>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Create Memory</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}