'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import UserMenu from '@/components/layout/UserMenu';
import { Menu, X } from 'lucide-react';
import { 
  LayoutDashboard, GanttChartSquare, MessagesSquare, Users, 
  FileText, Calendar, Folder, Settings 
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const getRoleBasedItems = (role: string) => {
  switch (role) {
    case 'ADMIN':
      return [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Chantiers', href: '/dashboard/chantiers', icon: GanttChartSquare },
        { name: 'Messages', href: '/dashboard/messages', icon: MessagesSquare },
        { name: 'Utilisateurs', href: '/dashboard/users', icon: Users },
        { name: 'Devis', href: '/dashboard/devis', icon: FileText },
        { name: 'Planning', href: '/dashboard/planning', icon: Calendar },
        { name: 'Documents', href: '/dashboard/documents', icon: Folder }
      ];
    
    case 'COMMERCIAL':
      return [
        { name: 'Dashboard Commercial', href: '/dashboard/commercial', icon: LayoutDashboard },
        { name: 'Mes Chantiers', href: '/dashboard/chantiers', icon: GanttChartSquare },
        { name: 'Devis & Factures', href: '/dashboard/devis', icon: FileText },
        { name: 'Messages Clients', href: '/dashboard/messages', icon: MessagesSquare },
        { name: 'Planning', href: '/dashboard/planning', icon: Calendar },
        { name: 'Documents', href: '/dashboard/documents', icon: Folder }
      ];
      
    case 'CLIENT':
      return [
        { name: 'Mes Projets', href: '/dashboard/client', icon: LayoutDashboard },
        { name: 'Mes Chantiers', href: '/dashboard/chantiers', icon: GanttChartSquare },
        { name: 'Messages', href: '/dashboard/messages', icon: MessagesSquare },
        { name: 'Documents', href: '/dashboard/documents', icon: Folder }
      ];
      
    default:
      return [];
  }
};

export default function DashboardLayout({ children }: LayoutProps) {
  const { user, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

  const menuItems = getRoleBasedItems(user.role);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'from-red-500 to-red-600';
      case 'COMMERCIAL': return 'from-green-500 to-green-600';
      case 'CLIENT': return 'from-blue-500 to-blue-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Administrateur';
      case 'COMMERCIAL': return 'Commercial';
      case 'CLIENT': return 'Client';
      default: return role;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN': return '👑';
      case 'COMMERCIAL': return '💼';
      case 'CLIENT': return '🏠';
      default: return '🏗️';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 text-gray-900 flex flex-col transition-transform duration-300 ease-in-out shadow-lg lg:relative lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getRoleColor(user.role)} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                {getRoleIcon(user.role)}
              </div>
              <div>
                <span className="font-bold text-xl text-gray-900">ChantierPro</span>
                <p className="text-xs text-gray-500">v2.0 • {getRoleLabel(user.role)}</p>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 text-gray-500"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 group ${
                    isActive
                      ? `bg-gradient-to-r ${getRoleColor(user.role)} text-white shadow-md transform scale-[1.02]`
                      : 'text-gray-600 hover:bg-gray-50 hover:text-blue-500 hover:transform hover:scale-[1.01]'
                  }`}
                >
                  <item.icon size={20} className={`transition-colors ${
                    isActive ? "text-white" : "text-gray-600 group-hover:text-blue-500"
                  }`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="px-4 py-6 border-t border-gray-200 space-y-4">
            <Link 
              href="/dashboard/profile" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-blue-500 transition-colors"
            >
              <Settings size={20} />
              <span>Mon Profil</span>
            </Link>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getRoleColor(user.role)} flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-600">{getRoleLabel(user.role)}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between h-full px-4 lg:px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Menu size={20} className="text-gray-600" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                  🏗️
                </div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                    ChantierPro
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <UserMenu />
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
