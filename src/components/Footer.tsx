'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AfroDreamLogo from './AfroDreamLogo';
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  ChevronDown,
  ArrowUpRight,
  Clock,
  Globe2,
} from 'lucide-react';

export default function Footer() {
  // Mobile accordion state — by default, all collapsed for a clean compact mobile view
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    navigation: false,
    services: false,
    contact: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'All Services', href: '/services' },
    { label: 'Trade Routes', href: '/trade-routes' },
    { label: 'Shipment Tracking', href: '/tracking' },
    { label: 'Request a Quote', href: '/quote' },
    { label: 'Contact Us', href: '/contact' },
  ];

  const serviceLinks = [
    { label: 'Container Shipment (Mtwara)', href: '/services/container-shipment' },
    { label: 'Bulk Vessel Shipment', href: '/services/bulk-vessel-shipment' },
    { label: 'Local Transportation (Tanzania)', href: '/services/local-transportation-tanzania' },
    { label: 'Clearing at Port of Destination (POD)', href: '/services/clearing-port-of-destination' },
    { label: 'Local Transportation in India', href: '/services/local-transportation-india' },
  ];

  return (
    <footer className="bg-[#0B1320] text-white border-t border-slate-800/80 pt-12 sm:pt-16 pb-10 relative overflow-hidden">
      {/* Subtle background ambient glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ========================================================================= */}
        {/* MAIN FOOTER GRID (Desktop: 4 Columns; Mobile: Brand + Accordion List)     */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-10 sm:pb-14 border-b border-white/10">
          {/* Brand Column (Always visible, not an accordion) */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-5">
            <AfroDreamLogo variant="white" size="lg" />
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm font-light">
              Premier African shipping, freight forwarding, and multimodal logistics company.
              Specialized in containerized Raw Cashew Nut (RCN) exports and direct port clearing
              across Tanzania, West Africa, India, and Vietnam.
            </p>

            {/* Operating Entities Badges */}
            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-2">
                Operating Entities
              </span>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 text-xs">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>CAJU SWIFT SARL / CSS (Guinea-Bissau)</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                  <span>Afro Dream Global (Mtwara, Tanzania)</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 1: QUICK NAVIGATION (Mobile Accordion / Desktop Static Column)     */}
          {/* ========================================================================= */}
          <div className="lg:col-span-2 border-t border-white/10 pt-3 md:border-none md:pt-0">
            <button
              type="button"
              onClick={() => toggleSection('navigation')}
              className="w-full flex items-center justify-between text-left py-2 md:py-0 md:cursor-default focus:outline-none group"
              aria-expanded={openSections.navigation}
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-blue font-sans">
                Quick Links
              </h4>
              <span className="p-1 rounded-md text-slate-400 group-hover:text-white transition-colors md:hidden">
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    openSections.navigation ? 'rotate-180 text-brand-blue' : ''
                  }`}
                />
              </span>
            </button>

            {/* Content: Collapsible on Mobile, Permanently Visible on Desktop */}
            <div
              className={`transition-all duration-300 ease-in-out md:block ${
                openSections.navigation
                  ? 'max-h-96 opacity-100 mt-3'
                  : 'max-h-0 opacity-0 overflow-hidden md:max-h-none md:opacity-100 md:overflow-visible md:mt-4'
              }`}
            >
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 pb-2 md:pb-0">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-white hover:translate-x-1 transition-all inline-block text-slate-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 2: CORE SERVICES (Mobile Accordion / Desktop Static Column)        */}
          {/* ========================================================================= */}
          <div className="lg:col-span-3 border-t border-white/10 pt-3 md:border-none md:pt-0">
            <button
              type="button"
              onClick={() => toggleSection('services')}
              className="w-full flex items-center justify-between text-left py-2 md:py-0 md:cursor-default focus:outline-none group"
              aria-expanded={openSections.services}
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-blue font-sans">
                Our Core Services
              </h4>
              <span className="p-1 rounded-md text-slate-400 group-hover:text-white transition-colors md:hidden">
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    openSections.services ? 'rotate-180 text-brand-blue' : ''
                  }`}
                />
              </span>
            </button>

            {/* Content: Collapsible on Mobile, Permanently Visible on Desktop */}
            <div
              className={`transition-all duration-300 ease-in-out md:block ${
                openSections.services
                  ? 'max-h-96 opacity-100 mt-3'
                  : 'max-h-0 opacity-0 overflow-hidden md:max-h-none md:opacity-100 md:overflow-visible md:mt-4'
              }`}
            >
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 pb-2 md:pb-0">
                {serviceLinks.map((service) => (
                  <li key={service.href}>
                    <Link
                      href={service.href}
                      className="hover:text-white hover:translate-x-1 transition-all inline-block text-slate-300"
                    >
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 3: CORPORATE CONTACTS (Mobile Accordion / Desktop Static Column)   */}
          {/* ========================================================================= */}
          <div className="lg:col-span-3 border-t border-white/10 pt-3 md:border-none md:pt-0">
            <button
              type="button"
              onClick={() => toggleSection('contact')}
              className="w-full flex items-center justify-between text-left py-2 md:py-0 md:cursor-default focus:outline-none group"
              aria-expanded={openSections.contact}
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-blue font-sans">
                Corporate Contacts
              </h4>
              <span className="p-1 rounded-md text-slate-400 group-hover:text-white transition-colors md:hidden">
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    openSections.contact ? 'rotate-180 text-brand-blue' : ''
                  }`}
                />
              </span>
            </button>

            {/* Content: Collapsible on Mobile, Permanently Visible on Desktop */}
            <div
              className={`transition-all duration-300 ease-in-out md:block ${
                openSections.contact
                  ? 'max-h-96 opacity-100 mt-3'
                  : 'max-h-0 opacity-0 overflow-hidden md:max-h-none md:opacity-100 md:overflow-visible md:mt-4'
              }`}
            >
              <div className="space-y-3 text-xs sm:text-sm text-slate-300 pb-2 md:pb-0">
                <div className="flex items-start space-x-2.5">
                  <MapPin className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300 leading-snug">
                    Mtwara Port Logistics Corridor, Tanzania & CAJU SWIFT SARL, Bissau.
                  </span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Phone className="w-4 h-4 text-brand-blue flex-shrink-0" />
                  <a
                    href="tel:+255744555890"
                    className="hover:text-white text-xs text-slate-300 transition-colors"
                  >
                    +255 744 555 890 (Tanzania)
                  </a>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Mail className="w-4 h-4 text-brand-blue flex-shrink-0" />
                  <a
                    href="mailto:info@afrodreamglobal.com"
                    className="hover:text-white text-xs text-slate-300 transition-colors"
                  >
                    info@afrodreamglobal.com
                  </a>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Mail className="w-4 h-4 text-brand-blue flex-shrink-0" />
                  <a
                    href="mailto:quotes@afrodreamglobal.com"
                    className="hover:text-white text-xs text-slate-300 transition-colors"
                  >
                    quotes@afrodreamglobal.com
                  </a>
                </div>

                <div className="pt-2">
                  <Link
                    href="/quote"
                    className="btn-primary w-full text-center py-2.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-md shadow-brand-blue/20"
                  >
                    <span>Inquire For Seasonal Rates</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FOOTER BOTTOM BAR                                                         */}
        {/* ========================================================================= */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} Afro Dream Global. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link href="/about" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <Link href="/about" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <Link
              href="/admin/login"
              className="hover:text-brand-blue text-slate-500 transition-colors flex items-center space-x-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Management</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Quick Connect Button */}
      <a
        href="https://wa.me/255744555890?text=Hello%20Afro%20Dream%20Global,%20I%20would%20like%20to%20inquire%20about%20shipping%20services."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-30 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center focus:outline-none"
        aria-label="Connect on WhatsApp"
        title="Chat on WhatsApp"
      >
        <svg
          className="w-7 h-7 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.301-.15-1.782-.879-2.058-.98-.276-.1-.477-.15-.678.15-.2.301-.778.98-.954 1.18-.176.2-.351.226-.653.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.787-1.677-2.088-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.151-.176.201-.301.301-.502.1-.2.05-.376-.025-.526-.075-.15-.678-1.634-.929-2.238-.244-.589-.493-.509-.678-.519-.176-.01-.376-.01-.577-.01-.2 0-.527.075-.803.376s-1.054 1.029-1.054 2.509 1.079 2.91 1.23 3.111c.15.201 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.635.722.23 1.38.197 1.9.12.58-.086 1.782-.728 2.032-1.431.251-.703.251-1.305.176-1.431-.076-.126-.277-.201-.578-.352zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.18L2 22l4.981-1.398A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.628 0-3.136-.502-4.385-1.363l-.314-.216-2.96.83.84-2.884-.236-.339A8.17 8.17 0 013.8 12c0-4.521 3.679-8.2 8.2-8.2 4.521 0 8.2 3.679 8.2 8.2 0 4.521-3.679 8.2-8.2 8.2z" />
        </svg>
      </a>
    </footer>
  );
}
