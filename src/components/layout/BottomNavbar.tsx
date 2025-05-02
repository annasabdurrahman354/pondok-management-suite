
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, FileClock, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNavbar() {
  const location = useLocation();

  const navigationItems = [
    { name: 'Home', href: '/admin-pondok/dashboard', icon: Home },
    { name: 'RAB', href: '/admin-pondok/rab', icon: FileText },
    { name: 'LPJ', href: '/admin-pondok/lpj', icon: FileClock },
    { name: 'Akun', href: '/admin-pondok/account', icon: Settings }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t">
      <div className="grid grid-cols-4">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href ||
            location.pathname.startsWith(`${item.href}/`);
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex flex-col items-center py-3 text-xs",
                isActive
                  ? "text-pondok"
                  : "text-gray-600"
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="mt-1">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
