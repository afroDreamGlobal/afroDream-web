'use client';

import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { usePathname } from 'next/navigation';
import { Menu, X, ShieldCheck } from 'lucide-react';
import AfroDreamLogo from '@/components/AfroDreamLogo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  const getPageTitle = (path: string) => {
    const clean = path.replace('/admin', '').replace('/', '');
    if (!clean) return 'Operational Overview';
    if (clean === 'hero') return 'Hero Banner Management';
    return clean
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#F5F7FA]">
      {/* 1. FIXED DESKTOP SIDEBAR (Never moves / scrolls with page) */}
      <div className="hidden lg:block w-64 h-screen flex-shrink-0 fixed inset-y-0 left-0 z-40">
        <AdminSidebar />
      </div>

      {/* 2. MOBILE SIDEBAR DRAWER (Collapsible overlay) */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-64 h-full bg-brand-dark flex flex-col shadow-2xl">
            <div className="absolute top-4 right-4 text-white">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-md text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <AdminSidebar onNavigate={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* 3. INDEPENDENTLY MOVEABLE / SCROLLABLE CONTENT AREA */}
      <div className="flex-1 lg:pl-64 flex flex-col h-screen overflow-y-auto w-full min-w-0">
        {/* Sticky Top Header */}
        <header className="bg-white border-b border-brand-border h-16 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 flex-shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center space-x-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-brand-dark hover:bg-gray-100"
              aria-label="Open Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-xs text-brand-muted">
              <span className="font-semibold text-brand-dark hidden sm:inline">Afro Dream Global</span>
              <span className="hidden sm:inline">/</span>
              <span className="font-medium text-brand-blue capitalize">{getPageTitle(pathname)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider">System Live</span>
            </div>
          </div>
        </header>

        {/* Moveable Page Content */}
        <main className="p-6 sm:p-8 flex-grow overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
