import React from 'react';
import { useNexus } from '../../context/NexusContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNexus();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = Info;
        let iconColor = 'text-nexus-blue';
        let borderColor = 'border-nexus-blue/20';
        let bgStyle = 'bg-white';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          iconColor = 'text-nexus-green';
          borderColor = 'border-nexus-green/30';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          iconColor = 'text-nexus-amber';
          borderColor = 'border-nexus-amber/30';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          iconColor = 'text-nexus-red';
          borderColor = 'border-nexus-red/30';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-nexus border ${borderColor} ${bgStyle} shadow-nexus-dropdown transition-all duration-300 animate-in fade-in slide-in-from-bottom-3`}
          >
            <div className={`mt-0.5 shrink-0 ${iconColor}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-nexus-navy">{toast.title}</div>
              <div className="text-xs text-nexus-muted mt-0.5 leading-relaxed">{toast.description}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
