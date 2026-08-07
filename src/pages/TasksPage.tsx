import { useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Field } from '../components/ui/Field';
import { Plus, Trash2, CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';
import { formatTime, getPriorityColor, getStatusColor } from '../lib/utils';
import type { TaskPriority, TaskStatus } from '../types';

export function TasksPage() {
  const {
    tasks,
    filter,
    searchQuery,
    setFilter,
    setSearchQuery,
    addTask,
    updateTaskStatus,
    updateTaskProgress,
    deleteTask,
  } = useTaskStore();

  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');

  const filtered = tasks.filter((t) => {
    if (filter !== 'all' && t.status !== filter) return false;
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const statusIcons: Record<TaskStatus, typeof Circle> = {
    pending: Circle,
    in_progress: Clock,
    completed: CheckCircle2,
    failed: AlertCircle,
  };

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addTask({
      title: newTitle,
      description: newDescription,
      priority: newPriority,
      tags: [],
    });
    setNewTitle('');
    setNewDescription('');
    setNewPriority('medium');
    setShowModal(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-100">Tasks</h2>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={18} className="inline mr-1" /> New Task
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['all', 'pending', 'in_progress', 'completed', 'failed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              filter === f ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            {f === 'in_progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search tasks..."
        className="w-full px-4 py-2 text-sm rounded-lg bg-slate-800 text-slate-200 border border-slate-700 focus:outline-none focus:border-blue-500"
      />

      <div className="space-y-3">
        {filtered.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-slate-500">No tasks found. Create one to get started.</p>
          </Card>
        )}
        {filtered.map((task) => {
          const StatusIcon = statusIcons[task.status] || Circle;
          return (
            <Card key={task.id} className="p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => updateTaskStatus(task.id, task.status === 'completed' ? 'pending' : 'completed')}
                  className="mt-1 shrink-0"
                >
                  <StatusIcon size={20} className={task.status === 'completed' ? 'text-green-400' : 'text-slate-400'} />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-semibold text-slate-100 ${task.status === 'completed' ? 'line-through opacity-60' : ''}`}>
                      {task.title}
                    </h3>
                    <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                  </div>
                  {task.description && <p className="text-sm text-slate-400 mb-2">{task.description}</p>}
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className={getStatusColor(task.status)}>{task.status.replace('_', ' ')}</span>
                    <span>{formatTime(task.createdAt)}</span>
                    {task.tags.length > 0 && <span>{task.tags.join(', ')}</span>}
                  </div>
                  {task.status === 'in_progress' && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-slate-700">
                          <div className="h-full rounded-full bg-blue-500" style={{ width: `${task.progress}%` }} />
                        </div>
                        <span className="text-xs text-slate-400">{task.progress}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={task.progress}
                        onChange={(e) => updateTaskProgress(task.id, Number(e.target.value))}
                        className="w-full mt-1 accent-blue-500"
                      />
                    </div>
                  )}
                </div>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-slate-500 hover:text-red-400 transition-colors shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Task">
        <div className="space-y-4">
          <Field label="Title">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Task title"
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-800 text-slate-200 border border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </Field>
          <Field label="Description">
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Task description"
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-800 text-slate-200 border border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </Field>
          <Field label="Priority">
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-800 text-slate-200 border border-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </Field>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Create Task</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}