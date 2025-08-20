"use client";

import React, { useState } from 'react';
import { ModernSidebar } from './ModernSidebar';
import { ToastProvider } from '@/components/ui/Toast';
import { Menu } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar */}
        <ModernSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile header */}
          <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 shadow-sm">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-50 hover:text-blue-500 transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                🏗️
              </div>
              <span className="font-bold text-lg text-gray-900">ChantierPro</span>
            </div>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>

          {/* Main content area */}
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 lg:px-8 py-6 max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}