
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { Sidebar } from './Sidebar';

interface AdminPusatLayoutProps {
  title: string;
}

export function AdminPusatLayout({ title }: AdminPusatLayoutProps) {
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
          role="admin_pusat"
        />
        <main className="flex-1 container py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
