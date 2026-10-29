import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { store } from '@/lib/store';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { getLivePublishedTeamMembers } from '@/lib/team';
import { SiteSettings } from '@/lib/types';
import TeamClientView from './TeamClientView';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Our Team — Afro Dream Global | Executive Leadership & Operations',
  description:
    'Meet the specialized maritime strategists, port captains, and on-ground logistics architects directing container shipments and bulk vessel operations at Afro Dream Global.',
  alternates: {
    canonical: '/team',
  },
  openGraph: {
    title: 'Our Team — Afro Dream Global | Executive Leadership & Operations',
    description:
      'Meet the specialized maritime strategists, port captains, and on-ground logistics architects directing container shipments and bulk vessel operations at Afro Dream Global.',
    url: '/team',
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-sans font-bold uppercase tracking-widest">
              <span>LEADERSHIP & REGIONAL OPERATIONS</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading uppercase tracking-wide text-white font-normal max-w-4xl mx-auto leading-tight">
              Our people are our company.
            </h1>

            <p className="text-base sm:text-xl text-gray-300 font-sans font-light max-w-2xl mx-auto leading-relaxed italic">
              &ldquo;Expertise becomes meaningful when it is shared.&rdquo;
            </p>
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
      </main>

      <Footer settings={settings} />
    </div>
  );
}
