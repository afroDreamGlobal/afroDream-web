import React from 'react';
import Link from 'next/link';
import { Box, Ship, Truck, Anchor, Navigation } from 'lucide-react';

export default function ServiceHighlightsBar() {
  const highlights = [
    {
      title: 'Container Shipment',
      icon: Box,
      slug: 'container-shipment',
      showOnMobile: true,
    },
    {
      title: 'Bulk Vessel Shipment',
      icon: Ship,
      slug: 'bulk-vessel-shipment',
      showOnMobile: true,
    },
    {
      title: 'Local Transportation (TZ)',
      fullTitle: 'Local Transportation in Tanzania',
      icon: Truck,
      slug: 'local-transportation-tanzania',
      showOnMobile: true,
    },
    {
      title: 'Port Clearing at POD',
      fullTitle: 'Port Clearing at Destination',
      icon: Anchor,
      slug: 'clearing-port-of-destination',
      showOnMobile: true,
    },
    {
      title: 'Local Transportation in India',
      fullTitle: 'Local Transportation in India',
      icon: Navigation,
      slug: 'local-transportation-india',
      showOnMobile: false, // Hidden on mobile to keep a clean, symmetrical 2x2 (4-badge) layout
    },
  ];

  return (
    <div className="bg-[#142232] border-t border-b border-[#223850] text-white py-3 sm:py-3.5">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Mobile: 2x2 Grid (Exactly 4 Badges); Desktop: 5 Columns */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3 lg:gap-4 items-center">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={`/services/${item.slug}`}
                className={`items-center space-x-2.5 sm:space-x-3 p-2.5 sm:p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.07] hover:border-brand-blue/40 transition-all duration-200 group cursor-pointer ${
                  item.showOnMobile ? 'flex' : 'hidden lg:flex'
                }`}
              >
                {/* Icon Badge */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-brand-blue/20 text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all duration-200 flex items-center justify-center flex-shrink-0 border border-brand-blue/30 shadow-sm">
                  <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>

                {/* Badge Title */}
                <span className="text-[11px] sm:text-xs font-semibold text-gray-200 group-hover:text-white transition-colors leading-tight line-clamp-2">
                  <span className="sm:hidden">{item.title}</span>
                  <span className="hidden sm:inline">{item.fullTitle || item.title}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
