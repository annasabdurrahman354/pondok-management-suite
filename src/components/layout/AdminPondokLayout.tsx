
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { Sidebar } from './Sidebar';
import { BottomNavbar } from './BottomNavbar';

interface AdminPondokLayoutProps {
  title: string;
}

export function AdminPondokLayout({ title }: AdminPondokLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader 
        title={title} 
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className="flex flex-1">
        <Sidebar 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          role="admin_pondok"
        />
        <main className="flex-1 pb-16 md:pb-0 container py-6">
          <Outlet />
        </main>
      </div>
      <BottomNavbar />
    </div>
  );
}
