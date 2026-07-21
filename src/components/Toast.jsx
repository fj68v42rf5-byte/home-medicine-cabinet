import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const bgStyles = {
    success: 'bg-slate-900 text-white border-slate-800 shadow-xl',
    warning: 'bg-amber-500 text-white border-amber-600 shadow-xl',
    error: 'bg-red-600 text-white border-red-700 shadow-xl',
    info: 'bg-brand-600 text-white border-brand-700 shadow-xl'
  }[toast.type || 'info'];

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div className={`px-4 py-3 rounded-2xl border flex items-center gap-3 text-xs font-semibold max-w-sm ${bgStyles}`}>
        {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
        {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-200 shrink-0" />}
        {toast.type === 'info' && <Info className="w-4 h-4 text-brand-200 shrink-0" />}
        
        <span className="flex-1">{toast.message}</span>
        
        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
