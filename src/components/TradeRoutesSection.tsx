'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TradeRoute } from '@/lib/types';
import { MapPin, ArrowRight, Anchor, ShieldCheck, Ship, Clock, CheckCircle2 } from 'lucide-react';

interface TradeRoutesSectionProps {
  routes?: TradeRoute[];
}

type TabType = 'INDIA' | 'VIETNAM' | 'GLOBAL';

interface PortItem {
  name: string;
  state: string;
  transit: string;
  coords: { x: number; y: number };
}

const REGION_DATA: Record<
  TabType,
  {
    corridorName: string;
    description: string;
    ports: PortItem[];
  }
> = {
  INDIA: {
    corridorName: 'Tanzania & West Africa to India Corridors',
    description:
      'Direct container and bulk vessel shipments to primary cashew processing centers in Tamil Nadu, Karnataka, Gujarat, and Andhra Pradesh.',
    ports: [
      { name: 'Tuticorin', state: 'Tamil Nadu', transit: '14-16 Days', coords: { x: 545, y: 225 } },
      { name: 'Mangalore', state: 'Karnataka', transit: '16-18 Days', coords: { x: 535, y: 205 } },
      { name: 'Visakhapatnam', state: 'Andhra Pradesh', transit: '18-21 Days', coords: { x: 565, y: 180 } },
      { name: 'Mundra', state: 'Gujarat', transit: '18-20 Days', coords: { x: 525, y: 155 } },
    ],
  },
  VIETNAM: {
    corridorName: 'Africa to Vietnam Industrial Terminals',
    description:
      'Scheduled containerized freight connecting Mtwara Port to southern and northern manufacturing hubs across Vietnam.',
    ports: [
      { name: 'Ho Chi Minh', state: 'Southern Vietnam', transit: '18-22 Days', coords: { x: 635, y: 215 } },
      { name: 'Hai Phong', state: 'Northern Vietnam', transit: '22-25 Days', coords: { x: 640, y: 175 } },
      { name: 'Da Nang', state: 'Central Vietnam', transit: '20-23 Days', coords: { x: 638, y: 195 } },
      { name: 'Quy Nhon', state: 'Binh Dinh Province', transit: '19-22 Days', coords: { x: 645, y: 205 } },
    ],
  },
  GLOBAL: {
    corridorName: 'African Ports to Middle East & Europe',
    description:
      'Strategic maritime connections linking African coastal trade to worldwide transshipment megahubs and European gateways.',
    ports: [
      { name: 'Jebel Ali (Dubai)', state: 'UAE', transit: '10-13 Days', coords: { x: 495, y: 160 } },
      { name: 'Rotterdam', state: 'Netherlands', transit: '24-28 Days', coords: { x: 385, y: 85 } },
      { name: 'Singapore', state: 'Asia-Pacific Hub', transit: '14-17 Days', coords: { x: 625, y: 245 } },
      { name: 'Valencia', state: 'Spain / Europe', transit: '21-25 Days', coords: { x: 360, y: 110 } },
    ],
  },
};

export default function TradeRoutesSection({ routes }: TradeRoutesSectionProps) {
  const [activeTab, setActiveTab] = useState<TabType>('INDIA');
  const [selectedPort, setSelectedPort] = useState<string>('Tuticorin');

  const currentRegion = REGION_DATA[activeTab];

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSelectedPort(REGION_DATA[tab].ports[0].name);
  };

  return (
    <section
      id="trade-routes-section"
      className="py-14 sm:py-18 lg:py-20 bg-gradient-to-r from-[#F0F7FF] via-[#EBF4FE] to-[#F2F8FF] border-y border-blue-100 text-slate-900 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ========================================================================= */}
        {/* MAIN 3-ZONE DISPLAY MATCHING REFERRAL IMAGE                               */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* ----------------------------------------------------------------------- */}
          {/* ZONE 1 (LEFT): BRAND TITLE HEADLINE                                     */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-3 flex flex-col justify-center">
            <span className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-slate-900 block mb-1 font-sans">
              TRADE ROUTES
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading uppercase text-brand-blue leading-[0.92] tracking-tight">
              FROM AFRICA TO <br />
              GLOBAL MARKETS
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 font-light mt-4 leading-relaxed max-w-sm hidden sm:block">
              Direct ocean freight, specialized RCN container stuffing, and scheduled bulk vessels
              connecting <strong className="text-slate-900 font-medium">Mtwara Port (TZ)</strong> &{' '}
              <strong className="text-slate-900 font-medium">Bissau (GW)</strong> to international trade clusters.
            </p>

            <div className="mt-5 pt-2 hidden sm:block">
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-blue hover:text-brand-blue-hover transition-colors"
              >
                <span>Request Route Rate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* ZONE 2 (CENTER): DOTTED WORLD MATRIX MAP WITH RADIATING ARCS            */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-6 relative w-full flex items-center justify-center">
            <div className="w-full aspect-[16/9] max-h-[360px] relative select-none">
              <svg
                viewBox="0 0 800 400"
                className="w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* General World Continents Dot Pattern */}
                  <pattern
                    id="worldDotMatrix"
                    x="0"
                    y="0"
                    width="9"
                    height="9"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="4.5" cy="4.5" r="1.5" fill="#93C5FD" />
                  </pattern>

                  {/* Africa Highlighted Dot Pattern (Denser & Vibrant Blue) */}
                  <pattern
                    id="africaDotMatrix"
                    x="0"
                    y="0"
                    width="9"
                    height="9"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="4.5" cy="4.5" r="2.1" fill="#0284C7" />
                  </pattern>

                  {/* Soft Route Glow Filter */}
                  <filter id="routeArcGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* ===================================================== */}
                {/* DOTTED CONTINENT SILHOUETTES                          */}
                {/* ===================================================== */}
                {/* North America */}
                <path
                  d="M 60 60 L 120 40 L 210 50 L 240 85 L 210 130 L 180 145 L 160 175 L 140 170 L 115 140 L 95 105 Z 
                     M 215 25 L 260 30 L 250 55 L 215 50 Z"
                  fill="url(#worldDotMatrix)"
                />

                {/* South America */}
                <path
                  d="M 185 195 L 235 200 L 265 235 L 255 285 L 225 350 L 205 340 L 195 280 L 175 230 Z"
                  fill="url(#worldDotMatrix)"
                />

                {/* Europe */}
                <path
                  d="M 345 70 L 405 60 L 435 85 L 415 120 L 365 120 L 345 95 Z 
                     M 370 35 L 410 30 L 405 55 L 375 60 Z"
                  fill="url(#worldDotMatrix)"
                />

                {/* Africa (Highlighted in Rich Blue Dots) */}
                <path
                  d="M 335 145 
                     C 380 135, 430 145, 445 165 
                     C 460 185, 470 225, 460 255 
                     C 450 295, 435 340, 400 355 
                     C 380 365, 365 335, 355 300 
                     C 335 260, 310 225, 305 200 
                     C 300 175, 320 155, 335 145 Z"
                  fill="url(#africaDotMatrix)"
                />

                {/* Asia Landmass */}
                <path
                  d="M 435 70 L 525 55 L 625 65 L 685 105 L 655 155 L 625 170 L 590 155 L 535 125 L 480 135 L 435 100 Z"
                  fill="url(#worldDotMatrix)"
                />

                {/* India Subcontinent */}
                <path
                  d="M 505 145 
                     C 530 145, 555 155, 565 175 
                     C 575 200, 555 230, 540 255 
                     C 525 260, 515 240, 505 215 
                     C 495 185, 490 160, 505 145 Z"
                  fill="url(#worldDotMatrix)"
                />

                {/* Southeast Asia & Vietnam */}
                <path
                  d="M 590 165 L 630 170 L 645 200 L 635 235 L 610 250 L 595 230 L 590 190 Z 
                     M 610 265 L 655 265 L 645 280 L 605 280 Z"
                  fill="url(#worldDotMatrix)"
                />

                {/* Australia */}
                <path
                  d="M 645 275 L 715 270 L 735 305 L 720 345 L 670 350 L 645 315 Z"
                  fill="url(#worldDotMatrix)"
                />

                {/* ===================================================== */}
                {/* RADIATING CURVED MARITIME SHIPPING ARCS               */}
                {/* ===================================================== */}
                {/* Ambient Trans-Atlantic Arc to the West (Matches referral image) */}
                <path
                  d="M 335 200 C 270 200, 215 220, 185 240"
                  stroke="#38BDF8"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  opacity="0.65"
                  filter="url(#routeArcGlow)"
                />
                <circle cx="185" cy="240" r="3" fill="#0284C7" />

                {/* North Atlantic Arc to Europe */}
                <path
                  d="M 350 170 C 340 120, 360 90, 385 85"
                  stroke="#38BDF8"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  opacity="0.65"
                  filter="url(#routeArcGlow)"
                />

                {/* Dynamic Active Corridor Arcs to Indian Ocean & Asia */}
                {activeTab === 'INDIA' && (
                  <>
                    {/* Arc 1: Africa to Tuticorin */}
                    <path
                      d="M 430 255 C 475 265, 515 250, 545 225"
                      stroke="#0284C7"
                      strokeWidth="2.4"
                      className="animate-sea-route"
                      strokeLinecap="round"
                      filter="url(#routeArcGlow)"
                    />

                    {/* Arc 2: Africa to Mangalore */}
                    <path
                      d="M 430 255 C 465 240, 500 225, 535 205"
                      stroke="#38BDF8"
                      strokeWidth="2"
                      className="animate-sea-route"
                      strokeLinecap="round"
                      opacity="0.85"
                    />

                    {/* Arc 3: Africa to Visakhapatnam */}
                    <path
                      d="M 430 255 C 480 230, 525 200, 565 180"
                      stroke="#0284C7"
                      strokeWidth="2.2"
                      className="animate-sea-route"
                      strokeLinecap="round"
                      filter="url(#routeArcGlow)"
                    />

                    {/* Arc 4: Africa to Mundra */}
                    <path
                      d="M 430 255 C 460 205, 495 175, 525 155"
                      stroke="#38BDF8"
                      strokeWidth="2"
                      className="animate-sea-route"
                      strokeLinecap="round"
                      opacity="0.8"
                    />
                  </>
                )}

                {activeTab === 'VIETNAM' && (
                  <>
                    {/* Extended Ocean Arc to Vietnam (Ho Chi Minh) */}
                    <path
                      d="M 430 255 C 490 270, 560 250, 635 215"
                      stroke="#0284C7"
                      strokeWidth="2.6"
                      className="animate-sea-route"
                      strokeLinecap="round"
                      filter="url(#routeArcGlow)"
                    />
                    {/* Arc to Hai Phong */}
                    <path
                      d="M 430 255 C 500 240, 570 205, 640 175"
                      stroke="#38BDF8"
                      strokeWidth="2"
                      className="animate-sea-route"
                      strokeLinecap="round"
                      opacity="0.85"
                    />
                  </>
                )}

                {activeTab === 'GLOBAL' && (
                  <>
                    {/* Arc to Dubai / Jebel Ali */}
                    <path
                      d="M 430 255 C 455 210, 475 180, 495 160"
                      stroke="#0284C7"
                      strokeWidth="2.4"
                      className="animate-sea-route"
                      strokeLinecap="round"
                      filter="url(#routeArcGlow)"
                    />
                    {/* Arc to Singapore */}
                    <path
                      d="M 430 255 C 490 280, 560 270, 625 245"
                      stroke="#38BDF8"
                      strokeWidth="2.2"
                      className="animate-sea-route"
                      strokeLinecap="round"
                      opacity="0.85"
                    />
                  </>
                )}

                {/* ===================================================== */}
                {/* ORIGIN & DESTINATION GLOWING BEACONS                  */}
                {/* ===================================================== */}
                {/* East Africa Base (Mtwara / Dar Es Salaam) */}
                <g transform="translate(430, 255)">
                  <circle cx="0" cy="0" r="10" fill="#0284C7" opacity="0.25" />
                  <circle cx="0" cy="0" r="5" fill="#0284C7" stroke="#FFFFFF" strokeWidth="1.5" />
                  <circle cx="0" cy="0" r="2" fill="#FFFFFF" />
                </g>

                {/* Destination Nodes for Active Tab */}
                {currentRegion.ports.map((port) => {
                  const isSelected = selectedPort === port.name;
                  return (
                    <g
                      key={port.name}
                      transform={`translate(${port.coords.x}, ${port.coords.y})`}
                      onClick={() => setSelectedPort(port.name)}
                      className="cursor-pointer"
                    >
                      <circle
                        cx="0"
                        cy="0"
                        r={isSelected ? 10 : 7}
                        fill="#0284C7"
                        opacity={isSelected ? 0.35 : 0.2}
                      />
                      <circle
                        cx="0"
                        cy="0"
                        r={isSelected ? 5 : 4}
                        fill="#0284C7"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* ZONE 3 (RIGHT): TABS & VERTICAL PORT LIST (EXACT REFERRAL MATCH)        */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-3 flex flex-col justify-center">
            {/* Horizontal Region Tabs */}
            <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
              <button
                onClick={() => handleTabChange('INDIA')}
                className={`text-xs font-bold uppercase transition-all duration-200 cursor-pointer ${
                  activeTab === 'INDIA'
                    ? 'bg-brand-blue text-white rounded-lg px-4 py-1.5 shadow-sm'
                    : 'text-slate-900 hover:text-brand-blue px-2.5 py-1.5'
                }`}
              >
                INDIA
              </button>

              <button
                onClick={() => handleTabChange('VIETNAM')}
                className={`text-xs font-bold uppercase transition-all duration-200 cursor-pointer ${
                  activeTab === 'VIETNAM'
                    ? 'bg-brand-blue text-white rounded-lg px-4 py-1.5 shadow-sm'
                    : 'text-slate-900 hover:text-brand-blue px-2.5 py-1.5'
                }`}
              >
                VIETNAM
              </button>

              <button
                onClick={() => handleTabChange('GLOBAL')}
                className={`text-xs font-bold uppercase transition-all duration-200 cursor-pointer ${
                  activeTab === 'GLOBAL'
                    ? 'bg-brand-blue text-white rounded-lg px-4 py-1.5 shadow-sm'
                    : 'text-slate-900 hover:text-brand-blue px-2.5 py-1.5'
                }`}
              >
                GLOBAL
              </button>
            </div>

            {/* Horizontal Divider Line Matching Referral */}
            <div className="border-b border-slate-300/80 mb-5 w-full" />

            {/* Vertical Port List with Blue Location Pins */}
            <div className="space-y-3.5">
              {currentRegion.ports.map((port) => {
                const isSelected = selectedPort === port.name;
                return (
                  <button
                    key={port.name}
                    onClick={() => setSelectedPort(port.name)}
                    className="flex items-center justify-between w-full text-left group cursor-pointer py-1"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                        <MapPin
                          className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                            isSelected
                              ? 'text-brand-blue fill-brand-blue/30 scale-110'
                              : 'text-brand-blue fill-brand-blue/15'
                          }`}
                        />
                      </div>
                      <span
                        className={`text-sm sm:text-base font-semibold transition-colors leading-none ${
                          isSelected
                            ? 'text-brand-blue font-bold'
                            : 'text-slate-900 group-hover:text-brand-blue'
                        }`}
                      >
                        {port.name}
                      </span>
                    </div>

                    <span className="text-[11px] font-medium text-slate-500 bg-white/80 px-2 py-0.5 rounded border border-blue-100 shadow-2xs">
                      {port.transit}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Direct Booking CTA */}
            <div className="mt-7 pt-4 border-t border-slate-200/70">
              <Link
                href={`/quote?destination=${encodeURIComponent(selectedPort)}`}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold shadow-md shadow-brand-blue/25 transition-all duration-200 active:scale-[0.98]"
              >
                <span>Book Vessel Space to {selectedPort}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* REFINED BOTTOM OPERATIONAL GUARANTEES STRIP                               */}
        {/* ========================================================================= */}
        <div className="mt-12 pt-8 border-t border-blue-200/60 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/70 backdrop-blur-sm border border-blue-100">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center flex-shrink-0">
              <Anchor className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 leading-tight">
                Direct Mtwara & Bissau Loading
              </h4>
              <p className="text-[11px] text-slate-500 font-light mt-0.5">
                Bypass congested Dar es Salaam transshipment.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/70 backdrop-blur-sm border border-blue-100">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 leading-tight">
                Zero Demurrage Guaranteed
              </h4>
              <p className="text-[11px] text-slate-500 font-light mt-0.5">
                14 to 21-day container free time at discharge ports.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/70 backdrop-blur-sm border border-blue-100">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center flex-shrink-0">
              <Ship className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 leading-tight">
                100% Ventilated RCN Fleet
              </h4>
              <p className="text-[11px] text-slate-500 font-light mt-0.5">
                Moisture barriers for premium cashew kernel outturn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
