'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { usePathname } from 'next/navigation';
import { Menu, X, Loader2 } from 'lucide-react';
import AdminLoginForm from '@/components/AdminLoginForm';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    // Client-only check after hydration to prevent server/client HTML mismatches
    const cookies = typeof document !== 'undefined' ? document.cookie : '';
    const hasToken = cookies.split(';').some((item) => {
      const trimmed = item.trim();
      return (
        (trimmed.startsWith('adg_session=') && (trimmed.split('=')[1]?.length || 0) > 0) ||
        (trimmed.startsWith('adg_admin_token=') && (trimmed.split('=')[1]?.length || 0) > 0)
      );
    });

    setIsAuthenticated(hasToken);
    setMounted(true);
  }, [pathname]);

  // Initial SSR + first client render: Identical HTML to guarantee flawless hydration
  if (!mounted) {
    return (
      <div className="h-screen w-screen bg-[#070E18] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
      </div>
    );
  }

  // If unauthenticated or on /admin/login, render the login form full-screen
  if (!isAuthenticated || isLoginPage) {
    return <AdminLoginForm redirectUrl={pathname === '/admin/login' ? '/admin' : pathname} />;
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
      {/* 1. FIXED DESKTOP SIDEBAR */}
      <div className="hidden lg:block w-64 h-screen flex-shrink-0 fixed inset-y-0 left-0 z-40">
        <AdminSidebar />
      </div>

      {/* 2. MOBILE DRAWER OVERLAY */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div
            className="fixed inset-y-0 left-0 w-64 z-50 bg-[#0B1522] shadow-2xl flex flex-col animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 flex items-center justify-between border-b border-white/10">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-blue">
                Afro Dream Global
              </span>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-grow overflow-y-auto">
              <AdminSidebar />
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN APPLICATION VIEWPORT */}
      <div className="flex-1 lg:pl-64 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* TOP STATUS BAR */}
        <header className="h-16 flex-shrink-0 bg-white border-b border-brand-border px-4 sm:px-6 flex items-center justify-between z-30">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-brand-muted hover:text-brand-dark hover:bg-gray-100"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider hidden sm:inline">
                Admin Console
              </span>
              <span className="text-xs text-brand-muted hidden sm:inline">•</span>
              <h1 className="text-sm sm:text-base font-bold text-brand-dark truncate">
                {getPageTitle(pathname)}
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-xs text-brand-muted">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Operations Portal Active</span>
            </div>
          </div>
        </header>

        {/* SCROLLABLE MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F5F7FA]">
          {children}
        </main>
      </div>
    </div>
  );
}
