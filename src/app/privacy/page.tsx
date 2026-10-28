import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { store } from '@/lib/store';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { SiteSettings } from '@/lib/types';

export const revalidate = 0;

export const metadata = {
  title: 'Privacy Policy — Afro Dream Global',
  description:
    'Privacy Policy of Afro Dream Global. Learn how we handle commercial freight inquiries, consignment documentation, and trade confidentiality.',
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

export default async function PrivacyPolicyPage() {
  const settings = await getLiveSettings();

  return (
    <div className="flex flex-col min-h-screen bg-[#0B1522] text-slate-200">
      <Navbar
        announcementText={settings.announcementBarText}
        phoneText={settings.phoneTanzania}
        emailText={settings.primaryEmail}
      />

      <main className="flex-1">
        {/* Simple, Wide Header */}
        <section className="py-14 sm:py-16 border-b border-white/10 bg-[#0B1522]">
          <div className="max-w-5xl mx-auto px-6 sm:px-8">
            <span className="text-xs font-semibold tracking-widest uppercase text-cyan-400 block mb-2 font-mono">
              AFRO DREAM GLOBAL
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif text-white tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              Last updated: October 2026
            </p>
          </div>
        </section>

        {/* Clean, Simple, Wide Content */}
        <section className="py-12 sm:py-16">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 space-y-10 text-[15px] sm:text-base text-slate-300 leading-relaxed font-light">
            
            {/* 1. Introduction */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-serif text-white font-normal">
                1. Introduction
              </h2>
              <p>
                Afro Dream Global and our operating entities—including <strong className="text-white font-medium">CAJU SWIFT SARL / CSS (Dubai)</strong>, <strong className="text-white font-medium">BREDAS Traders (Tanzania)</strong>, and <strong className="text-white font-medium">Delta Infralogistics Global (India)</strong>—respect your privacy and are committed to protecting the commercial and personal information you share with us.
              </p>
              <p>
                This Privacy Policy explains what information we collect, how it is used, and how we protect your confidentiality when you use our website or engage our freight forwarding and logistics services.
              </p>
            </div>

            {/* 2. Information We Collect */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-serif text-white font-normal">
                2. Information We Collect
              </h2>
              <p>
                We only collect information necessary to provide shipping quotations, manage cargo operations, and comply with maritime trade laws:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li><strong className="text-white font-normal">Contact &amp; Business Details:</strong> Your name, company name, business email address, and phone or WhatsApp number.</li>
                <li><strong className="text-white font-normal">Shipping Inquiries:</strong> Cargo types (e.g., Raw Cashew Nuts, Pulses, Timber), volume, origin port, and destination port.</li>
                <li><strong className="text-white font-normal">Shipping Documents:</strong> Bills of Lading, container numbers, packing lists, commercial invoices, and customs documents necessary to execute shipments.</li>
                <li><strong className="text-white font-normal">Website Logs:</strong> Basic technical information like browser type and IP address for site security and performance.</li>
              </ul>
            </div>

            {/* 3. How We Use Your Information */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-serif text-white font-normal">
                3. How We Use Your Information
              </h2>
              <p>
                We use the information we collect strictly for logistics operations, including:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>Providing freight quotes and coordinating vessel space or chartering</li>
                <li>Arranging container stuffing, local haulage, and customs clearance</li>
                <li>Filing shipping manifests with ocean carriers and port authorities (such as Mtwara Port)</li>
                <li>Providing shipment tracking milestones and operational status updates</li>
                <li>Meeting statutory legal, customs, and tax requirements</li>
              </ul>
            </div>

            {/* 4. Trade Confidentiality */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-serif text-white font-normal">
                4. Trade Confidentiality &amp; Non-Disclosure
              </h2>
              <p>
                Commercial shipping information in global trade is sensitive. We enforce strict confidentiality standards:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li><strong className="text-white font-normal">We never sell, rent, or trade</strong> your business or personal information to third-party marketing brokers.</li>
                <li>Your shipment volumes, rates, and trade documents are accessible only to operational staff directly managing your cargo.</li>
                <li>We maintain standard digital encryption and access controls across our internal systems.</li>
              </ul>
            </div>

            {/* 5. Sharing with Service Partners */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-serif text-white font-normal">
                5. Sharing with Service Partners
              </h2>
              <p>
                To deliver our logistics services, we may share relevant shipping details with trusted partners involved in fulfilling your order:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>Ocean shipping lines and vessel operators</li>
                <li>Port authorities and container terminal operators</li>
                <li>Customs agencies and phytosanitary inspection authorities</li>
                <li>Authorized local trucking and warehouse operators</li>
              </ul>
            </div>

            {/* 6. Data Retention */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-serif text-white font-normal">
                6. Data Retention
              </h2>
              <p>
                We retain shipping records only for the period mandated by maritime regulations, customs guidelines, and statutory accounting laws (typically 5 to 7 years after shipment completion).
              </p>
            </div>

            {/* 7. Your Rights */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-serif text-white font-normal">
                7. Your Rights
              </h2>
              <p>
                You may contact us at any time to review, update, or correct your contact details, or to inquire about the data we maintain regarding your account.
              </p>
            </div>

            {/* 8. Contact Us */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <h2 className="text-xl sm:text-2xl font-serif text-white font-normal">
                8. Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy or your shipping records, please contact our team:
              </p>
              <div className="pt-1 space-y-1 text-slate-300">
                <p><strong className="text-white font-medium">Afro Dream Global</strong></p>
                <p>Email: <a href={`mailto:${settings.primaryEmail || 'info@afrodreamglobal.com'}`} className="text-cyan-400 hover:underline">{settings.primaryEmail || 'info@afrodreamglobal.com'}</a></p>
                <p>Phone: <span className="text-white">{settings.phoneTanzania || '+255 744 555 890'}</span></p>
                <p>Location: <span className="text-slate-400">Mtwara Port Logistics Corridor, Mtwara, Tanzania</span></p>
              </div>
              <div className="pt-3">
                <Link
                  href="/contact"
                  className="text-xs font-bold uppercase tracking-wider text-cyan-400 hover:text-white transition-colors"
                >
                  Contact Operations Desk &rarr;
                </Link>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
