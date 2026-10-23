'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AfroDreamLogo from './AfroDreamLogo';
import {
  Menu,
  X,
  Phone,
  Mail,
  ArrowRight,
  ShieldCheck,
  Search,
  ChevronRight,
} from 'lucide-react';

interface NavbarProps {
  announcementText?: string;
  phoneText?: string;
  emailText?: string;
}

export default function Navbar({
  announcementText = 'Active container & bulk sailings from Mtwara Port (TZ) & Bissau (GW) to India & Vietnam',
  phoneText = '+255 744 555 890',
  emailText = 'info@afrodreamglobal.com',
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent background scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Trade Routes', href: '/trade-routes' },
    { label: 'Track Cargo', href: '/tracking' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-brand-border/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] transition-all">
      {/* Top Corporate Status Bar */}
      <div className="bg-[#1A1718] text-white text-[11px] py-1.5 px-4 hidden md:block border-b border-white/10 tracking-wide">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-gray-200">{announcementText}</span>
          </div>
          <div className="flex items-center space-x-5 text-gray-300">
            <a
              href={`tel:${phoneText.replace(/\s+/g, '')}`}
              className="flex items-center space-x-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-brand-blue" />
              <span>{phoneText}</span>
            </a>
            <a
              href={`mailto:${emailText}`}
              className="flex items-center space-x-1.5 hover:text-white transition-colors"
            >
              <Mail className="w-3 h-3 text-brand-blue" />
              <span>{emailText}</span>
            </a>
            <Link
              href="/admin/login"
              className="flex items-center space-x-1 text-gray-400 hover:text-brand-blue transition-colors pl-3 border-l border-gray-700"
              title="Admin Portal"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo with Prominent Bold Placement */}
          <div className="flex-shrink-0 py-1.5">
            <AfroDreamLogo size="md" variant="color" />
          </div>

          {/* Clean Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold tracking-wide transition-colors py-1.5 relative ${
                    active
                      ? 'text-brand-blue'
                      : 'text-brand-dark hover:text-brand-blue'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/tracking"
              className="text-xs font-semibold text-gray-700 hover:text-brand-blue px-3 py-2 rounded-lg hover:bg-gray-100/80 transition-colors flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5 text-brand-blue" />
              <span>Track</span>
            </Link>

            <Link
              href="/quote"
              className="btn-primary group flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-brand-blue/25 hover:shadow-brand-blue/40"
            >
              <span>Get a Quote</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center space-x-1.5">
            <Link
              href="/quote"
              className="inline-flex items-center justify-center bg-brand-blue hover:bg-brand-blue-hover text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg shadow-xs active:scale-95 transition-all"
            >
              Get Quote
            </Link>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 rounded-lg text-brand-dark hover:text-brand-blue hover:bg-gray-100 transition-colors focus:outline-none"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 text-brand-dark" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE RIGHT SIDEBAR (Full Screen Height + Slide from Right)              */}
      {/* ========================================================================= */}
      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-out Sidebar Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[290px] sm:w-[340px] max-w-[85vw] h-full h-[100dvh] bg-white z-50 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out transform lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
      >
        {/* Drawer Header: Brand + Close Button */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100">
          <AfroDreamLogo size="sm" variant="color" />
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors focus:outline-none"
            aria-label="Close Navigation Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-brand-blue text-white shadow-sm shadow-brand-blue/30'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-brand-blue'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
              </Link>
            );
          })}
        </div>

        {/* Drawer Footer: Contacts + CTA Buttons */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 space-y-3.5">
          <div className="space-y-2 text-xs text-slate-600">
            <a
              href={`tel:${phoneText.replace(/\s+/g, '')}`}
              className="flex items-center space-x-2.5 hover:text-brand-blue transition-colors"
            >
              <div className="w-6 h-6 rounded-md bg-blue-50 text-brand-blue flex items-center justify-center flex-shrink-0">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium">{phoneText}</span>
            </a>
            <a
              href={`mailto:${emailText}`}
              className="flex items-center space-x-2.5 hover:text-brand-blue transition-colors"
            >
              <div className="w-6 h-6 rounded-md bg-blue-50 text-brand-blue flex items-center justify-center flex-shrink-0">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium truncate">{emailText}</span>
            </a>
          </div>

          <div className="flex gap-2 pt-1">
            <Link
              href="/quote"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary flex-1 text-center py-2.5 text-xs font-bold justify-center rounded-xl shadow-md shadow-brand-blue/20"
            >
              Get a Quote
            </Link>
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-brand-blue hover:bg-white text-xs font-medium flex items-center justify-center"
              title="Admin Portal"
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
