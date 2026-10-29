import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ServiceHighlightsBar from '@/components/ServiceHighlightsBar';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import TradeRoutesSection from '@/components/TradeRoutesSection';
import TeamSection from '@/components/TeamSection';
import QuoteForm from '@/components/QuoteForm';
import Footer from '@/components/Footer';
import { store } from '@/lib/store';
import { getLivePublishedServices } from '@/lib/services';
import { getLivePublishedTeamMembers } from '@/lib/team';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { SiteSettings } from '@/lib/types';
import {
  ShieldCheck,
  Ship,
  Truck,
} from 'lucide-react';

export const revalidate = 0;

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

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

async function getLiveRoutes() {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('trade_routes')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return data.map((row: any) => ({
          id: row.id,
          name: row.name,
          originRegion: row.origin_region,
          originCountry: row.origin_country,
          originPort: row.origin_port,
          destinationRegion: row.destination_region,
          destinationCountry: row.destination_country,
          destinationPort: row.destination_port,
          transitTime: row.transit_time,
          frequency: row.frequency,
          cargoTypes: Array.isArray(row.cargo_types) ? row.cargo_types : [],
          isActive: row.is_active ?? true,
          isFeatured: row.is_featured ?? false,
        }));
      }
    } catch (err) {
      console.warn('[Supabase Routes Fetch Error]', err);
    }
  }
  return store.getTradeRoutes();
}

export default async function HomePage() {
  const services = await getLivePublishedServices();
  const tradeRoutes = await getLiveRoutes();
  const teamMembers = await getLivePublishedTeamMembers();
  const settings = await getLiveSettings();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        announcementText={settings.announcementBarText}
        phoneText={settings.phoneTanzania}
        emailText={settings.primaryEmail}
      />

      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection
          badge={settings.heroBadge}
          headline={settings.heroHeadline}
          subheadline={settings.heroSubheadline}
          bannerImageUrl={settings.heroBannerImageUrl}
          mobileBannerImageUrl={settings.heroMobileBannerImageUrl}
          showTextOverlay={settings.showHeroTextOverlay ?? true}
          showCtaButtons={settings.showHeroCtaButtons ?? true}
        />

        {/* Service Highlights Bar immediately beneath hero */}
        <ServiceHighlightsBar />

        {/* About Afro Dream Global Section */}
        <AboutSection
          headline={settings.aboutHeadline}
          description={settings.aboutDescription}
          imageUrl={settings.aboutImageUrl}
        />

        {/* Our Services Section with 5 Cards */}
        <ServicesSection services={services} />

        {/* Trade Routes & Global Destinations */}
        <TradeRoutesSection routes={tradeRoutes} />

        {/* Team Leadership Section (Exact match with reference design) */}
        <TeamSection teamMembers={teamMembers} />

        {/* Request a Quote Section (Freight Inquiries) */}
        <section
          id="quote-section"
          className="py-16 sm:py-24 lg:py-28 bg-gradient-to-b from-[#F5F8FC] via-[#EEF4FB] to-[#E8F0F9] relative border-t border-slate-200/80"
        >
          {/* Subtle Ambient Glows - safely contained */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[140px]" />
            <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-cyan-400/10 rounded-full blur-[120px]" />
            <div className="absolute inset-0 bg-[radial-gradient(#2B7CC0_1px,transparent_1px)] [background-size:28px_28px] opacity-10" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              {/* Left Column: Heading, Value Cards (Sticky alongside form on desktop) */}
              <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28 lg:self-start">
                <div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase mb-3 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
                    <span>FREIGHT INQUIRIES</span>
                  </div>

                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading uppercase text-brand-dark leading-[0.95] tracking-tight">
                    REQUEST A <span className="bg-gradient-to-r from-brand-blue via-[#1E67A2] to-cyan-600 bg-clip-text text-transparent">FREIGHT QUOTE</span>
                  </h2>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light mt-3">
                    Partner with an established African logistics provider. Whether you need
                    dedicated container slots from <strong className="font-semibold text-slate-800">Mtwara Port</strong>, bulk vessel chartering, or inland delivery to Indian & Vietnamese processing centers, our commercial desk is ready to structure your freight plan.
                  </p>
                </div>

                {/* 3 High-Impact Value Proposition Cards */}
                <div className="space-y-3 pt-1">
                  <div className="p-4 rounded-xl bg-white/90 backdrop-blur-sm border border-slate-200/90 shadow-sm hover:shadow-md hover:border-brand-blue/40 hover:translate-x-1 transition-all duration-200 flex items-start gap-3.5 group">
                    <div className="w-10 h-10 rounded-xl bg-brand-blue/10 border border-brand-blue/20 text-brand-blue flex items-center justify-center flex-shrink-0 group-hover:bg-brand-blue group-hover:text-white transition-colors duration-200">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-brand-dark">Transparent Carrier Tariffs</div>
                      <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                        Direct shipping line terms with confirmed rates and zero unforeseen demurrage charges.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/90 backdrop-blur-sm border border-slate-200/90 shadow-sm hover:shadow-md hover:border-cyan-500/40 hover:translate-x-1 transition-all duration-200 flex items-start gap-3.5 group">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-600 group-hover:text-white transition-colors duration-200">
                      <Ship className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-brand-dark">RCN Commodity Care & Ventilation</div>
                      <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                        Decades of combined expertise in Raw Cashew Nut humidity management and vessel stowage.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/90 backdrop-blur-sm border border-slate-200/90 shadow-sm hover:shadow-md hover:border-indigo-500/40 hover:translate-x-1 transition-all duration-200 flex items-start gap-3.5 group">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-brand-dark">End-to-End Multimodal Execution</div>
                      <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                        From farm collection warehouses in Tanzania to factory-door delivery in India & Vietnam.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Quote Form Card */}
              <div className="lg:col-span-7">
                <QuoteForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
