import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TradeRoutesSection from '@/components/TradeRoutesSection';
import { store } from '@/lib/store';
import Link from 'next/link';
import { ArrowRight, Anchor, Navigation, Calendar } from 'lucide-react';

export const metadata = {
  title: 'Trade Routes & Port Corridors — Afro Dream Global',
  description:
    'Direct maritime trade corridors connecting Mtwara Port (Tanzania) and Bissau (Guinea-Bissau) with Tuticorin, Mangalore, Mundra, and Ho Chi Minh.',
};

export default function TradeRoutesPage() {
  const routes = store.getTradeRoutes();
  const settings = store.getSettings();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar
        announcementText={settings.announcementBarText}
        phoneText={settings.phoneTanzania}
        emailText={settings.primaryEmail}
      />

      <main className="flex-grow">
        {/* Banner */}
        <section className="bg-brand-dark text-white py-16 sm:py-20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <span className="text-xs font-bold tracking-widest uppercase text-cyan-400 block mb-2 font-sans">
              GLOBAL LOGISTICS NETWORK
            </span>
            <h1 className="text-4xl sm:text-6xl font-heading uppercase text-white leading-tight">
              TRADE ROUTES & DESTINATION PORTS
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-2xl font-light">
              Connecting primary agricultural harvest origins across Africa to international processing
              and commodity consumer centers.
            </p>
          </div>
        </section>

        {/* Detailed Route Cards */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {routes.map((route) => (
                <div
                  key={route.id}
                  className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-brand-border space-y-5 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-blue bg-brand-blue-light px-3 py-1 rounded-md">
                        {route.originRegion} &rarr; {route.destinationRegion}
                      </span>
                      <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Active Sailing
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold font-sans text-brand-dark">
                      {route.name}
                    </h2>

                    <div className="grid grid-cols-2 gap-4 py-3 border-y border-brand-border/60 text-xs text-gray-600">
                      <div>
                        <span className="block text-brand-muted uppercase font-medium">Origin Port</span>
                        <span className="font-bold text-brand-dark text-sm mt-0.5 block">
                          {route.originPort}, {route.originCountry}
                        </span>
                      </div>
                      <div>
                        <span className="block text-brand-muted uppercase font-medium">Destination Port</span>
                        <span className="font-bold text-brand-dark text-sm mt-0.5 block">
                          {route.destinationPort}, {route.destinationCountry}
                        </span>
                      </div>
                      <div>
                        <span className="block text-brand-muted uppercase font-medium">Average Transit</span>
                        <span className="font-bold text-brand-dark text-sm mt-0.5 block">
                          {route.transitTime}
                        </span>
                      </div>
                      <div>
                        <span className="block text-brand-muted uppercase font-medium">Departure Schedule</span>
                        <span className="font-bold text-brand-dark text-sm mt-0.5 block">
                          {route.frequency}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-brand-muted block mb-1.5 font-medium">
                        Standard Cargo Handled:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {route.cargoTypes.map((cargo, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] px-2.5 py-1 rounded bg-gray-100 text-gray-700 font-medium"
                          >
                            {cargo}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      href={`/quote?origin=${encodeURIComponent(route.originPort)}&destination=${encodeURIComponent(route.destinationPort)}`}
                      className="btn-primary w-full text-center py-2.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-2"
                    >
                      <span>Book Slots on this Corridor</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Map Visualizer */}
        <TradeRoutesSection routes={routes} />
      </main>

      <Footer />
    </div>
  );
}
