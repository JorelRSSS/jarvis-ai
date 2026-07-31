import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colors = {
  success: 'text-green-400 border-green-500/20',
  error: 'text-red-400 border-red-500/20',
  info: 'text-blue-400 border-blue-500/20',
  warning: 'text-orange-400 border-orange-500/20',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            className={`glass-card px-4 py-3 flex items-center gap-3 animate-slide-up ${colors[toast.type]}`}
          >
            <Icon size={18} />
            <span className="text-sm text-slate-200">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="ml-2 text-slate-500 hover:text-slate-300">
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}