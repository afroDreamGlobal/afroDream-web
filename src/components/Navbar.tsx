'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle scroll for dynamic logo positioning
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent background scroll when mobile sidebar is open & handle Escape key
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setMobileMenuOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
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
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-brand-border/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] transition-all">
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
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand Logo with Dynamic Referral Placement (Hanging on Desktop, Clean on Mobile) */}
            <div className="flex-shrink-0 relative z-30 flex items-center">
              <Link
                href="/"
                className="flex items-center focus:outline-none group py-1"
                aria-label="Afro Dream Global Home"
              >
                <div
                  className={`relative transition-all duration-300 ease-in-out ${
                    isScrolled
                      ? 'h-[44px] sm:h-[54px] w-[74px] sm:w-[90px] translate-y-0'
                      : 'h-[46px] sm:h-[96px] w-[78px] sm:w-[158px] translate-y-0 sm:translate-y-[16px] drop-shadow-[0_6px_16px_rgba(0,0,0,0.18)]'
                  }`}
                >
                  <Image
                    src="/images/logo-badge.png"
                    alt="Afro Dream Global Logo"
                    fill
                    sizes="(max-width: 640px) 78px, 158px"
                    priority
                    className="object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                  />
                </div>
              </Link>
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
            <div className="flex lg:hidden items-center space-x-2">
              <Link
                href="/quote"
                className="inline-flex items-center justify-center bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm active:scale-95 transition-all"
              >
                Get Quote
              </Link>
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-xl text-brand-dark hover:text-brand-blue hover:bg-gray-100 transition-colors focus:outline-none"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-6 h-6 text-brand-dark" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MOBILE SIDEBAR DRAWER (Portal to document.body for True Fullscreen Overlay)*/}
      {/* ========================================================================= */}
      {mounted &&
        createPortal(
          <>
            {/* Full Screen Backdrop Overlay */}
            <div
              className={`fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-[9998] transition-opacity duration-300 lg:hidden ${
                mobileMenuOpen
                  ? 'opacity-100 pointer-events-auto'
                  : 'opacity-0 pointer-events-none'
              }`}
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Full Height Slide-out Sidebar Drawer */}
            <div
              className={`fixed top-0 right-0 bottom-0 w-[300px] sm:w-[350px] max-w-[85vw] h-full h-[100dvh] bg-white z-[9999] shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out transform lg:hidden ${
                mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
              }`}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation Menu"
            >
              {/* Drawer Header: Brand + Close Button */}
              <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100 bg-white">
                <AfroDreamLogo size="sm" variant="color" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 hover:text-slate-950 transition-colors focus:outline-none active:scale-95"
                  aria-label="Close Navigation Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Navigation Links */}
              <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5">
                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        active
                          ? 'bg-brand-blue text-white shadow-sm shadow-brand-blue/30 font-bold'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-brand-blue'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronRight
                        className={`w-4 h-4 ${
                          active ? 'text-white' : 'text-slate-400'
                        }`}
                      />
                    </Link>
                  );
                })}
              </div>

              {/* Drawer Footer: Primary Action CTA */}
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/90">
                <Link
                  href="/quote"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary w-full text-center py-3 text-sm font-bold justify-center rounded-xl shadow-md shadow-brand-blue/20 flex items-center gap-2"
                >
                  <span>Get a Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
}
