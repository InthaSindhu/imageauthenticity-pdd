import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, CheckCircle2, AlertTriangle, XCircle, Info, BellOff, RefreshCw, Loader2 } from "lucide-react";
import { api } from "../services/api";

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export function NotificationCenterScreen() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingRead, setMarkingRead] = useState(false);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (e) {
      console.error('Failed to load notifications:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleMarkAllRead = async () => {
    setMarkingRead(true);
    try {
      await api.markNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) {
      console.error('Failed to mark notifications as read:', e);
    } finally {
      setMarkingRead(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return { Icon: CheckCircle2, bg: 'bg-green-100', color: 'text-green-600' };
      case 'warning':
        return { Icon: AlertTriangle, bg: 'bg-amber-100', color: 'text-amber-600' };
      case 'error':
        return { Icon: XCircle, bg: 'bg-red-100', color: 'text-red-600' };
      default:
        return { Icon: Info, bg: 'bg-blue-100', color: 'text-blue-600' };
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/home")}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadNotifications}
              className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
            >
              <RefreshCw className={`w-4 h-4 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
            </button>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={markingRead}
                className="text-blue-600 text-sm font-semibold hover:text-blue-700 flex items-center gap-1"
              >
                {markingRead ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Mark All Read
              </button>
            )}
          </div>
        </div>
        {unreadCount > 0 && (
          <div className="ml-14 text-sm text-gray-600">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Loading */}
        {loading && (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm flex items-start gap-4 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Notifications list */}
        {!loading && notifications.length > 0 && (
          <div className="p-6 space-y-3">
            {notifications.map((notification) => {
              const { Icon, bg, color } = getIcon(notification.type);
              return (
                <div
                  key={notification.id}
                  className={`bg-white rounded-2xl p-5 shadow-sm border transition-all ${
                    notification.read ? 'border-gray-200' : 'border-blue-200 bg-blue-50/30'
                  } hover:shadow-md`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notification.description}</p>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && notifications.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center py-24">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <BellOff className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Notifications</h3>
            <p className="text-gray-600 max-w-sm">
              You're all caught up! Notifications appear here after each scan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
