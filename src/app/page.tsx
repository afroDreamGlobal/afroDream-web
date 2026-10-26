import React from 'react';
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
import Link from 'next/link';
import { ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const revalidate = 0;

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

        {/* Request a Quote Section */}
        <section id="quote-section" className="py-20 lg:py-28 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-brand-blue block mb-1">
                    FREIGHT INQUIRIES
                  </span>
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading uppercase text-brand-dark leading-none">
                    REQUEST A FREIGHT QUOTE
                  </h2>
                </div>

                <p className="text-base text-gray-600 leading-relaxed font-light">
                  Partner with an established African logistics provider. Whether you need
                  container slots from Mtwara Port, bulk vessel chartering, or inland delivery to Indian
                  processing centers, our commercial team is ready to structure your freight plan.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">
                      <strong>Transparent Quotations:</strong> Direct carrier terms with zero
                      unforeseen demurrage charges.
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">
                      <strong>Commodity Expertise:</strong> Decades of combined experience in Raw Cashew
                      Nuts (RCN) packing, ventilation, and transit care.
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">
                      <strong>End-to-End Handling:</strong> From farm collection warehouses in Tanzania
                      to delivery at your factory door in India.
                    </span>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-brand-bg border border-brand-border space-y-2">
                  <div className="text-xs font-bold uppercase text-brand-dark tracking-wider">
                    Need Immediate Assistance?
                  </div>
                  <div className="text-sm text-gray-700">
                    Reach our direct booking operations desk on WhatsApp:{' '}
                    <a
                      href={`https://wa.me/${(settings.whatsappNumber || settings.phoneTanzania || '255744555890').replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-brand-blue hover:underline"
                    >
                      {settings.whatsappNumber || settings.phoneTanzania || '+255 744 555 890'}
                    </a>
                  </div>
                </div>
              </div>

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
