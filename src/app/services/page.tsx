import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { store } from '@/lib/store';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, ChevronRight, Shield, Anchor, Truck, Box, Navigation } from 'lucide-react';

export const metadata = {
  title: 'Our Services — Afro Dream Global | Shipping, Bulk Vessels & Multimodal Freight',
  description:
    'Explore our comprehensive shipping solutions including Container Shipments from Mtwara Port, Bulk Vessel Shipments, Inland Logistics in Tanzania & India, and Destination Port Clearing.',
};

export default function ServicesPage() {
  const services = store.getPublishedServices();
  const settings = store.getSettings();

  return (
    <div className="flex flex-col min-h-screen bg-[#091422] text-white">
      <Navbar
        announcementText={settings.announcementBarText}
        phoneText={settings.phoneTanzania}
        emailText={settings.primaryEmail}
      />

      <main className="flex-grow">
        {/* Top Hero Banner Matching Reference Image 1 */}
        <section className="relative h-[320px] sm:h-[380px] lg:h-[440px] flex items-end overflow-hidden">
          {/* Background image of trucks at port during golden hour */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=2000&q=85')`,
            }}
          >
            {/* Dark & Sunset gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#091422] via-[#091422]/60 to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#091422]/90 via-transparent to-transparent" />
          </div>

          {/* Angled Brand Blue Graphic Slash on Bottom Left (As seen in Reference Image 1) */}
          <div className="absolute bottom-0 left-0 w-48 sm:w-80 h-16 sm:h-24 bg-brand-blue transform -skew-y-3 origin-bottom-left -mb-6 z-10 opacity-90" />

          {/* Big Display Headline */}
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-heading uppercase text-white leading-[0.9] tracking-tight">
              GIVE A LOOK TO <br />
              <span className="text-white">OUR SERVICES</span>
            </h1>
          </div>
        </section>

        {/* Vertical Timeline / Divider Content Layout (Matching Reference Image 1) */}
        <section className="py-16 sm:py-24 bg-[#091422] relative">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative">
              {/* Central vertical divider line on desktop */}
              <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-0.5 bg-white/40 transform -translate-x-1/2" />

              <div className="space-y-16 sm:space-y-24">
                {services.map((service, index) => {
                  return (
                    <div
                      key={service.id}
                      className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center"
                    >
                      {/* Timeline Dot in the center on Desktop */}
                      <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] z-10 items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                      </div>

                      {/* Left Column: Title (Right-aligned on desktop matching reference 1) */}
                      <div className="md:text-right pr-0 md:pr-4">
                        <span className="text-xs font-semibold text-brand-blue uppercase tracking-widest block mb-1">
                          Service 0{index + 1}
                        </span>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sans text-white leading-tight">
                          {service.title}
                        </h2>
                        {service.routeHighlight && (
                          <p className="text-xs text-cyan-400 mt-2 font-medium tracking-wide">
                            {service.routeHighlight}
                          </p>
                        )}
                      </div>

                      {/* Right Column: Description + Details Link */}
                      <div className="pl-0 md:pl-4 space-y-4">
                        <p className="text-base sm:text-lg text-gray-200 font-light leading-relaxed">
                          {service.shortDescription}
                        </p>

                        <div className="pt-2 flex flex-wrap items-center gap-3">
                          <Link
                            href={`/services/${service.slug}`}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-blue hover:text-cyan-300 transition-colors"
                          >
                            <span>View Full Specifications</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>

                          <Link
                            href={`/quote?service=${encodeURIComponent(service.title)}`}
                            className="btn-primary text-xs px-4 py-2 rounded-md font-semibold"
                          >
                            Request Quote
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Callout Box */}
            <div className="mt-24 p-8 sm:p-12 rounded-2xl bg-gradient-to-r from-brand-blue/20 via-[#122338] to-[#122338] border border-brand-blue/30 shadow-2xl text-center space-y-6">
              <h3 className="text-3xl sm:text-4xl font-heading uppercase text-white">
                Custom Logistics Architecture Required?
              </h3>
              <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto font-light">
                We design specialized charter agreements, multi-warehouse consolidation in southern
                Tanzania, and customs clearance protocols customized to your commodity schedule.
              </p>
              <div className="pt-2">
                <Link
                  href="/quote"
                  className="btn-primary px-8 py-3.5 text-sm font-semibold rounded-lg shadow-lg shadow-brand-blue/30"
                >
                  Request a Tailored Freight Proposal
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
