import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { store } from '@/lib/store';
import { Phone, Mail, MapPin, Clock, MessageSquare, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Contact Us — Afro Dream Global | Offices in Tanzania, Guinea-Bissau & India',
  description:
    'Contact Afro Dream Global operations desk for vessel schedules, container allocations, and customs clearance inquiries.',
};

export default function ContactPage() {
  const settings = store.getSettings();

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FA]">
      <Navbar
        announcementText={settings.announcementBarText}
        phoneText={settings.phoneTanzania}
        emailText={settings.primaryEmail}
      />

      <main className="flex-grow py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-widest uppercase text-brand-blue block mb-2 font-sans">
              GLOBAL CONTACT NETWORK
            </span>
            <h1 className="text-4xl sm:text-6xl font-heading uppercase text-brand-dark leading-tight">
              CONNECT WITH OUR FREIGHT TEAM
            </h1>
            <p className="mt-3 text-base text-gray-600 font-light">
              Our regional operations desks in East Africa, West Africa, and India are available to
              coordinate your shipping logistics.
            </p>
          </div>

          {/* Regional Hub Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* East Africa Hub */}
            <div className="bg-white rounded-2xl p-7 shadow-card border border-brand-border space-y-4">
              <div className="w-10 h-10 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold text-sm">
                TZ
              </div>
              <h3 className="text-xl font-heading uppercase text-brand-dark">
                Tanzania Operations Desk
              </h3>
              <p className="text-xs text-brand-muted">
                Port Operations & Southern Tanzania Inland Transportation
              </p>
              <div className="space-y-2.5 pt-2 text-xs text-gray-700">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
                  <span>Mtwara Port Logistics Corridor, Mtwara, Tanzania</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-brand-blue flex-shrink-0" />
                  <a href="tel:+255744555890" className="text-brand-blue hover:underline">
                    +255 744 555 890
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-brand-blue flex-shrink-0" />
                  <a href="mailto:info@afrodreamglobal.com" className="text-brand-blue hover:underline">
                    info@afrodreamglobal.com
                  </a>
                </div>
              </div>
            </div>

            {/* West Africa Hub */}
            <div className="bg-white rounded-2xl p-7 shadow-card border border-brand-border space-y-4">
              <div className="w-10 h-10 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold text-sm">
                GW
              </div>
              <h3 className="text-xl font-heading uppercase text-brand-dark">
                West Africa Regional Hub
              </h3>
              <p className="text-xs text-brand-muted">
                CAJU SWIFT SARL / CSS (Guinea-Bissau Est. 2022)
              </p>
              <div className="space-y-2.5 pt-2 text-xs text-gray-700">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
                  <span>Port Commercial Sector, Bissau, Guinea-Bissau</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-brand-blue flex-shrink-0" />
                  <a href="tel:+245955888123" className="text-brand-blue hover:underline">
                    +245 955 888 123
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-brand-blue flex-shrink-0" />
                  <a href="mailto:bissau@afrodreamglobal.com" className="text-brand-blue hover:underline">
                    bissau@afrodreamglobal.com
                  </a>
                </div>
              </div>
            </div>

            {/* India Operations */}
            <div className="bg-white rounded-2xl p-7 shadow-card border border-brand-border space-y-4">
              <div className="w-10 h-10 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold text-sm">
                IN
              </div>
              <h3 className="text-xl font-heading uppercase text-brand-dark">
                India Port Clearance & Logistics
              </h3>
              <p className="text-xs text-brand-muted">
                Tuticorin & Mangalore POD Customs & Domestic Trucking
              </p>
              <div className="space-y-2.5 pt-2 text-xs text-gray-700">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
                  <span>Harbour Gate Road, Tuticorin & New Mangalore Port, India</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-brand-blue flex-shrink-0" />
                  <a href="tel:+919840123456" className="text-brand-blue hover:underline">
                    +91 98401 23456
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-brand-blue flex-shrink-0" />
                  <a href="mailto:india@afrodreamglobal.com" className="text-brand-blue hover:underline">
                    india@afrodreamglobal.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Consultation CTA */}
          <div className="bg-brand-dark text-white rounded-2xl p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-heading uppercase text-white">
                Ready to secure container capacity or charter space?
              </h3>
              <p className="text-sm text-gray-300 font-light max-w-xl">
                Submit an inquiry through our dedicated quote system for immediate tariff analysis and
                sailing options.
              </p>
            </div>
            <Link
              href="/quote"
              className="btn-primary px-8 py-3.5 rounded-xl font-semibold text-sm flex-shrink-0"
            >
              Request a Shipping Quote
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
