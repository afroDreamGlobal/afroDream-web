'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { Service } from '@/lib/types';

interface ServicesSectionProps {
  services: Service[];
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  const displayServices = services.filter((s) => s.isPublished).slice(0, 5);

  return (
    <section className="py-10 sm:py-14 bg-[#0B1522] text-white relative overflow-hidden border-t border-white/5">
      {/* Subtle background logistics grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#2B7CC0_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Sleek, Compact Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-3 border-b border-white/10 gap-2">
          <div>
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-cyan-400 block mb-1 font-sans">
              SOLUTIONS & CAPABILITIES
            </span>
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-heading uppercase text-white tracking-wide leading-none">
                OUR SERVICES
              </h2>
              <div className="hidden sm:block h-1 w-10 bg-brand-blue rounded-full" />
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider block font-sans">
              END-TO-END FREIGHT & PORT HANDLING
            </span>
          </div>
        </div>

        {/* 5 Sleek Service Image Cards Grid — Bright Imagery & Minimal Clean Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {displayServices.map((service, index) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-md hover:shadow-xl hover:border-cyan-400/60 transition-all duration-300 flex flex-col justify-end h-[220px] sm:h-[240px] lg:h-[250px]"
            >
              {/* Bright, Vibrant High-Clarity Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={service.imageUrl}
                  alt={service.title}
                  fill
                  priority={index < 2}
                  quality={95}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  className="object-cover group-hover:scale-108 transition-transform duration-500 brightness-105 contrast-[1.02] group-hover:brightness-110"
                />

                {/* Light bottom-only gradient: top 65% is 100% bright & clear */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-85 group-hover:opacity-75 transition-opacity" />
              </div>

              {/* Minimal Card Footer Content: Category + Title + Arrow */}
              <div className="relative z-10 p-4 flex items-end justify-between gap-2.5">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-cyan-400 block mb-1">
                    {service.category}
                  </span>
                  <h3 className="text-base font-heading uppercase text-white leading-tight group-hover:text-cyan-300 transition-colors line-clamp-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {service.title}
                  </h3>
                </div>

                {/* Compact Circular Arrow Button */}
                <div className="w-7 h-7 rounded-full bg-white/15 group-hover:bg-brand-blue text-white flex items-center justify-center flex-shrink-0 transition-all duration-300 border border-white/25 group-hover:border-cyan-400 group-hover:scale-110 shadow-sm">
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Compact Streamlined Bottom Action */}
        <div className="mt-6 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-white/10 hover:bg-brand-blue text-white text-xs font-bold border border-white/15 hover:border-cyan-400 transition-all duration-200 active:scale-[0.98] shadow-sm"
          >
            <span>Explore All 5 Service Specifications</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
