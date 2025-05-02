
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationPanel } from './NotificationPanel';
import { useNotification } from '@/contexts/NotificationContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface AppHeaderProps {
  title: string;
  onMenuToggle?: () => void;
  showMenuToggle?: boolean;
  showNotifications?: boolean;
}

export function AppHeader({ 
  title, 
  onMenuToggle, 
  showMenuToggle = true,
  showNotifications = true
}: AppHeaderProps) {
  const { logout, user } = useAuth();
  const { unreadCount } = useNotification();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }
  
  const userRole = user?.role;
  const dashboardPath = userRole === 'admin_pusat' 
    ? '/admin-pusat/dashboard' 
    : '/admin-pondok/dashboard';

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          {showMenuToggle && onMenuToggle && (
            <Button variant="ghost" size="icon" onClick={onMenuToggle} className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          )}
          
          <Link to={dashboardPath} className="flex items-center gap-2">
            <span className="font-bold text-xl text-pondok">Pondok Management</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <h1 className="font-semibold hidden md:block mr-4">{title}</h1>
          
          {showNotifications && (
            <Sheet open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="sm:max-w-md p-0">
                <NotificationPanel onClose={() => setIsNotificationOpen(false)} />
              </SheetContent>
            </Sheet>
          )}
          
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </div>
      
      <div className="md:hidden container py-2">
        <h1 className="font-semibold">{title}</h1>
      </div>
    </header>
  );
}
