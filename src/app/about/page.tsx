import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { store } from '@/lib/store';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { SiteSettings } from '@/lib/types';
import { Shield, Globe, Anchor } from 'lucide-react';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'About Us — Afro Dream Global | African Freight Forwarding & Logistics',
  description:
    'Learn about Afro Dream Global, our operations through CAJU SWIFT SARL in Guinea-Bissau since 2022, and our containerized Raw Cashew Nut shipping network in Tanzania.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Us — Afro Dream Global | African Freight Forwarding & Logistics',
    description:
      'Learn about Afro Dream Global, our operations through CAJU SWIFT SARL in Guinea-Bissau since 2022, and our containerized Raw Cashew Nut shipping network in Tanzania.',
    url: '/about',
    type: 'website',
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

export default async function AboutPage() {
  const settings = await getLiveSettings();

  const heroImage =
    settings.heroBannerImageUrl ||
    'https://res.cloudinary.com/h8ygrg0x/image/upload/v1792683054/afrodreamglobal/qz5w6pmekttac4vuewhd.png';
  const aboutImage =
    settings.aboutImageUrl ||
    'https://res.cloudinary.com/h8ygrg0x/image/upload/v1792682872/afrodreamglobal/afgudguzik42xzhqveoo.png';

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar
        announcementText={settings.announcementBarText}
        phoneText={settings.phoneTanzania}
        emailText={settings.primaryEmail}
      />

      <main className="flex-grow">
        {/* Hero Banner */}
        <section className="bg-brand-dark text-white py-20 lg:py-24 relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20">
            <Image
              src={heroImage}
              alt="Afro Dream Global maritime shipping and port logistics operations"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <span className="text-xs font-bold tracking-widest uppercase text-cyan-400 block mb-2 font-sans">
              CORPORATE PROFILE
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading uppercase text-white leading-tight">
              CONNECTING AFRICA TO GLOBAL TRADE
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-2xl font-light">
              Built on integrity, commodity specialization, and dedicated port operations across
              East and West Africa.
            </p>
          </div>
        </section>

        {/* Story & Background */}
        <section className="py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-blue block mb-1">
                    OUR HISTORY & IDENTITY
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-heading uppercase text-brand-dark leading-none">
                    AFRO DREAM GLOBAL
                  </h2>
                </div>

                <div className="space-y-4 text-base text-gray-700 leading-relaxed font-light">
                  <p>
                    <strong>AFRO DREAM GLOBAL (CAJU SWIFT SARL / CSS in Guinea-Bissau)</strong> is an
                    international logistics and shipping service provider based in West Africa. Since
                    2022, we have specialized in the containerized shipment of raw cashew nuts,
                    establishing ourselves as a reliable partner in the shipping and logistics industry.
                  </p>
                  <p>
                    With deep operational roots extending from Guinea-Bissau in West Africa to Mtwara
                    Port and southern Tanzania in East Africa, we provide end-to-end cargo handling. We
                    bridge the gap between African commodity producers and global buyers across India,
                    Vietnam, and international consumer markets.
                  </p>
                  <p>
                    Our core mission is straightforward: eliminate supply chain friction, deliver
                    dependable maritime schedules, and safeguard cargo quality through every step of
                    inland haulage, port loading, deep-sea transit, and destination customs clearance.
                  </p>
                </div>

                <div className="pt-4">
                  <Link href="/quote" className="btn-primary px-7 py-3 rounded-lg text-sm font-semibold">
                    Request a Consultation
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100 aspect-[4/3]">
                  <Image
                    src={aboutImage}
                    alt="Afro Dream Global port cargo handling and container operations"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Strategic Pillars */}
        <section className="py-16 bg-brand-bg border-t border-brand-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold tracking-widest uppercase text-brand-blue block mb-1">
                OUR COMMITMENT
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading uppercase text-brand-dark">
                CORE OPERATIONAL PILLARS
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-card border border-brand-border space-y-4">
                <div className="w-12 h-12 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-heading uppercase text-brand-dark">Cargo Integrity</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">
                  Raw cashew nuts require meticulous moisture management, ventilated containers, and
                  experienced stuffing teams. We ensure zero compromise in product quality.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-card border border-brand-border space-y-4">
                <div className="w-12 h-12 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center">
                  <Anchor className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-heading uppercase text-brand-dark">Direct Port Presence</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">
                  Active berths and bonded warehousing at Mtwara Port (Tanzania) and Bissau
                  (Guinea-Bissau), providing priority berthing and prompt bill of lading issuance.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-card border border-brand-border space-y-4">
                <div className="w-12 h-12 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-heading uppercase text-brand-dark">Multimodal Execution</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">
                  From farm collection warehouses across southern Tanzania, ocean freight across the
                  Indian Ocean, to destination port clearing and trucking straight to Indian mills.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
