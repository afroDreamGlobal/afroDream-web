import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Building2,
  Anchor,
  Truck,
  FileCheck2,
} from 'lucide-react';

interface AboutSectionProps {
  headline?: string;
  description?: string;
  imageUrl?: string;
}

const DEFAULT_ABOUT_IMAGE =
  'https://res.cloudinary.com/h8ygrg0x/image/upload/v1792682872/afrodreamglobal/afgudguzik42xzhqveoo.png';

export default function AboutSection({
  headline = 'ABOUT AFRO DREAM GLOBAL',
  description = 'AFRO DREAM GLOBAL (C.A.J.U SWIFT SARL / CSS in Guinée-Bissau) is a logistics and shipping service provider based in West Africa. Since 2022, we have specialized in the containerized shipment of raw cashew nuts, establishing ourselves as a reliable partner in the shipping and logistics industry.',
  imageUrl,
}: AboutSectionProps) {
  const activeImage = imageUrl?.trim() || DEFAULT_ABOUT_IMAGE;

  // Features matching the referral screenshot
  const features = [
    {
      icon: Building2,
      title: 'RCN Commodity Focus',
      description: 'Specialized in raw cashew nuts with strict quality control.',
    },
    {
      icon: Anchor,
      title: 'Direct Port Corridor',
      description: 'Proximity to major West African ports for faster turnaround.',
    },
    {
      icon: Truck,
      title: 'Multimodal Delivery',
      description: 'Flexible solutions by sea, road and air.',
    },
    {
      icon: FileCheck2,
      title: 'Customs Clearance',
      description: 'End-to-end support with documentation and compliance.',
    },
  ];

  return (
    <section className="py-10 sm:py-20 lg:py-24 bg-white relative overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========================================================================= */}
        {/* TOP ROW: 2-COLUMN CORPORATE PROFILE + UPLOADABLE WAREHOUSE IMAGE          */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6">
            <div>
              <span className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-brand-blue block mb-2 font-sans">
                CORPORATE PROFILE
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-heading uppercase text-slate-900 leading-none tracking-tight">
                ABOUT <span className="text-brand-blue">AFRO DREAM GLOBAL</span>
              </h2>
            </div>

            <p className="text-sm sm:text-lg text-slate-600 leading-relaxed font-sans font-light">
              {description}
            </p>

            <div className="pt-1 hidden lg:block">
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-sm shadow-md shadow-brand-blue/30 transition-all active:scale-[0.98] group"
              >
                <span>Discover Our Operations</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column: Uploadable Corporate / Warehouse Image with Operations Badge */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 group aspect-[16/10] bg-slate-900">
              {/* Facility Image */}
              <Image
                src={activeImage}
                alt="Afro Dream Global and CAJU SWIFT SARL cashew warehouse and freight handling facility"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM ROW: 4 FEATURE CARDS (Mobile: Compact 2 per row; Desktop: 4 row)   */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-5 mt-4 sm:mt-12 items-stretch">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="h-full bg-slate-50/70 hover:bg-white rounded-lg sm:rounded-2xl p-2 sm:p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 hover:border-brand-blue/40 group"
              >
                {/* Top Row on Mobile: Compact Icon + Step Counter */}
                <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto">
                  <div className="w-6 h-6 sm:w-11 sm:h-11 rounded-md sm:rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-brand-blue flex-shrink-0 group-hover:bg-brand-blue group-hover:text-white transition-colors duration-200 shadow-2xs">
                    <Icon className="w-3 h-3 sm:w-5 sm:h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-[8px] font-bold text-slate-300 sm:hidden">
                    0{idx + 1}
                  </span>
                </div>

                {/* Text Content — Compact on Mobile */}
                <div className="min-w-0 flex-1">
                  <h4 className="text-[10px] sm:text-sm font-bold text-slate-900 leading-tight group-hover:text-brand-blue transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-[8.5px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1 leading-snug line-clamp-2 sm:line-clamp-none">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* MOBILE CTA BUTTON: Centered below the 4 cards at the section conclusion   */}
        {/* ========================================================================= */}
        <div className="mt-5 flex justify-center lg:hidden">
          <Link
            href="/about"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-xs shadow-md shadow-brand-blue/25 transition-all active:scale-[0.98] group"
          >
            <span>Discover Our Operations</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
