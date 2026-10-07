import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Clock, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext.jsx';
export const NotificationDropdown = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const handleItemClick = (item) => {
        markAsRead(item.id);
        if (item.link) {
            setIsOpen(false);
            navigate(item.link);
        }
    };
    return (<div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition" title="Notifications">
        <Bell className="w-5 h-5"/>
        {unreadCount > 0 && (<span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-extrabold flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>)}
      </button>

      {isOpen && (<div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-red-400"/>
              <h3 className="font-bold text-sm">Notifications</h3>
              {unreadCount > 0 && (<span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600 font-bold">
                  {unreadCount} new
                </span>)}
            </div>
            {unreadCount > 0 && (<button onClick={markAllAsRead} className="text-xs text-red-300 hover:text-white flex items-center gap-1 font-semibold transition">
                <CheckCheck className="w-3.5 h-3.5"/> Mark all read
              </button>)}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (<div className="p-8 text-center text-slate-400 text-sm">
                <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300"/>
                No new notifications
              </div>) : (notifications.map(n => (<div key={n.id} onClick={() => handleItemClick(n)} className={`p-3.5 transition cursor-pointer hover:bg-slate-50 flex items-start gap-3 ${!n.is_read ? 'bg-red-50/40 font-medium' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${n.type === 'emergency'
                    ? 'bg-rose-100 text-rose-600'
                    : n.type === 'match'
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-blue-100 text-blue-600'}`}>
                    {n.type === 'emergency' ? (<ShieldAlert className="w-4 h-4"/>) : (<Clock className="w-4 h-4"/>)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{n.title}</p>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{n.message}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {n.created_at ? new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                    </span>
                  </div>
                  {!n.is_read && (<span className="w-2 h-2 rounded-full bg-red-600 shrink-0 mt-1.5"/>)}
                </div>)))}
          </div>
        </div>)}
    </div>);
};
