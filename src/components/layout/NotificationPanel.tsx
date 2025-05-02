
import { useState, useEffect } from 'react';
import { SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Check, Clock } from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';
import { formatDateTime } from '@/utils/date-formatter';
import { Notification } from '@/types/notification.types';
import { Link } from 'react-router-dom';

interface NotificationPanelProps {
  onClose?: () => void;
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotification();
  const [activeTab, setActiveTab] = useState<string>(unreadCount > 0 ? 'unread' : 'all');

  useEffect(() => {
    if (unreadCount === 0 && activeTab === 'unread') {
      setActiveTab('all');
    }
  }, [unreadCount]);

  const getNotificationLink = (notification: Notification): string => {
    if (!notification.entity_id) return '#';

    switch (notification.type) {
      case 'pondok':
        return `/admin-pusat/management/pondok/${notification.entity_id}`;
      case 'rab':
        return `/admin-${notification.user_id === 'admin_pusat' ? 'pusat' : 'pondok'}/rab/${notification.entity_id}`;
      case 'lpj':
        return `/admin-${notification.user_id === 'admin_pusat' ? 'pusat' : 'pondok'}/lpj/${notification.entity_id}`;
      default:
        return '#';
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
    
    if (onClose) {
      onClose();
    }
  };

  // Filter notifications based on active tab
  const filteredNotifications = activeTab === 'unread'
    ? notifications.filter(notification => !notification.is_read)
    : notifications;

  return (
    <div className="h-full flex flex-col">
      <SheetHeader className="px-6 pt-6 pb-2">
        <SheetTitle>Notifikasi</SheetTitle>
        <SheetDescription className="flex justify-between items-center">
          <span>
            {unreadCount > 0 
              ? `${unreadCount} notifikasi belum dibaca` 
              : 'Tidak ada notifikasi baru'}
          </span>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllAsRead()}
              className="text-xs"
            >
              <Check className="h-3 w-3 mr-1" /> Tandai semua dibaca
            </Button>
          )}
        </SheetDescription>
      </SheetHeader>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="flex flex-col flex-1"
      >
        <div className="px-6 border-b">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="unread" disabled={unreadCount === 0}>
              Belum Dibaca {unreadCount > 0 && `(${unreadCount})`}
            </TabsTrigger>
            <TabsTrigger value="all">
              Semua
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent 
          value="unread" 
          className="flex-1 overflow-auto mt-0 px-0"
        >
          {renderNotifications(filteredNotifications, handleNotificationClick, loading)}
        </TabsContent>
        
        <TabsContent 
          value="all" 
          className="flex-1 overflow-auto mt-0 px-0"
        >
          {renderNotifications(filteredNotifications, handleNotificationClick, loading)}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function renderNotifications(
  notifications: Notification[], 
  onClick: (notification: Notification) => void,
  loading: boolean
) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Clock className="animate-spin h-6 w-6 text-muted-foreground" />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <p>Tidak ada notifikasi</p>
      </div>
    );
  }

  return (
    <ul className="divide-y">
      {notifications.map((notification) => (
        <li 
          key={notification.id} 
          className={`p-4 hover:bg-accent transition-colors ${!notification.is_read ? 'bg-accent/30' : ''}`}
        >
          <Link 
            to={getNotificationLink(notification)}
            onClick={() => onClick(notification)}
            className="block"
          >
            <p className="text-sm mb-1">{notification.message}</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {formatDateTime(notification.created_at)}
              </span>
              {!notification.is_read && (
                <span className="inline-block w-2 h-2 bg-pondok rounded-full"></span>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
