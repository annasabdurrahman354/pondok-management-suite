
import { useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useNotification } from '@/contexts/NotificationContext';
import { formatDateTimeShort } from '@/utils/date-formatter';
import { Separator } from '@/components/ui/separator';
import { EmptyState } from '@/components/common/EmptyState';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';

interface NotificationPanelProps {
  onClose: () => void;
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, refreshNotifications, isLoading } = useNotification();
  const { user } = useAuth();

  useEffect(() => {
    refreshNotifications();
  }, []);

  function getNotificationLink(notification: any) {
    if (!user) return "#";
    
    const basePath = user.role === 'admin_pusat' ? '/admin-pusat' : '/admin-pondok';
    
    switch (notification.type) {
      case 'pondok':
        return `${basePath}/management/pondok/${notification.entity_id}`;
      case 'rab':
        return `${basePath}/rab/${notification.entity_id}`;
      case 'lpj':
        return `${basePath}/lpj/${notification.entity_id}`;
      default:
        return '#';
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold text-lg">Notifikasi</h3>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              onClick={() => markAllAsRead()}
            >
              <Check className="h-3.5 w-3.5 mr-1" />
              Tandai Semua Dibaca
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        {notifications.length === 0 ? (
          <EmptyState 
            title="Tidak Ada Notifikasi"
            description="Anda belum memiliki notifikasi."
          />
        ) : (
          <div className="py-2">
            {notifications.map((notification) => (
              <div key={notification.id} className="group">
                <Link 
                  to={getNotificationLink(notification)}
                  className={`block p-4 hover:bg-muted transition-colors ${!notification.is_read ? 'bg-blue-50' : ''}`}
                  onClick={() => {
                    if (!notification.is_read) {
                      markAsRead(notification.id);
                    }
                    onClose();
                  }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-sm">
                      {notification.type === 'pondok' && 'Sinkronisasi Data'}
                      {notification.type === 'rab' && 'Rencana Anggaran Biaya'}
                      {notification.type === 'lpj' && 'Laporan Pertanggungjawaban'}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {formatDateTimeShort(notification.created_at)}
                    </span>
                  </div>
                  <p className="text-sm">{notification.message}</p>
                </Link>
                <Separator />
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
