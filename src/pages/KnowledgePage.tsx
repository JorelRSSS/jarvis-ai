import { BookOpen, FileText, Link, File } from 'lucide-react';
import { mockKnowledgeDocs } from '../lib/mockData';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { formatTime, formatBytes } from '../lib/utils';

export function KnowledgePage() {
  const typeIcons = { pdf: FileText, doc: File, url: Link, note: BookOpen };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Knowledge Base</h1>
          <p className="text-slate-400 mt-1">{mockKnowledgeDocs.length} documents</p>
        </div>
        <Button>+ Add Document</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockKnowledgeDocs.map((doc) => {
          const Icon = typeIcons[doc.type];
          return (
            <Card key={doc.id} hover>
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10"><Icon size={20} className="text-blue-400" /></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-200">{doc.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{doc.type.toUpperCase()} · {formatBytes(doc.size)}</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 line-clamp-2 mb-3">{doc.content}</p>
              <div className="flex items-center gap-2">
                {doc.tags.map((tag) => <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-400">#{tag}</span>)}
                <span className="text-xs text-slate-500 ml-auto">{formatTime(doc.updatedAt)}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}