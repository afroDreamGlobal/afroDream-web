import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { store } from '@/lib/store';
import { getLivePublishedServices } from '@/lib/services';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { SiteSettings } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  CheckCircle2,
  Ship,
  Anchor,
  Truck,
  ShieldCheck,
  Clock,
  Sparkles,
  Phone,
} from 'lucide-react';

export const revalidate = 0;

export const metadata = {
  title: 'Our Services — Afro Dream Global | Shipping, Bulk Vessels & Multimodal Freight',
  description:
    'Comprehensive African shipping solutions: Container Shipments from Mtwara Port, Bulk Vessel Shipments, Inland Logistics in Tanzania & India, and Destination Port Clearing.',
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

function getServiceCategoryIcon(category: string, iconName?: string) {
  const cat = (category || '').toLowerCase();
  const ic = (iconName || '').toLowerCase();

  if (cat.includes('ocean') || ic.includes('container')) {
    return <Ship className="w-4 h-4 text-cyan-400" />;
  }
  if (cat.includes('maritime') || cat.includes('bulk') || ic.includes('ship')) {
    return <Anchor className="w-4 h-4 text-cyan-400" />;
  }
  if (cat.includes('inland') || cat.includes('transport') || ic.includes('truck')) {
    return <Truck className="w-4 h-4 text-cyan-400" />;
  }
  if (cat.includes('custom') || cat.includes('clearing') || cat.includes('pod')) {
    return <ShieldCheck className="w-4 h-4 text-cyan-400" />;
  }
  return <Truck className="w-4 h-4 text-cyan-400" />;
}

export default async function ServicesPage() {
  const services = await getLivePublishedServices();
  const settings = await getLiveSettings();

  return (
    <div className="flex flex-col min-h-screen bg-[#07111E] text-white">
      <Navbar
        announcementText={settings.announcementBarText}
        phoneText={settings.phoneTanzania}
        emailText={settings.primaryEmail}
      />

      <main className="flex-grow">
        {/* ========================================================================= */}
        {/* HERO HEADER: Cinematic Maritime Showcase                                  */}
        {/* ========================================================================= */}
        <section className="relative pt-20 pb-20 sm:pt-28 sm:pb-28 overflow-hidden border-b border-white/10">
          {/* Clean dark corporate backdrop with subtle ambient glow */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute -top-32 left-1/4 w-96 h-96 bg-brand-blue/15 rounded-full blur-[120px]" />
            <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
            <div className="absolute inset-0 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-slate-400">Our Services</span>
            </div>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-4">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>SOLUTIONS & CAPABILITIES</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading uppercase text-white tracking-tight leading-[0.95] mb-6">
                SPECIALIZED SHIPPING & PORT HANDLING SERVICES
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
                From primary farm collection and inland warehousing in southern Tanzania to direct
                berthing at Mtwara Port, ocean transit, and priority POD customs clearance across
                India and Vietnam.
              </p>
            </div>

            {/* Quick Capability Metrics Strip */}
            <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <span className="text-xl sm:text-2xl font-bold text-white block leading-none">
                  Mtwara Direct
                </span>
                <span className="text-xs text-cyan-400 font-medium mt-1 block">
                  Southern Tanzania Port Base
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <span className="text-xl sm:text-2xl font-bold text-white block leading-none">
                  14 - 18 Days
                </span>
                <span className="text-xs text-cyan-400 font-medium mt-1 block">
                  Express Indian Ocean Transit
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <span className="text-xl sm:text-2xl font-bold text-white block leading-none">
                  0 Demurrage
                </span>
                <span className="text-xs text-emerald-400 font-medium mt-1 block">
                  21-Day Free Time Protocol
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <span className="text-xl sm:text-2xl font-bold text-white block leading-none">
                  Ventilated 40&apos; HC
                </span>
                <span className="text-xs text-cyan-400 font-medium mt-1 block">
                  RCN Moisture Control Fleet
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* COMPREHENSIVE SERVICE PORTFOLIO (PREMIUM ZIG-ZAG SHOWCASE)                */}
        {/* ========================================================================= */}
        <section className="py-16 sm:py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-16 sm:space-y-24">
              {services.map((service, index) => {
                const isEven = index % 2 === 1;
                const indexStr = String(index + 1).padStart(2, '0');

                return (
                  <div
                    key={service.id}
                    id={service.slug}
                    className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center p-6 sm:p-8 lg:p-10 rounded-3xl bg-[#0B1A2C]/80 border border-white/10 hover:border-cyan-500/40 shadow-xl transition-all duration-300 group"
                  >
                    {/* Visual Media Column */}
                    <div
                      className={`lg:col-span-6 relative aspect-[16/10] sm:aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group-hover:border-cyan-400/50 transition-all ${
                        isEven ? 'lg:order-2' : 'lg:order-1'
                      }`}
                    >
                      <Image
                        src={service.imageUrl}
                        alt={service.title}
                        fill
                        quality={90}
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      />

                      {/* Gentle bottom-vignette scrim */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                      {/* Top Overlay Badge on Image */}
                      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                          {getServiceCategoryIcon(service.category, service.iconName)}
                          <span>{service.category}</span>
                        </div>
                      </div>

                      {/* Service Number on Image Corner */}
                      <div className="absolute bottom-4 right-4 z-10">
                        <span className="w-10 h-10 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-sm font-mono font-bold text-cyan-300 flex items-center justify-center shadow-lg">
                          {indexStr}
                        </span>
                      </div>
                    </div>

                    {/* Detailed Content Column */}
                    <div
                      className={`lg:col-span-6 flex flex-col justify-between space-y-5 ${
                        isEven ? 'lg:order-1' : 'lg:order-2'
                      }`}
                    >
                      <div>
                        {/* Route Tag */}
                        {service.routeHighlight && (
                          <div className="inline-flex items-center px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-300 rounded-md border border-cyan-500/25 bg-cyan-500/10 mb-3">
                            <span>{service.routeHighlight}</span>
                          </div>
                        )}

                        {/* Title */}
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading uppercase text-white tracking-wide leading-tight group-hover:text-cyan-300 transition-colors">
                          {service.title}
                        </h2>

                        {/* Short Description */}
                        <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed mt-3">
                          {service.shortDescription}
                        </p>
                      </div>

                      {/* Key Capabilities Bullet Points */}
                      {service.features && service.features.length > 0 && (
                        <div className="space-y-2.5 pt-2 border-t border-white/10">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                            OPERATIONAL CAPABILITIES
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {service.features.slice(0, 4).map((feat, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-200"
                              >
                                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                                <span className="leading-snug">{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="pt-4 flex flex-wrap items-center gap-3">
                        <Link
                          href={`/services/${service.slug}`}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-cyan-500 hover:from-cyan-500 hover:to-brand-blue text-white text-xs font-bold shadow-md shadow-brand-blue/30 transition-all duration-200 active:scale-[0.98]"
                        >
                          <span>Full Specifications</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>

                        <Link
                          href={`/quote?service=${encodeURIComponent(service.title)}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 hover:border-white/40 transition-all duration-200 active:scale-[0.98]"
                        >
                          <span>Request Rate</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ========================================================================= */}
            {/* TAILORED FREIGHT PROPOSAL CALLOUT BOX                                     */}
            {/* ========================================================================= */}
            <div className="mt-20 lg:mt-28 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0F2644] via-[#0B1A2C] to-[#07111E] border border-cyan-500/30 shadow-2xl relative overflow-hidden text-center">
              {/* Background ambient ring */}
              <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="max-w-2xl mx-auto space-y-5 relative z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-bold tracking-widest uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>CUSTOM LOGISTICS ARCHITECTURE</span>
                </div>

                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-heading uppercase text-white leading-tight">
                  Need a Dedicated Shipping Contract or Charter?
                </h3>

                <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                  We structure custom seasonal bulk vessel charters, farm-to-door multi-modal agreements,
                  and dedicated container volume allocations tailored to your raw cashew nut trade cycle.
                </p>

                <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
                  <Link
                    href="/quote"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-blue to-cyan-500 hover:from-cyan-500 hover:to-brand-blue text-white text-sm font-bold shadow-xl shadow-brand-blue/30 transition-all duration-300 active:scale-[0.98]"
                  >
                    <span>Request a Tailored Freight Proposal</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <a
                    href="tel:+255744555890"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/20 transition-all duration-200"
                  >
                    <Phone className="w-4 h-4 text-cyan-400" />
                    <span>Direct Commercial Desk</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
