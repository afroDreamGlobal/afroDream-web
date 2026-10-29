import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QuoteForm from '@/components/QuoteForm';
import { getLiveSettings } from '@/lib/settings';
import { ShieldCheck, CheckCircle2, Phone, Mail } from 'lucide-react';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Request a Freight Quote — Afro Dream Global',
  description:
    'Submit your shipping inquiry for container shipments, bulk vessels, and inland transport between Africa, India, and Vietnam.',
  alternates: {
    canonical: '/quote',
  },
  openGraph: {
    title: 'Request a Freight Quote — Afro Dream Global',
    description:
      'Submit your shipping inquiry for container shipments, bulk vessels, and inland transport between Africa, India, and Vietnam.',
    url: '/quote',
    type: 'website',
  },
};

export default async function QuotePage({
  searchParams,
}: {
  searchParams: { service?: string; origin?: string; destination?: string };
}) {
  const settings = await getLiveSettings();
  const defaultService = searchParams.service || 'Container Shipment';

  const phoneTanzania = settings.phoneTanzania || '+255 744 555 890';
  const phoneGuineaBissau = settings.phoneGuineaBissau || '+245 955 888 123';
  const emailQuotes = settings.quotesEmail || 'quotes@afrodreamglobal.com';

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FA]">
      <Navbar
        announcementText={settings.announcementBarText}
        phoneText={phoneTanzania}
        emailText={settings.primaryEmail}
      />

      <main className="flex-grow py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-xs font-bold tracking-widest uppercase text-brand-blue block mb-2 font-sans">
              COMMERCIAL INQUIRIES
            </span>
            <h1 className="text-4xl sm:text-6xl font-heading uppercase text-brand-dark leading-tight">
              REQUEST A SHIPPING QUOTE
            </h1>
            <p className="mt-3 text-base text-gray-600 font-light">
              Submit your cargo specifications and target shipping corridor. Our operations desk
              calculates real-time freight rates, bunker adjustments, and equipment availability.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Form Section */}
            <div className="lg:col-span-8">
              <QuoteForm defaultService={defaultService} />
            </div>

            {/* Sidebar Information */}
            <div className="lg:col-span-4 space-y-6">
              {/* Direct Support */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-card border border-brand-border space-y-4">
                <h3 className="font-heading text-xl uppercase text-brand-dark">
                  Direct Freight Desk
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  For immediate peak-season cashew bookings or bulk charter vessel inquiries, you can
                  also contact our coordination offices directly.
                </p>

                <div className="space-y-3 pt-2 text-xs text-gray-700">
                  <div className="flex items-start space-x-2.5">
                    <Phone className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-brand-dark">Tanzania Operations (Mtwara)</div>
                      <a
                        href={`tel:${phoneTanzania.replace(/\s+/g, '')}`}
                        className="text-brand-blue hover:underline"
                      >
                        {phoneTanzania}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <Phone className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-brand-dark">West Africa (CAJU SWIFT SARL)</div>
                      <a
                        href={`tel:${phoneGuineaBissau.replace(/\s+/g, '')}`}
                        className="text-brand-blue hover:underline"
                      >
                        {phoneGuineaBissau}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <Mail className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-brand-dark">Email Inquiries</div>
                      <a href={`mailto:${emailQuotes}`} className="text-brand-blue hover:underline">
                        {emailQuotes}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="bg-brand-dark text-white rounded-2xl p-6 sm:p-7 shadow-xl space-y-4">
                <div className="flex items-center space-x-2 text-brand-blue">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Our Freight Guarantee
                  </span>
                </div>
                <div className="space-y-3 text-xs text-gray-300 font-light leading-relaxed">
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
                    <span>Real-time vessel booking verification and slot confirmation.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
                    <span>Compliant phytosanitary and export documentation management.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
                    <span>Direct POD customs clearing in Tuticorin, Mangalore & Ho Chi Minh.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
