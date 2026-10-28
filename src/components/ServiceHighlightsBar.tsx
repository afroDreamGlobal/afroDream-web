import React from 'react';
import Link from 'next/link';
import { Box, Ship, Truck, Anchor } from 'lucide-react';

export default function ServiceHighlightsBar() {
  const highlights = [
    {
      shortTitle: 'Container Shipment',
      fullTitle: 'Container Shipment',
      icon: Box,
      href: '/services/container-shipment',
      showOnMobile: true,
    },
    {
      shortTitle: 'Bulk Vessel Shipment',
      fullTitle: 'Bulk Vessel Shipment',
      icon: Ship,
      href: '/services/bulk-vessel-shipment',
      showOnMobile: true,
    },
    {
      shortTitle: 'Local Transport (Bissau & TZ)',
      fullTitle: 'Local Transportation in Bissau and Tanzania',
      icon: Truck,
      href: '/services/local-transportation-tanzania',
      showOnMobile: false, // Visible on desktop (5 columns); hidden on mobile for clean 4-card 2x2 layout
    },
    {
      shortTitle: 'Port Clearing at POL',
      fullTitle: 'Port Clearing at POL',
      icon: Anchor,
      href: '/services/clearing-port-of-destination',
      showOnMobile: true,
    },
    {
      shortTitle: 'Port Clearing at POD',
      fullTitle: 'Port Clearing at POD',
      icon: Anchor,
      href: '/services/clearing-port-of-destination',
      showOnMobile: true,
    },
  ];

  return (
    <div className="bg-[#142232] border-t border-b border-[#223850] text-white py-2.5 sm:py-3.5 relative shadow-inner">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Mobile: 2x2 Grid (4 Cards: Container, Bulk Vessel, Port Clearing POL, Port Clearing POD); Tablet: 1x4 Grid; Desktop: 1x5 Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2.5 lg:gap-3 items-stretch">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={item.href}
                className={`items-center space-x-2 sm:space-x-2.5 p-2 sm:p-2.5 lg:p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] active:bg-white/[0.13] border border-white/[0.07] hover:border-brand-blue/50 transition-all duration-200 group cursor-pointer h-full min-h-[54px] sm:min-h-[58px] lg:min-h-[64px] shadow-sm hover:shadow-md hover:shadow-cyan-400/10 active:scale-[0.98] ${
                  item.showOnMobile ? 'flex' : 'hidden lg:flex'
                }`}
              >
                {/* Icon Badge */}
                <div className="w-8 h-8 sm:w-8.5 sm:h-8.5 lg:w-9 lg:h-9 rounded-lg bg-brand-blue/20 text-cyan-400 group-hover:bg-brand-blue group-hover:text-white transition-all duration-200 flex items-center justify-center flex-shrink-0 border border-brand-blue/30 shadow-sm">
                  <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>

                {/* Badge Title: Perfectly centered, no text overflow, responsive length */}
                <div className="min-w-0 flex-1">
                  <span className="block text-[11px] sm:text-xs font-semibold text-gray-200 group-hover:text-white transition-colors leading-tight">
                    <span className="sm:hidden">{item.shortTitle}</span>
                    <span className="hidden sm:inline">{item.fullTitle}</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
