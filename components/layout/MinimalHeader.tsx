import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export function MinimalHeader({ onMenuClick }: HeaderProps) {
  return (
    <header className="flex-shrink-0 h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-border-light bg-white/80 backdrop-blur-sm">
      <button onClick={onMenuClick} className="lg:hidden p-2 -ml-2 rounded-md text-secondary hover:text-primary hover:bg-gray-100">
        <Menu size={24} />
      </button>
      
      {/* This can be dynamic based on the page later */}
      <h1 className="text-xl font-semibold text-primary hidden lg:block">Dashboard</h1>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-placeholder" />
          <input 
            type="text"
            placeholder="Rechercher un chantier, un contact..."
            className="w-40 sm:w-64 pl-10 pr-4 py-2 text-sm rounded-md border border-border-light bg-white focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accent-blue"
          />
        </div>
        <button className="p-2 rounded-full text-secondary hover:text-primary hover:bg-gray-100 relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
}
