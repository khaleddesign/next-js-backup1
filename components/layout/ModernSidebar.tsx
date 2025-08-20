'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, GanttChartSquare, MessagesSquare, Users, FileText, Calendar, Folder, X, Settings, LogOut
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Chantiers', href: '/dashboard/chantiers', icon: GanttChartSquare },
  { name: 'Messages', href: '/dashboard/messages', icon: MessagesSquare },
  { name: 'Équipes', href: '/dashboard/equipes', icon: Users },
  { name: 'Devis', href: '/dashboard/devis', icon: FileText },
  { name: 'Planning', href: '/dashboard/planning', icon: Calendar },
  { name: 'Documents', href: '/dashboard/documents', icon: Folder }
];

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function ModernSidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay for mobile */}
      {open && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setOpen(false)}></div>}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 text-gray-900 flex flex-col transition-transform duration-300 ease-in-out shadow-lg",
        "lg:relative lg:translate-x-0",
        // Mobile: show/hide based on open state, Desktop: always visible
        open ? "flex translate-x-0" : "hidden lg:flex -translate-x-full lg:translate-x-0"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
              🏗️
            </div>
            <span className="font-bold text-xl text-gray-900">ChantierPro</span>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden p-2 rounded-md hover:bg-gray-100 text-gray-500">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link key={item.name} href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 group",
                  isActive
                    ? 'bg-blue-500 text-white shadow-md transform scale-[1.02]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-500 hover:transform hover:scale-[1.01]'
                )}>
                <item.icon size={20} className={cn("transition-colors", isActive ? "text-white" : "text-gray-600 group-hover:text-blue-500")} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-6 border-t border-gray-200 space-y-4">
            <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-blue-500 transition-colors">
                <Settings size={20} />
                <span>Paramètres</span>
            </Link>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">JD</div>
                <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Jean Dupont</p>
                    <p className="text-xs text-gray-600">Administrateur</p>
                </div>
                <button className="p-2 text-gray-600 rounded-md hover:bg-gray-100 hover:text-red-500 transition-colors">
                    <LogOut size={18} />
                </button>
            </div>
        </div>
      </aside>
    </>
  );
}
