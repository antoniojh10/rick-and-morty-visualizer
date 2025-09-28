'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface NotificationContextValue {
  toasts: Toast[];
  addToast: (t: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((t: Omit<Toast, 'id'>) => {
    setToasts(prev => [...prev, { ...t, id: crypto.randomUUID() }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const value = useMemo(() => ({ toasts, addToast, removeToast }), [toasts, addToast, removeToast]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </NotificationContext.Provider>
  );
}

export function useNotify() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotify must be used within NotificationProvider');
  return ctx;
}

function ToastContainer({ toasts, onClose }: { toasts: Toast[]; onClose: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`min-w-[260px] rounded-md px-4 py-3 shadow text-sm text-white ${
            t.type === 'success' ? 'bg-accent' : t.type === 'error' ? 'bg-red-600' : 'bg-gray-800'
          }`}
          role="status"
        >
          <div className="flex items-center justify-between gap-3">
            <span>{t.message}</span>
            <button onClick={() => onClose(t.id)} className="opacity-80 hover:opacity-100">
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
