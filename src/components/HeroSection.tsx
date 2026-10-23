import React from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  badge?: string;
  headline?: string;
  subheadline?: string;
  bannerImageUrl?: string;
  mobileBannerImageUrl?: string;
  showTextOverlay?: boolean;
  showCtaButtons?: boolean;
}

const DEFAULT_BANNER_IMAGE =
  'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=2000&q=85';

export default function HeroSection({
  badge = 'RELIABLE SHIPPING SOLUTIONS',
  headline = 'CONNECTING AFRICA TO GLOBAL MARKETS',
  subheadline = 'Comprehensive logistics and shipping solutions for Raw Cashew Nuts and global cargo. Reliable, efficient, and professional services across Africa and beyond.',
  bannerImageUrl,
  mobileBannerImageUrl,
  showTextOverlay = true,
  showCtaButtons = true,
}: HeroSectionProps) {
  const activeDesktopBanner = bannerImageUrl?.trim() || DEFAULT_BANNER_IMAGE;
  const activeMobileBanner = mobileBannerImageUrl?.trim() || activeDesktopBanner;

  // Check if there is any text to show when overlay is enabled
  const hasTextContent =
    showTextOverlay &&
    Boolean(
      (badge && badge.trim().length > 0) ||
      (headline && headline.trim().length > 0) ||
      (subheadline && subheadline.trim().length > 0)
    );

  return (
    <section className="relative min-h-[460px] sm:min-h-[560px] lg:min-h-[660px] flex items-center bg-brand-dark overflow-hidden">
      {/* Background Banner Image - Desktop (sm and up) */}
      <div
        className="hidden sm:block absolute inset-0 bg-cover bg-center lg:bg-[center_top] transition-all duration-700 ease-out"
        style={{
          backgroundImage: `url('${activeDesktopBanner}')`,
        }}
      >
        {showTextOverlay ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-[#110E0F]/95 via-[#16273A]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-black/30" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 via-transparent to-transparent pointer-events-none" />
        )}
      </div>

      {/* Background Banner Image - Mobile (< sm) */}
      <div
        className="block sm:hidden absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out"
        style={{
          backgroundImage: `url('${activeMobileBanner}')`,
        }}
      >
        {showTextOverlay ? (
          /* Clear, gentle scrim: lets the background image show clearly and vividly while maintaining text legibility */
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/65 pointer-events-none" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
        )}
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 w-full">
        {hasTextContent ? (
          <div className="max-w-2xl lg:max-w-3xl">
            {/* Optional Badge */}
            {badge && badge.trim().length > 0 && (
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="text-cyan-300 sm:text-brand-blue tracking-[0.25em] uppercase font-bold text-xs sm:text-sm drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] font-sans flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span>{badge.replace('SOLUTIONS', '').trim()}</span>
                  {badge.toUpperCase().includes('SOLUTIONS') && (
                    <span className="text-cyan-400">SOLUTIONS</span>
                  )}
                </span>
              </div>
            )}

            {/* Optional Large Hero Heading in Bebas Neue */}
            {headline && headline.trim().length > 0 && (
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-heading font-normal uppercase text-white leading-[0.92] tracking-tight drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)] mb-6">
                {headline}
              </h1>
            )}

            {/* Optional Supporting Subheadline in Poppins */}
            {subheadline && subheadline.trim().length > 0 && (
              <p className="text-base sm:text-lg text-white sm:text-gray-200/95 font-medium sm:font-light leading-relaxed max-w-xl mb-9 font-sans drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                {subheadline}
              </p>
            )}

            {/* Call to Action Buttons */}
            {showCtaButtons && (
              <div className="flex flex-row items-center gap-2.5 sm:gap-3.5 pt-1 w-full max-w-sm sm:max-w-none">
                <Link
                  href="/quote"
                  className="flex-1 sm:flex-initial h-11 sm:h-12 px-3.5 sm:px-7 rounded-xl bg-gradient-to-r from-brand-blue to-[#1E67A2] hover:from-brand-blue-hover hover:to-brand-blue text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-brand-blue/35 border border-white/20 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] whitespace-nowrap"
                >
                  <span>Request a Quote</span>
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <ArrowRight className="w-3 h-3 text-white" />
                  </span>
                </Link>

                <Link
                  href="/services"
                  className="flex-1 sm:flex-initial h-11 sm:h-12 px-3.5 sm:px-7 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-bold text-xs sm:text-sm tracking-wide border border-white/30 shadow-md flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] whitespace-nowrap"
                >
                  <span>Our Services</span>
                  <span className="w-5 h-5 rounded-full bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0">
                    <ChevronRight className="w-3 h-3 text-white" />
                  </span>
                </Link>
              </div>
            )}
          </div>
        ) : (
          /* When Text Overlay is hidden (pre-created graphic banner) */
          <div className="min-h-[280px] sm:min-h-[380px] lg:min-h-[460px] flex flex-col justify-end">
            {showCtaButtons && (
              <div className="flex flex-row items-center gap-2.5 sm:gap-3.5 bg-brand-dark/80 backdrop-blur-md p-2.5 sm:p-4 rounded-2xl border border-white/15 w-full sm:w-fit shadow-2xl mt-auto max-w-sm sm:max-w-none">
                <Link
                  href="/quote"
                  className="flex-1 sm:flex-initial h-11 sm:h-12 px-3.5 sm:px-6 rounded-xl bg-gradient-to-r from-brand-blue to-[#1E67A2] hover:from-brand-blue-hover hover:to-brand-blue text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-brand-blue/35 border border-white/20 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] whitespace-nowrap"
                >
                  <span>Request a Quote</span>
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <ArrowRight className="w-3 h-3 text-white" />
                  </span>
                </Link>
                <Link
                  href="/services"
                  className="flex-1 sm:flex-initial h-11 sm:h-12 px-3.5 sm:px-6 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-bold text-xs sm:text-sm tracking-wide border border-white/30 shadow-md flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] whitespace-nowrap"
                >
                  <span>Our Services</span>
                  <span className="w-5 h-5 rounded-full bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0">
                    <ChevronRight className="w-3 h-3 text-white" />
                  </span>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
