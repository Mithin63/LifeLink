import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api.js';
const NotificationContext = createContext(undefined);
export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [toasts, setToasts] = useState([]);
    const addToast = useCallback((message, type = 'info') => {
        const id = `${Date.now()}-${Math.random()}`;
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);
    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);
    const fetchNotifications = useCallback(async () => {
        try {
            const res = await api.getNotifications();
            if (res.success) {
                setNotifications(res.notifications || []);
                setUnreadCount(res.unreadCount || 0);
            }
        }
        catch {
            // Fallback notifications for offline / preview
            setNotifications([
                {
                    id: 1,
                    user_id: 2,
                    title: '🚨 Emergency Match Found',
                    message: '3 compatible A+ donors found for your request BR-2026-0001 at City Care Hospital.',
                    type: 'emergency',
                    link: '/patient/requests/1',
                    is_read: false,
                    created_at: new Date().toISOString()
                }
            ]);
            setUnreadCount(1);
        }
    }, []);
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 15000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);
    const markAsRead = async (id) => {
        try {
            await api.markNotificationRead(id);
            setNotifications(prev => prev.map(n => (n.id === id ? { ...n, is_read: true } : n)));
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
        catch {
            setNotifications(prev => prev.map(n => (n.id === id ? { ...n, is_read: true } : n)));
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
    };
    const markAllAsRead = async () => {
        try {
            await api.markAllNotificationsRead();
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
            addToast('All notifications marked as read', 'success');
        }
        catch {
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        }
    };
    return (<NotificationContext.Provider value={{
            notifications,
            unreadCount,
            toasts,
            addToast,
            removeToast,
            fetchNotifications,
            markAsRead,
            markAllAsRead
        }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => (<div key={toast.id} className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all animate-bounce-in ${toast.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-100 border-emerald-700'
                : toast.type === 'error'
                    ? 'bg-rose-950/90 text-rose-100 border-rose-700'
                    : toast.type === 'warning'
                        ? 'bg-amber-950/90 text-amber-100 border-amber-700'
                        : 'bg-slate-900/90 text-slate-100 border-slate-700'}`}>
            <div className="flex items-center gap-3">
              <span className="text-lg">
                {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : toast.type === 'warning' ? '⚠' : 'ℹ'}
              </span>
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button onClick={() => removeToast(toast.id)} className="text-slate-400 hover:text-white transition text-sm ml-3 font-bold">
              ✕
            </button>
          </div>))}
      </div>
    </NotificationContext.Provider>);
};
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
