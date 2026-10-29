import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TradeRoutesSection from '@/components/TradeRoutesSection';
import { store } from '@/lib/store';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { TradeRoute, SiteSettings } from '@/lib/types';
import Link from 'next/link';
import { ArrowRight, Anchor, Navigation, Calendar } from 'lucide-react';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Trade Routes & Maritime Corridors — Afro Dream Global',
  description:
    'Pan-African maritime corridors connecting Tanzania and Guinea-Bissau with primary destination sectors across India, Vietnam, and global markets.',
  alternates: {
    canonical: '/trade-routes',
  },
  openGraph: {
    title: 'Trade Routes & Maritime Corridors — Afro Dream Global',
    description:
      'Pan-African maritime corridors connecting Tanzania and Guinea-Bissau with primary destination sectors across India, Vietnam, and global markets.',
    url: '/trade-routes',
    type: 'website',
  },
};

async function getLiveRoutes(): Promise<TradeRoute[]> {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('trade_routes')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapped = data.map((row: any) => {
          let name = row.name;
          let destCountry = row.destination_country || 'India';
          let originCountry = row.origin_country || 'Tanzania & Guinea-Bissau';

          if (name.includes('Tuticorin') || name.includes('South India') || row.id === 'tr-1') {
            name = 'Tanzania & Bissau to India';
            destCountry = 'India Sector';
            originCountry = 'Tanzania & Bissau (Pan-Africa)';
          } else if (name.includes('Vietnam') && !name.includes('India')) {
            name = 'Tanzania & Bissau to Vietnam';
            destCountry = 'Ho Chi Minh City (HCMC) / Cat Lai (Cát Lái), Vietnam';
            originCountry = 'Tanzania & Bissau (Pan-Africa)';
          } else if (row.id === 'tr-3' || name.includes('West Africa')) {
            name = 'Africa to Global Destinations';
            destCountry = 'Worldwide / Global Markets';
            originCountry = 'Pan-Africa (Tanzania & Bissau Base)';
          }

          return {
            id: row.id,
            name,
            originRegion: 'Africa',
            originCountry,
            originPort: 'Tanzania & Bissau Hubs',
            destinationRegion: destCountry,
            destinationCountry: destCountry,
            destinationPort: destCountry,
            transitTime: '14 - 18 Days',
            frequency: row.frequency,
            cargoTypes: Array.isArray(row.cargo_types) ? row.cargo_types : [],
            isActive: row.is_active ?? true,
            isFeatured: row.is_featured ?? false,
          };
        });

        // Filter out redundant 4th route if it duplicates Vietnam
        return mapped.slice(0, 3);
      }
    } catch (err) {
      console.warn('[Supabase Routes Fetch Error]', err);
    }
  }
  return store.getTradeRoutes();
}

async function getLiveSettings(): Promise<SiteSettings> {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data } = await supabaseAdmin
        .from('site_settings')
        .select('settings_data')
        .eq('id', 'primary')
        .maybeSingle();

      if (data?.settings_data) {
        return { ...store.getSettings(), ...data.settings_data };
      }
    } catch (e) {
      console.warn('[Supabase Settings Fetch]', e);
    }
  }
  return store.getSettings();
}

export default async function TradeRoutesPage() {
  const routes = await getLiveRoutes();
  const settings = await getLiveSettings();

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
              TRADE ROUTES &amp; GLOBAL CORRIDORS
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-3xl font-light leading-relaxed">
              Aiming across the entire African continent with active port and inland operations in Tanzania and Guinea-Bissau. 
              Delivering containerized and bulk cargo globally, with primary focus on the India and Vietnam sectors.
            </p>
          </div>
        </section>

        {/* Detailed Route Cards */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

                    {/* Regional & Schedule Details (No specific port constraints) */}
                    <div className="grid grid-cols-2 gap-4 py-3 border-y border-brand-border/60 text-xs text-gray-600">
                      <div>
                        <span className="block text-brand-muted uppercase font-medium">African Origin Base</span>
                        <span className="font-bold text-brand-dark text-sm mt-0.5 block">
                          Tanzania &amp; Bissau (Pan-Africa)
                        </span>
                      </div>
                      <div>
                        <span className="block text-brand-muted uppercase font-medium">Destination Sector</span>
                        <span className="font-bold text-brand-dark text-sm mt-0.5 block">
                          {route.destinationCountry || route.destinationRegion}
                        </span>
                      </div>
                      <div>
                        <span className="block text-brand-muted uppercase font-medium">Average Transit</span>
                        <span className="font-bold text-brand-dark text-sm mt-0.5 block">
                          14 - 18 Days
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
                      href={`/quote?route=${encodeURIComponent(route.name)}`}
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

      <Footer settings={settings} />
    </div>
  );
}
