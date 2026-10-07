import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = ({ toasts = [], onDismiss }) => {
  if (toasts.length === 0) return null;

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500 shrink-0" />;
    }
  };

  const getToastBorder = (type) => {
    switch (type) {
      case 'success':
        return 'border-l-4 border-l-emerald-500 border-slate-200 dark:border-slate-800';
      case 'error':
        return 'border-l-4 border-l-rose-500 border-slate-200 dark:border-slate-800';
      case 'warning':
        return 'border-l-4 border-l-amber-500 border-slate-200 dark:border-slate-800';
      case 'info':
      default:
        return 'border-l-4 border-l-blue-500 border-slate-200 dark:border-slate-800';
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-2 sm:px-0">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border shadow-lg transition-all duration-200 animate-slide-up ${getToastBorder(
            t.type
          )}`}
        >
          {getToastIcon(t.type)}
          <div className="flex-1 min-w-0">
            {t.title && (
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-none mb-1">
                {t.title}
              </h4>
            )}
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed break-words">
              {t.message}
            </p>
          </div>
          <button
            onClick={() => onDismiss(t.id)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
