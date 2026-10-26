import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { store } from '@/lib/store';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { getLivePublishedTeamMembers } from '@/lib/team';
import { SiteSettings } from '@/lib/types';
import TeamClientView from './TeamClientView';
import { ArrowRight } from 'lucide-react';

export const revalidate = 0;

export const metadata = {
  title: 'Our Team — Afro Dream Global | Executive Leadership & Operations',
  description:
    'Meet the specialized maritime strategists, port captains, and logistics architects directing container shipments and bulk vessel operations at Afro Dream Global.',
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

export default async function TeamPage() {
  const settings = await getLiveSettings();
  const teamMembers = await getLivePublishedTeamMembers();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar
        announcementText={settings.announcementBarText}
        phoneText={settings.phoneTanzania}
        emailText={settings.primaryEmail}
      />

      <main className="flex-grow">
        {/* ========================================================================= */}
        {/* HERO BANNER: Matching Services Section Dark Navy Background              */}
        {/* ========================================================================= */}
        <section className="bg-[#0B1522] text-white py-16 lg:py-24 relative overflow-hidden border-b border-white/10">
          {/* Subtle logistics grid pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#2B7CC0_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          {/* Ambient lighting effects */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-blue/15 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-mono uppercase tracking-widest">
              <span>LEADERSHIP & EXPERTISE</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif tracking-tight text-white font-normal max-w-4xl mx-auto leading-tight">
              Our people are our company.
            </h1>

            <p className="text-base sm:text-xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed italic">
              &ldquo;Expertise becomes meaningful when it is shared.&rdquo;
            </p>

            <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto font-light">
              From our operational desks in Mtwara and Bissau to our clearance hubs across Tuticorin, Mangalore, and Ho Chi Minh, meet the team driving your global shipments.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* KEY HIGHLIGHTS STATS BAR (Clean White / Monochrome)                      */}
        {/* ========================================================================= */}
        <section className="bg-slate-900 text-white border-b border-white/10 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-heading text-white">100%</div>
                <div className="text-xs text-gray-300 uppercase tracking-wider font-medium">
                  Direct African Port Control
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-heading text-brand-blue">RCN</div>
                <div className="text-xs text-gray-300 uppercase tracking-wider font-medium">
                  Specialized Cashew Handling
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-heading text-white">24 / 7</div>
                <div className="text-xs text-gray-300 uppercase tracking-wider font-medium">
                  Active Dispatch Desk
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-heading text-brand-blue">END-TO-END</div>
                <div className="text-xs text-gray-300 uppercase tracking-wider font-medium">
                  Farm Door to Factory Mill
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* INTERACTIVE TEAM MEMBERS CLIENT VIEW                                      */}
        {/* ========================================================================= */}
        <section className="py-16 lg:py-24 bg-[#0B1522] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#2B7CC0_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <TeamClientView initialMembers={teamMembers} />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CALL TO ACTION                                                           */}
        {/* ========================================================================= */}
        <section className="py-16 sm:py-20 bg-brand-blue text-white relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading uppercase tracking-wide text-white">
              WORK DIRECTLY WITH OUR SENIOR MARITIME DIRECTORS
            </h2>
            <p className="text-sm sm:text-base text-white/90 max-w-2xl mx-auto font-light leading-relaxed">
              Have specific vessel chartering requirements, container stuffing inquiries, or customs questions at destination ports? Our leadership is accessible and ready to assist.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/quote"
                className="btn-dark px-8 py-3 rounded-lg text-sm font-bold shadow-lg flex items-center gap-2"
              >
                <span>Request a Freight Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="btn-outline-white px-8 py-3 rounded-lg text-sm font-bold"
              >
                <span>Contact Operations Desk</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
