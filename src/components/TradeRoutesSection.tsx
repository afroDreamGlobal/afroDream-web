'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TradeRoute } from '@/lib/types';
import { Navigation, Clock, ArrowRight, Share2, ShieldCheck, Anchor } from 'lucide-react';

interface TradeRoutesSectionProps {
  routes?: TradeRoute[];
}

type TabType = 'INDIA' | 'VIETNAM' | 'GLOBAL';

interface PortDetail {
  name: string;
  role: string;
  state: string;
  transit: string;
}

const DESTINATION_DATA: Record<
  TabType,
  {
    title: string;
    corridorTitle: string;
    corridorRoute: string;
    portsCount: string;
    portsLabel: string;
    transitRange: string;
    transitLabel: string;
    supportTitle: string;
    supportLabel: string;
    ports: PortDetail[];
  }
> = {
  INDIA: {
    title: 'DIRECT DISCHARGE PORTS IN INDIA',
    corridorTitle: 'ACTIVE SEASONAL CORRIDOR',
    corridorRoute: 'BISSAU PORT TO TUTICORIN & MANGALORE',
    portsCount: '4',
    portsLabel: 'Indian Ports',
    transitRange: '15-21',
    transitLabel: 'Days Transit',
    supportTitle: 'End-to-End',
    supportLabel: 'Logistics Support',
    ports: [
      {
        name: 'Tuticorin Port',
        role: 'Major Cashew & Commodity Hub',
        state: 'Tamil Nadu',
        transit: '14-16 Days',
      },
      {
        name: 'Mangalore Port',
        role: 'Key Processing Terminal',
        state: 'Karnataka',
        transit: '16-18 Days',
      },
      {
        name: 'Visakhapatnam Port',
        role: 'East Coast Gateway',
        state: 'Andhra Pradesh',
        transit: '18-20 Days',
      },
      {
        name: 'Mundra Port',
        role: 'High-Capacity Deep Sea Terminal',
        state: 'Gujarat',
        transit: '18-21 Days',
      },
    ],
  },
  VIETNAM: {
    title: 'DIRECT DISCHARGE PORTS IN VIETNAM',
    corridorTitle: 'ACTIVE SEASONAL CORRIDOR',
    corridorRoute: 'MTWARA & BISSAU TO VIETNAM TERMINALS',
    portsCount: '4',
    portsLabel: 'Vietnam Ports',
    transitRange: '18-24',
    transitLabel: 'Days Transit',
    supportTitle: 'End-to-End',
    supportLabel: 'Clearing & Delivery',
    ports: [
      {
        name: 'Ho Chi Minh Port (Cat Lai)',
        role: 'Primary Cashew Import Terminal',
        state: 'Southern Vietnam',
        transit: '18-22 Days',
      },
      {
        name: 'Hai Phong Port',
        role: 'Northern Trade Gateway',
        state: 'Northern Vietnam',
        transit: '22-26 Days',
      },
      {
        name: 'Da Nang Port',
        role: 'Central Coastal Terminal',
        state: 'Central Vietnam',
        transit: '20-24 Days',
      },
      {
        name: 'Quy Nhon Port',
        role: 'Agro Commodity Terminal',
        state: 'Binh Dinh',
        transit: '19-23 Days',
      },
    ],
  },
  GLOBAL: {
    title: 'GLOBAL STRATEGIC TRADE HUBS',
    corridorTitle: 'WORLDWIDE MARITIME NETWORK',
    corridorRoute: 'AFRICA TO EUROPE & MIDDLE EAST',
    portsCount: 'Global',
    portsLabel: 'Trade Corridors',
    transitRange: '10-28',
    transitLabel: 'Days Transit',
    supportTitle: 'Multimodal',
    supportLabel: 'Global Logistics',
    ports: [
      {
        name: 'Rotterdam & Antwerp',
        role: 'Western European Commodity Hub',
        state: 'Netherlands / Belgium',
        transit: '24-28 Days',
      },
      {
        name: 'Jebel Ali Port',
        role: 'Middle East Transshipment Hub',
        state: 'Dubai, UAE',
        transit: '10-14 Days',
      },
      {
        name: 'Singapore Port',
        role: 'Asia-Pacific Transshipment Center',
        state: 'Singapore',
        transit: '14-17 Days',
      },
      {
        name: 'Port of Valencia',
        role: 'Mediterranean Inbound Gateway',
        state: 'Spain / Europe',
        transit: '22-26 Days',
      },
    ],
  },
};

export default function TradeRoutesSection({ routes }: TradeRoutesSectionProps) {
  const [activeTab, setActiveTab] = useState<TabType>('INDIA');
  const currentData = DESTINATION_DATA[activeTab];

  const renderPillTabs = (extraClasses = '') => (
    <div
      className={`inline-flex items-center bg-white p-1 rounded-2xl shadow-sm border border-slate-200 ${extraClasses}`}
    >
      {(['INDIA', 'VIETNAM', 'GLOBAL'] as const).map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
            activeTab === tab
              ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/30'
              : 'text-slate-500 hover:text-slate-900 bg-transparent'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#F8FAFC] border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Pill Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-brand-blue block mb-1.5 font-sans">
              TRADE ROUTES
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-heading uppercase text-slate-900 tracking-tight leading-none">
              FROM AFRICA TO GLOBAL MARKETS
            </h2>
          </div>

          {/* Desktop Region Tabs (Unchanged on Desktop Screen, Hidden on Mobile) */}
          {renderPillTabs('hidden lg:inline-flex')}
        </div>

        {/* 2-Column Exact Layout: Left Discharge Ports Card + Right Map Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Mobile Region Tabs: Placed Directly Below Image/Map Section on Mobile Only */}
          <div className="order-2 lg:hidden flex justify-center w-full py-1">
            {renderPillTabs()}
          </div>

          {/* ========================================================================= */}
          {/* LEFT CARD: DIRECT DISCHARGE PORTS (On mobile: order-3, below tabs & map)  */}
          {/* ========================================================================= */}
          <div className="order-3 lg:order-1 lg:col-span-5 flex flex-col justify-between bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/90 hover:shadow-md transition-shadow">
            <div>
              {/* Card Header with Icon */}
              <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100">
                <Navigation className="w-4 h-4 text-brand-blue stroke-[2.5]" />
                <h3 className="font-heading text-lg sm:text-xl uppercase text-slate-900 tracking-wide">
                  {currentData.title}
                </h3>
              </div>

              {/* Ports List (Exact Style & Arrangement) */}
              <div className="space-y-3">
                {currentData.ports.map((port, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 hover:bg-blue-50/40 border border-slate-100 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Port Bullet with Outer Ring */}
                      <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-brand-blue" />
                      </div>

                      {/* Port Name & Role */}
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">
                          {port.name}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                          {port.role}
                        </p>
                        <span className="inline-block mt-0.5 text-xs font-semibold text-brand-blue">
                          {port.state}
                        </span>
                      </div>
                    </div>

                    {/* Transit Time */}
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs sm:text-sm font-bold text-slate-800 block">
                        {port.transit}
                      </span>
                      <span className="text-[11px] text-slate-400 font-normal">
                        Transit Time
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Card Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-600">
                <span className="font-bold text-slate-900">Origin: </span>
                <span>Mtwara Port (Tanzania), Bissau (Guinea-Bissau)</span>
              </div>

              <Link
                href="/quote"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-xs shadow-md shadow-brand-blue/30 transition-all flex-shrink-0 active:scale-[0.98]"
              >
                <span>Get Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT CARD: DARK NAVY MARITIME MAP & METRICS (On mobile: order-1, on top) */}
          {/* ========================================================================= */}
          <div className="order-1 lg:order-2 lg:col-span-7 flex flex-col justify-between bg-[#0B1728] rounded-3xl p-4 sm:p-6 lg:p-7 shadow-xl border border-[#1E2E42] text-white relative overflow-hidden">
            {/* Top-Left Active Corridor Badge */}
            <div className="relative z-10 self-start mb-3 sm:mb-4">
              <div className="inline-flex flex-col bg-[#11243D]/90 backdrop-blur-md px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-cyan-500/20 shadow-lg">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-[10px] sm:text-[11px] tracking-wider uppercase">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span>{currentData.corridorTitle}</span>
                </div>
                <div className="text-[11px] sm:text-xs text-slate-200 font-semibold tracking-wide mt-0.5 uppercase">
                  {currentData.corridorRoute}
                </div>
              </div>
            </div>

            {/* Interactive World Route Vector Map — Comfortable Height on Mobile */}
            <div className="relative w-full h-[230px] sm:h-[300px] lg:h-auto lg:aspect-[16/9] flex items-center justify-center my-auto">
              <svg
                viewBox="0 0 820 440"
                className="w-full h-full select-none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Glow Filters */}
                  <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="blueGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Ocean Gradients */}
                  <radialGradient id="oceanGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#1E3A5F" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0B1728" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Ocean Atmosphere Glow */}
                <ellipse cx="460" cy="220" rx="320" ry="170" fill="url(#oceanGlow)" />

                {/* Latitude / Longitude Subtle Navigation Grid */}
                <g stroke="#182A40" strokeWidth="0.8" strokeDasharray="3 4">
                  <line x1="40" y1="110" x2="780" y2="110" />
                  <line x1="40" y1="220" x2="780" y2="220" />
                  <line x1="40" y1="330" x2="780" y2="330" />
                  <line x1="180" y1="30" x2="180" y2="400" />
                  <line x1="380" y1="30" x2="380" y2="400" />
                  <line x1="580" y1="30" x2="580" y2="400" />
                </g>

                {/* ===================================================== */}
                {/* CONTINENT SILHOUETTES                                 */}
                {/* ===================================================== */}
                {/* Europe Silhouette */}
                <path
                  d="M190 70 L250 65 L270 90 L240 120 L210 115 Z"
                  fill="#13243A"
                  stroke="#1D385A"
                  strokeWidth="1"
                  opacity="0.7"
                />

                {/* Africa Continent Silhouette */}
                <path
                  d="M170 140 
                     C220 130, 290 140, 310 160 
                     C325 180, 335 220, 340 250 
                     C330 290, 310 350, 275 380 
                     C250 395, 235 370, 220 330 
                     C200 280, 165 240, 150 210 
                     C140 180, 155 150, 170 140 Z"
                  fill="#13253C"
                  stroke="#21426B"
                  strokeWidth="1.2"
                />

                {/* Arabian Peninsula */}
                <path
                  d="M345 160 L385 155 L405 195 L375 220 L345 190 Z"
                  fill="#13253C"
                  stroke="#1E3D63"
                  strokeWidth="1"
                  opacity="0.8"
                />

                {/* India Subcontinent Silhouette */}
                <path
                  d="M470 150 
                     C500 150, 540 160, 560 180 
                     C575 210, 550 250, 530 285 
                     C515 295, 505 270, 490 240 
                     C475 200, 465 170, 470 150 Z"
                  fill="#162B46"
                  stroke="#2A5487"
                  strokeWidth="1.2"
                />

                {/* Southeast Asia / Vietnam Silhouette */}
                <path
                  d="M610 170 
                     C640 175, 660 190, 665 220 
                     C655 250, 640 270, 620 285 
                     C605 260, 595 220, 610 170 Z"
                  fill="#13253C"
                  stroke="#204068"
                  strokeWidth="1"
                />

                {/* ===================================================== */}
                {/* SHIPPING ROUTE ARCS (MATCHING REFERRAL ARCS)          */}
                {/* ===================================================== */}
                {/* Arc 1: Long Curved Ocean Route from Bissau (West Africa) around Cape of Good Hope into Indian Ocean */}
                <path
                  d="M175 220 C130 330, 230 420, 360 380 C440 350, 490 300, 520 260"
                  stroke="#38BDF8"
                  strokeWidth="2.5"
                  strokeDasharray="5 4"
                  strokeLinecap="round"
                  opacity="0.9"
                  filter="url(#cyanGlow)"
                />

                {/* Arc 2: Primary Route from Mombasa / Dar Es Salaam / Mtwara to Tuticorin & Mangalore */}
                <path
                  d="M315 275 C370 290, 435 290, 520 260"
                  stroke="#38BDF8"
                  strokeWidth="2.8"
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                  filter="url(#cyanGlow)"
                />

                {/* Arc 3: Branch to Mangalore */}
                <path
                  d="M315 275 C390 270, 440 255, 495 235"
                  stroke="#60A5FA"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                  opacity="0.8"
                />

                {/* Arc 4: Branch to Mundra (Gujarat) */}
                <path
                  d="M315 275 C390 230, 440 195, 485 175"
                  stroke="#60A5FA"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                  opacity="0.7"
                />

                {/* Arc 5: Branch to Visakhapatnam (East Coast India) */}
                <path
                  d="M520 260 C545 255, 560 235, 565 210"
                  stroke="#38BDF8"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                  opacity="0.8"
                />

                {/* If VIETNAM or GLOBAL tab active, show extended routes to Vietnam / Far East */}
                {activeTab !== 'INDIA' && (
                  <path
                    d="M520 260 C580 300, 625 280, 650 235"
                    stroke="#38BDF8"
                    strokeWidth="2.5"
                    strokeDasharray="5 4"
                    strokeLinecap="round"
                    filter="url(#cyanGlow)"
                  />
                )}

                {/* ===================================================== */}
                {/* ORIGIN PORTS (GLOWING BEACONS)                        */}
                {/* ===================================================== */}
                {/* 1. BISSAU (GW) */}
                <g transform="translate(175, 220)">
                  <circle cx="0" cy="0" r="14" fill="#38BDF8" opacity="0.15" />
                  <circle cx="0" cy="0" r="8" fill="#38BDF8" opacity="0.4" />
                  <circle cx="0" cy="0" r="4.5" fill="#FFFFFF" filter="url(#cyanGlow)" />
                  <text
                    x="-65"
                    y="-8"
                    fill="#FFFFFF"
                    fontSize="11"
                    fontWeight="800"
                    letterSpacing="0.05em"
                  >
                    BISSAU (GW)
                  </text>
                </g>

                {/* 2. MOMBASA / DAR ES SALAAM / MTWARA (Positioned Left to Avoid Overlap with Indian Ocean Routes) */}
                <g transform="translate(315, 275)">
                  <circle cx="0" cy="0" r="14" fill="#38BDF8" opacity="0.15" />
                  <circle cx="0" cy="0" r="8" fill="#38BDF8" opacity="0.4" />
                  <circle cx="0" cy="0" r="5" fill="#FFFFFF" filter="url(#cyanGlow)" />
                  <text
                    x="-92"
                    y="-2"
                    fill="#FFFFFF"
                    fontSize="10"
                    fontWeight="700"
                    letterSpacing="0.04em"
                  >
                    MOMBASA
                  </text>
                  <text
                    x="-92"
                    y="10"
                    fill="#94A3B8"
                    fontSize="9.5"
                    fontWeight="600"
                    letterSpacing="0.04em"
                  >
                    DAR ES SALAAM
                  </text>
                </g>

                {/* ===================================================== */}
                {/* DESTINATION PORTS (INDIA)                             */}
                {/* ===================================================== */}
                {/* 1. MUNDRA */}
                <g transform="translate(485, 175)">
                  <circle cx="0" cy="0" r="3.5" fill="#38BDF8" />
                  <text
                    x="8"
                    y="-5"
                    fill="#CBD5E1"
                    fontSize="9.5"
                    fontWeight="700"
                    letterSpacing="0.05em"
                  >
                    MUNDRA
                  </text>
                </g>

                {/* 2. MANGALORE (Positioned to Right to Avoid Clashing with East Africa) */}
                <g transform="translate(495, 235)">
                  <circle cx="0" cy="0" r="4" fill="#38BDF8" />
                  <text
                    x="8"
                    y="3"
                    fill="#FFFFFF"
                    fontSize="9.5"
                    fontWeight="700"
                    letterSpacing="0.05em"
                  >
                    MANGALORE
                  </text>
                </g>

                {/* 3. TUTICORIN (PRIMARY GLOWING HUB - Positioned Below Node) */}
                <g transform="translate(520, 260)">
                  <circle cx="0" cy="0" r="16" fill="#38BDF8" opacity="0.2" />
                  <circle cx="0" cy="0" r="9" fill="#38BDF8" opacity="0.45" />
                  <circle cx="0" cy="0" r="5.5" fill="#FFFFFF" filter="url(#cyanGlow)" />
                  <text
                    x="10"
                    y="16"
                    fill="#38BDF8"
                    fontSize="10"
                    fontWeight="800"
                    letterSpacing="0.05em"
                  >
                    TUTICORIN
                  </text>
                </g>

                {/* 4. VISAKHAPATNAM */}
                <g transform="translate(565, 210)">
                  <circle cx="0" cy="0" r="3.5" fill="#38BDF8" />
                  <text
                    x="8"
                    y="-3"
                    fill="#E2E8F0"
                    fontSize="9.5"
                    fontWeight="700"
                    letterSpacing="0.05em"
                  >
                    VISAKHAPATNAM
                  </text>
                </g>

                {/* VIETNAM HUBS (RENDERED WHEN ACTIVE) */}
                {activeTab === 'VIETNAM' && (
                  <g transform="translate(650, 235)">
                    <circle cx="0" cy="0" r="14" fill="#38BDF8" opacity="0.2" />
                    <circle cx="0" cy="0" r="5" fill="#FFFFFF" filter="url(#cyanGlow)" />
                    <text
                      x="10"
                      y="4"
                      fill="#38BDF8"
                      fontSize="10"
                      fontWeight="800"
                      letterSpacing="0.05em"
                    >
                      HO CHI MINH (VN)
                    </text>
                  </g>
                )}
              </svg>
            </div>

            {/* Bottom 3-Column Metric Bar — Clean Stacking on Mobile, Horizontal on Desktop */}
            <div className="relative z-10 pt-3 sm:pt-4 mt-2 sm:mt-4 border-t border-[#1C314C] grid grid-cols-3 divide-x divide-[#1C314C]">
              {/* Metric 1: Ports */}
              <div className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1 sm:gap-3 px-1 sm:px-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 flex-shrink-0">
                  <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <div className="text-base sm:text-xl lg:text-2xl font-bold text-white leading-none whitespace-nowrap">
                    {currentData.portsCount}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-400 mt-1 leading-tight whitespace-nowrap">
                    {currentData.portsLabel}
                  </div>
                </div>
              </div>

              {/* Metric 2: Transit */}
              <div className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1 sm:gap-3 px-1 sm:px-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 flex-shrink-0">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <div className="text-base sm:text-xl lg:text-2xl font-bold text-white leading-none whitespace-nowrap">
                    {currentData.transitRange}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-400 mt-1 leading-tight whitespace-nowrap">
                    {currentData.transitLabel}
                  </div>
                </div>
              </div>

              {/* Metric 3: Support */}
              <div className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1 sm:gap-3 px-1 sm:px-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 flex-shrink-0">
                  <Anchor className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-base font-bold text-white leading-none whitespace-nowrap">
                    {currentData.supportTitle}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-400 mt-1 leading-tight whitespace-nowrap">
                    {currentData.supportLabel}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
