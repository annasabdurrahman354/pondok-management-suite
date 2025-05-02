
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  FileClock, 
  FileText, 
  Home,
  Calendar,
  Settings,
  User
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  role: 'admin_pusat' | 'admin_pondok';
}

export function Sidebar({ isOpen, onClose, role }: SidebarProps) {
  const location = useLocation();
  
  // Define navigation items based on user role
  const navigationItems = role === 'admin_pusat' 
    ? [
        { name: 'Dashboard', href: '/admin-pusat/dashboard', icon: Home },
        { name: 'Rencana Anggaran', href: '/admin-pusat/rab', icon: FileText },
        { name: 'Laporan Pertanggungjawaban', href: '/admin-pusat/lpj', icon: FileClock },
        { name: 'Periode', href: '/admin-pusat/periode', icon: Calendar },
        { name: 'Manajemen Pondok', href: '/admin-pusat/management/pondok', icon: BarChart3 },
        { name: 'Manajemen Pengguna', href: '/admin-pusat/management/users', icon: User }
      ]
    : [
        { name: 'Dashboard', href: '/admin-pondok/dashboard', icon: Home },
        { name: 'Rencana Anggaran', href: '/admin-pondok/rab', icon: FileText },
        { name: 'Laporan Pertanggungjawaban', href: '/admin-pondok/lpj', icon: FileClock },
        { name: 'Akun & Pondok', href: '/admin-pondok/account', icon: Settings }
      ];

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={cn(
          "fixed z-50 inset-y-0 left-0 w-64 bg-white border-r shadow-sm transition-transform duration-300 md:transition-none md:translate-x-0 md:z-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="h-16 flex items-center px-4 border-b">
            <Link to={role === 'admin_pusat' ? '/admin-pusat/dashboard' : '/admin-pondok/dashboard'} className="font-bold text-xl text-pondok">
              Pondok Management
            </Link>
          </div>

          {/* Navigation links */}
          <div className="flex-1 overflow-auto py-4 px-3">
            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.href ||
                  location.pathname.startsWith(`${item.href}/`);
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-pondok text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-white" : "text-gray-400")} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="text-center text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Pondok Management Suite
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
