'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import AfroDreamLogo from './AfroDreamLogo';
import {
  LayoutDashboard,
  Box,
  FileText,
  Navigation,
  Ship,
  Settings,
  LogOut,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface AdminSidebarProps {
  onNavigate?: () => void;
}

export default function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Hero Banner', href: '/admin/hero', icon: Sparkles },
    { label: 'Quote Enquiries', href: '/admin/quotes', icon: FileText },
    { label: 'Services', href: '/admin/services', icon: Box },
    { label: 'Trade Routes', href: '/admin/routes', icon: Navigation },
    { label: 'Shipment Tracking', href: '/admin/tracking', icon: Ship },
    { label: 'Site Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    document.cookie = 'adg_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'adg_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = '/admin';
  };

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 h-full bg-brand-dark text-white flex flex-col border-r border-brand-dark-border flex-shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <AfroDreamLogo variant="color" size="sm" withLink={false} />
      </div>

      <div className="px-6 py-2.5 border-b border-white/5 bg-[#171415]">
        <span className="text-[11px] font-bold text-brand-blue uppercase tracking-wider block">
          Admin Operations Portal
        </span>
      </div>

      {/* Navigation List (Scrollable internally if screen height is small) */}
      <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              onClick={onNavigate}
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                active
                  ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/30 font-bold'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-white/10 space-y-2 bg-[#1A1718] flex-shrink-0">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-2.5 px-3.5 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all w-full text-left cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
