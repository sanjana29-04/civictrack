import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notificationService } from '../../services/analyticsService';
import { useNotifications } from '../../context/NotificationContext';
import { NotificationItem } from '../../types';
import { Bell, CheckCheck, ExternalLink, Loader2, Calendar } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { refreshUnreadCount } = useNotifications();

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getNotifications(0, 30);
      setNotifications(res.content);
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      refreshUnreadCount();
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      refreshUnreadCount();
    } catch (err) {
      console.error('Failed to mark all read', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight flex items-center gap-2">
            <Bell className="w-7 h-7 text-brand-600" />
            Activity Notifications
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Status changes, moderator reviews, and resolution proposals for your tracked incidents.
          </p>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="self-start sm:self-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Mark All as Read
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 max-w-md mx-auto">
          <Bell className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-navy-900">No Notifications</h3>
          <p className="text-xs text-slate-500">
            You have no pending notifications. When your reports are reviewed, assigned, or resolved, updates will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          {notifications.map((notif) => {
            const formattedDate = new Date(notif.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={notif.id}
                className={`p-5 flex items-start justify-between gap-4 transition-colors ${
                  notif.isRead ? 'bg-white' : 'bg-brand-50/40'
                }`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-navy-900">{notif.title}</span>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-brand-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 pt-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formattedDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {notif.incidentId && (
                    <Link
                      to={`/incidents/${notif.incidentId}`}
                      onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                  {!notif.isRead && (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                      title="Mark as read"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
